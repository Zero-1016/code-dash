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
- Keep it concise by default, but use as many lines as needed for clarity.
- No greetings, emojis, formal report sections, or long checklists.
- Focus on the single highest-impact point first.
- Avoid rhetorical questions and repetitive praise.
- Keep it to one short acknowledgement + one concrete action point whenever possible.`

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
    maxOutputTokens,
    temperature: 0.7,
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
    maxOutputTokens,
    temperature: 0.7,
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
    maxOutputTokens,
    temperature: 0.7,
  })
  return result.text
}

export async function POST(req: NextRequest) {
  try {
    const body: ReviewRequest = await req.json()
    const { code, problemTitle, problemDescription, testResults, allTestsPassed } = body
    const language = resolveMentorLanguage(body.language, [problemTitle, problemDescription])

    const config = resolveAIConfig(body.aiConfig)

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
        feedback = resolved
      } else {
        feedback = generateFallbackReviewFeedback(
          language,
          testResults.filter((r) => r.passed).length,
          testResults.length,
          allTestsPassed,
          "no-key"
        )
      }
    } catch (error) {
      console.error("AI API error:", error)
      feedback = generateFallbackReviewFeedback(
        language,
        testResults.filter((r) => r.passed).length,
        testResults.length,
        allTestsPassed,
        "service-error"
      )
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error in code review:", error)
    return NextResponse.json({ feedback: "An error occurred while reviewing your code." }, { status: 500 })
  }
}
