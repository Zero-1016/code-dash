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
      return `좋아, 지금은 효율 얘기보다 왜 실패했는지부터 같이 잡자.
현재 통과는 ${passedCount}/${totalCount}개야.

실패 케이스 1개만 골라서 입력 -> 조건 분기 -> 반환값 순서로 따라가보자.
특히 경계값(빈 입력, 길이 1, 중복)에서 조건이 먼저 탈락하는지 확인해봐.

실패한 케이스 하나 붙여주면, 내가 그 흐름을 한 줄씩 같이 디버깅해줄게.

(${statusNote})`
    }

    return `Pass! 잘했다 👏 지금 통과는 ${passedCount}/${totalCount}개야.

이제 프로덕션 관점으로 한 단계만 더 올려보자.
- 시간복잡도: 중첩 루프가 있으면 O(n^2)일 가능성이 커. Map/Set으로 O(n)까지 줄일 수 있는지 보자.
- 공간복잡도: 보조 자료구조를 쓰는 대신 반복을 줄이는 트레이드오프가 맞는지 확인해보자.
- 네이밍: i, tmp 같은 이름은 역할 기반(countMap, left, current)으로 바꾸면 유지보수가 훨씬 쉬워져.

원하면 네 코드 기준으로 어떤 줄을 어떻게 바꾸면 좋은지 바로 제안해줄게.

(${statusNote})`
  }

  if (!allTestsPassed) {
    return `Let us focus on debugging first, not complexity yet.
Current pass count is ${passedCount}/${totalCount}.

Pick one failing case and trace input -> branch condition -> returned value line by line.
Share one failing example and I can walk through the exact break point with you.

(${statusNote})`
  }

  return `Pass! Nice work. You are at ${passedCount}/${totalCount}.

Now we can optimize:
- Time: if there are nested loops, check if Map/Set can reduce it.
- Space: verify the trade-off for auxiliary structures.
- Naming: replace short names with role-based names like left/countMap/current.

If you want, I can suggest concrete refactors on your current code.

(${statusNote})`
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
  const passedCount = testResults.filter((r) => r.passed).length
  const totalCount = testResults.length

  const prompt = `You are a **Supportive Coding Mentor** reviewing a student's solution for: "${problemTitle}"

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
- Keep the tone natural and conversational, like pair programming chat.
- Avoid rigid report sections or formal header templates.
- Use the test output as the first source of truth.
- ${allTestsPassed ? "All tests passed: congratulate briefly, then cover optimization (time/space), naming clarity, and production-ready refactoring." : "Tests failed: focus only on debugging root cause first. Trace line-by-line and explain why the output diverges. Do not discuss complexity yet."}
- Suggest algorithm alternatives naturally (Two Pointers / Stack / Hash Map trade-offs) when relevant.
- Do not dump a full solution unless explicitly requested.

Provide your supportive feedback now:

${getMentorPersonaInstruction(language)}
${getMentorLanguageInstruction(language)}`

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
  const passedCount = testResults.filter((r) => r.passed).length
  const totalCount = testResults.length

  const prompt = `You are a **Supportive Coding Mentor** reviewing a student's solution for: "${problemTitle}"

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
- Keep the tone natural and conversational, like pair programming chat.
- Avoid rigid report sections or formal header templates.
- Use the test output as the first source of truth.
- ${allTestsPassed ? "All tests passed: congratulate briefly, then cover optimization (time/space), naming clarity, and production-ready refactoring." : "Tests failed: focus only on debugging root cause first. Trace line-by-line and explain why the output diverges. Do not discuss complexity yet."}
- Suggest algorithm alternatives naturally (Two Pointers / Stack / Hash Map trade-offs) when relevant.
- Do not dump a full solution unless explicitly requested.

Provide your supportive feedback now:

${getMentorPersonaInstruction(language)}
${getMentorLanguageInstruction(language)}`

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
  const passedCount = testResults.filter((r) => r.passed).length
  const totalCount = testResults.length

  const prompt = `You are a **Supportive Coding Mentor** reviewing a student's solution for: "${problemTitle}"

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
- Keep the tone natural and conversational, like pair programming chat.
- Avoid rigid report sections or formal header templates.
- Use the test output as the first source of truth.
- ${allTestsPassed ? "All tests passed: congratulate briefly, then cover optimization (time/space), naming clarity, and production-ready refactoring." : "Tests failed: focus only on debugging root cause first. Trace line-by-line and explain why the output diverges. Do not discuss complexity yet."}
- Suggest algorithm alternatives naturally (Two Pointers / Stack / Hash Map trade-offs) when relevant.
- Do not dump a full solution unless explicitly requested.

Provide your supportive feedback now:

${getMentorPersonaInstruction(language)}
${getMentorLanguageInstruction(language)}`

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
