import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import {
  providerCandidates,
  resolveAIConfig,
  type AIConfigPayload,
} from "@/lib/ai-config"
import { getLanguageModel } from "@/lib/server/ai-model"
import {
  getMentorPersonaInstruction,
  getMentorLanguageInstruction,
  resolveMentorLanguage,
  type MentorLanguage,
} from "@/lib/mentor-language"

interface TestResult {
  passed: boolean
  input: string
  expected: string
  actual: string
}

interface ReviewRequest {
  code: string
  problemTitle: string
  problemDescription: string
  testResults: TestResult[]
  allTestsPassed: boolean
  language?: MentorLanguage
  aiConfig?: Partial<AIConfigPayload>
}

const REVIEW_REPLY_FORMAT_RULES = `Reply format:
- Write like a real KakaoTalk/Slack teammate chat message: natural and appropriately sized for context.
- Keep it concise by default, but use as many lines as needed for clarity.
- No greetings, emojis, formal report sections, or long checklists.
- Focus on the single highest-impact point first.
- Avoid rhetorical questions and repetitive praise.
- Keep it to one short acknowledgement + one concrete action point whenever possible.`

const LOW_SIGNAL_KO_PATTERNS = [
  "좋은 시도",
  "좋은 접근",
  "잘하고 있어",
  "전반적으로",
  "일반적으로",
  "조금 더 개선",
]

const LOW_SIGNAL_EN_PATTERNS = [
  "good attempt",
  "good job",
  "overall",
  "generally",
  "could be improved",
  "looks fine",
]

function resolveResponseTokenLimit(maxOutputTokens: number): number {
  return Math.max(256, maxOutputTokens)
}

function isLowSignalReview(text: string, language: MentorLanguage): boolean {
  const normalized = text.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  const lineCount = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean).length
  const hasTestReference = /(test|케이스|입력|expected|actual|pass|fail|통과|실패)/i.test(text)
  const hasConcreteAction = /(replace|change|trace|check|use|추적|바꿔|확인|사용|적용)/i.test(text)

  const matchedPattern =
    language === "ko"
      ? LOW_SIGNAL_KO_PATTERNS.some((pattern) => normalized.includes(pattern))
      : LOW_SIGNAL_EN_PATTERNS.some((pattern) => normalized.includes(pattern))

  if (lineCount <= 1 && !hasTestReference) {
    return true
  }
  if (matchedPattern && !hasConcreteAction) {
    return true
  }
  return !hasTestReference && !hasConcreteAction
}

function buildDeterministicReviewFallback(
  language: MentorLanguage,
  testResults: TestResult[],
  allTestsPassed: boolean,
  code: string
): string {
  const firstFailed = testResults.find((result) => !result.passed)
  const hasNestedLoop = /for\s*\(.*\)\s*{[\s\S]*for\s*\(/.test(code)

  if (language === "ko") {
    if (!allTestsPassed && firstFailed) {
      return `지금은 ${testResults.filter((r) => r.passed).length}/${testResults.length} 통과야. 먼저 실패한 케이스 1개부터 고치자.
입력: ${firstFailed.input}
기대값: ${firstFailed.expected}, 실제값: ${firstFailed.actual}
다음 액션: 이 케이스를 기준으로 조건문 분기 순서를 위에서 아래로 한 줄씩 추적하고, 기대값과 다른 첫 분기 지점만 수정해봐.`
    }

    return hasNestedLoop
      ? "테스트는 통과했어. 다음으로 중첩 루프를 줄일 수 있는지부터 보자. Map/Set으로 조회를 O(1)로 바꾸면 반복 스캔을 줄일 가능성이 커."
      : "테스트는 통과했어. 다음 액션은 함수 책임을 한 단계만 분리하는 거야. 경계값 처리(빈 입력/최소 길이)를 early return으로 먼저 두면 유지보수가 쉬워져."
  }

  if (!allTestsPassed && firstFailed) {
    return `You are at ${testResults.filter((r) => r.passed).length}/${testResults.length}. Fix one failing case first.
Input: ${firstFailed.input}
Expected: ${firstFailed.expected}, Actual: ${firstFailed.actual}
Next action: trace the branch order top-down for this case and patch only the first branch where behavior diverges from expected output.`
  }

  return hasNestedLoop
    ? "Your tests pass. Next action: reduce nested scans first. Consider replacing repeated lookups with Map/Set for O(1) access."
    : "Your tests pass. Next action: isolate one responsibility. Put boundary checks (empty/min length) as early returns to simplify maintenance."
}

function finalizeMentorResponse(
  text: string,
  language: MentorLanguage,
  allTestsPassed: boolean
): string {
  const trimmed = text.trim()
  if (!trimmed) {
    return language === "ko"
      ? allTestsPassed
        ? "테스트는 통과했습니다. 다음 단계로 성능 개선 포인트 한 가지를 적용해보세요."
        : "아직 테스트가 통과되지 않았습니다. 실패 케이스 1개부터 분기 흐름을 점검해보세요."
      : allTestsPassed
        ? "Your solution passes tests. Next, apply one performance improvement."
        : "Your solution is not passing yet. Start by tracing one failing case."
  }

  const danglingKo =
    /(다만|그리고|또한|하지만|근데|즉|예를 들어|예를들어|우선|먼저|결론적으로)\s*[,，:]?\s*$/u
  const danglingEn =
    /(however|but|and|so|for example|first|next|then)\s*[,:\-]?\s*$/iu
  const danglingListMarker = /(?:[:\-]\s*|\*\s*|•\s*|\d+\.\s*)$/u

  let normalized = trimmed
  if (danglingKo.test(normalized) || danglingEn.test(normalized) || danglingListMarker.test(normalized)) {
    normalized = normalized.replace(danglingKo, "").replace(danglingEn, "").trim()
    normalized = normalized.replace(danglingListMarker, "").trim()
    const completion =
      language === "ko"
        ? allTestsPassed
          ? "다음 단계는 중복 순회를 줄이는 개선 한 가지만 적용해보세요."
          : "다음 단계로 실패 케이스 1개를 기준으로 분기 흐름을 다시 확인해보세요."
        : allTestsPassed
          ? "Next, apply one improvement to reduce repeated scans."
          : "Next, re-check branch flow with one failing case."
    normalized = normalized ? `${normalized}\n${completion}` : completion
  }

  if (!/[.!?…]$/.test(normalized) && !/[다요죠까네]$/.test(normalized)) {
    normalized = `${normalized}.`
  }

  return normalized
}

function generateFallbackReviewFeedback(
  language: MentorLanguage,
  passedCount: number,
  totalCount: number,
  allTestsPassed: boolean,
  note: "no-key" | "service-error"
): string {
  const statusNote =
    note === "no-key"
      ? language === "ko"
        ? "지금은 API Key가 없어도, 테스트 결과 기반으로 같이 디버깅/개선해볼 수 있어."
        : "No API key is configured, so deep AI analysis is limited. Here is a mentor-style review."
      : language === "ko"
        ? "AI 연결이 잠깐 불안정하지만, 지금 결과 기준으로 같이 이어가보자."
        : "AI service is temporarily unstable, but here is a mentor-style review from current results."

  if (language === "ko") {
    if (!allTestsPassed) {
      return `현재 ${passedCount}/${totalCount} 통과니까, 복잡도보다 실패 원인 한 군데부터 잡자.
실패 케이스 1개를 보내주면 입력 -> 분기 -> 반환 흐름으로 바로 짚어줄게. (${statusNote})`
    }

    return `Pass(${passedCount}/${totalCount}) 좋다. 이제 중첩 루프를 줄일 수 있는지랑 변수명 역할이 명확한지만 빠르게 점검하자.
원하면 네 코드에서 수정 우선순위 1개만 바로 골라줄게. (${statusNote})`
  }

  if (!allTestsPassed) {
    return `You are at ${passedCount}/${totalCount}; debug one failing path first before complexity.
Share one failing case and I will trace input -> branch -> return with you. (${statusNote})`
  }

  return `Pass at ${passedCount}/${totalCount}. Now check one optimization point (nested loops -> Map/Set) and one naming cleanup.
If you want, I can mark the first refactor target directly on your code. (${statusNote})`
}

function buildReviewPrompt(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean,
  language: MentorLanguage
): string {
  const passedCount = testResults.filter((r) => r.passed).length
  const totalCount = testResults.length

  return `You are a **Supportive Coding Mentor** reviewing a student's solution for: "${problemTitle}"

**Problem Description:**
${problemDescription}

**Student's Code:**
\`\`\`javascript
${code}
\`\`\`

**Test Results:** ${passedCount}/${totalCount} tests passed

${testResults
  .map(
    (r, i) => `Test ${i + 1}: ${r.passed ? "✓ PASSED" : "✗ FAILED"}
${!r.passed ? `  Input: ${r.input}\n  Expected: ${r.expected}\n  Got: ${r.actual}` : ""}`
  )
  .join("\n")}

**Mentoring Mode:**
- Use test output as the first source of truth.
- ${
    allTestsPassed
      ? "All tests passed: explicitly confirm the solution is currently correct first, then suggest one optimization/refactor."
      : "Tests failed: clearly state it is not correct yet, then debug root cause first; do not discuss complexity yet."
  }
- Suggest algorithm alternatives naturally when relevant.
- Do not dump a full solution unless explicitly requested.
- Reference at least one concrete test detail (input/expected/actual or pass count).
- Include exactly one next action that the learner can execute immediately.
- ${REVIEW_REPLY_FORMAT_RULES}

Provide your supportive feedback now:

${getMentorPersonaInstruction(language)}
${getMentorLanguageInstruction(language)}`
}

async function reviewWithClaude(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean,
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = buildReviewPrompt(
    code,
    problemTitle,
    problemDescription,
    testResults,
    allTestsPassed,
    language
  )

  const result = await generateText({
    model: getLanguageModel("claude", model, apiKey),
    prompt,
    maxOutputTokens: resolveResponseTokenLimit(maxOutputTokens),
    temperature: 0.35,
  })
  return result.text
}

async function reviewWithGPT(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean,
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = buildReviewPrompt(
    code,
    problemTitle,
    problemDescription,
    testResults,
    allTestsPassed,
    language
  )

  const result = await generateText({
    model: getLanguageModel("gpt", model, apiKey),
    system:
      "You are a helpful coding mentor who provides constructive feedback and guides students to learn.",
    prompt,
    maxOutputTokens: resolveResponseTokenLimit(maxOutputTokens),
    temperature: 0.35,
  })
  return result.text
}

async function reviewWithGemini(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean,
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = buildReviewPrompt(
    code,
    problemTitle,
    problemDescription,
    testResults,
    allTestsPassed,
    language
  )

  const result = await generateText({
    model: getLanguageModel("gemini", model, apiKey),
    prompt,
    maxOutputTokens: resolveResponseTokenLimit(maxOutputTokens),
    temperature: 0.35,
  })
  return result.text
}

export async function POST(req: NextRequest) {
  try {
    const body: ReviewRequest = await req.json()
    const { code, problemTitle, problemDescription, testResults, allTestsPassed } = body
    const language = resolveMentorLanguage(body.language, [problemTitle, problemDescription])

    const config = resolveAIConfig(body.aiConfig)
    const selectedProvider = config.provider
    const selectedApiKey = config.apiKeys[selectedProvider]?.trim()
    const selectedModel = config.models[selectedProvider]?.trim()

    if (!selectedApiKey || !selectedModel) {
      return NextResponse.json(
        {
          feedback: "",
          message: "AI mentor is not configured for the selected provider.",
        },
        { status: 400 }
      )
    }

    let feedback: string

    try {
      let resolved: string | null = null
      for (const provider of providerCandidates(config)) {
        const apiKey = config.apiKeys[provider]?.trim()
        if (!apiKey) {
          continue
        }

        try {
          if (provider === "claude") {
            resolved = await reviewWithClaude(
              code,
              problemTitle,
              problemDescription,
              testResults,
              allTestsPassed,
              language,
              apiKey,
              config.models.claude,
              config.maxTokens.claude
            )
            break
          }

          if (provider === "gpt") {
            resolved = await reviewWithGPT(
              code,
              problemTitle,
              problemDescription,
              testResults,
              allTestsPassed,
              language,
              apiKey,
              config.models.gpt,
              config.maxTokens.gpt
            )
            break
          }

          resolved = await reviewWithGemini(
            code,
            problemTitle,
            problemDescription,
            testResults,
            allTestsPassed,
            language,
            apiKey,
            config.models.gemini,
            config.maxTokens.gemini
          )
          break
        } catch (error) {
          console.error(`AI API error (${provider}):`, error)
        }
      }

      if (resolved) {
        const refined = isLowSignalReview(resolved, language)
          ? buildDeterministicReviewFallback(language, testResults, allTestsPassed, code)
          : resolved
        feedback = finalizeMentorResponse(refined, language, allTestsPassed)
      } else {
        feedback = finalizeMentorResponse(
          generateFallbackReviewFeedback(
            language,
            testResults.filter((r) => r.passed).length,
            testResults.length,
            allTestsPassed,
            "no-key"
          ),
          language,
          allTestsPassed
        )
      }
    } catch (error) {
      console.error("AI API error:", error)
      feedback = finalizeMentorResponse(
        generateFallbackReviewFeedback(
          language,
          testResults.filter((r) => r.passed).length,
          testResults.length,
          allTestsPassed,
          "service-error"
        ),
        language,
        allTestsPassed
      )
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error in code review:", error)
    return NextResponse.json({ feedback: "An error occurred while reviewing your code." }, { status: 500 })
  }
}
