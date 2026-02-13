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
  getMentorReviewFormatInstruction,
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
        ? "현재 API Key가 없어 AI 심층 분석은 제한돼요. 그래도 멘토 포맷으로 핵심을 짚어줄게요."
        : "No API key is configured, so deep AI analysis is limited. Here is a mentor-style review."
      : language === "ko"
        ? "AI 연결이 일시적으로 불안정해도, 지금 결과 기준으로 멘토 리뷰를 이어갈게요."
        : "AI service is temporarily unstable, but here is a mentor-style review from current results."

  if (language === "ko") {
    return `### 📊 Complexity Report
- Time Complexity: 현재 코드를 직접 실행 분석하진 못하지만, 테스트 통과율은 ${passedCount}/${totalCount}입니다. ${allTestsPassed ? "반복 구조를 한 단계 줄일 수 있는지(O(n^2) -> O(n) 가능성) 점검해보세요." : "실패 케이스를 기준으로 분기 조건이 불필요하게 중첩되지 않았는지 먼저 확인하세요."}
- Space Complexity: 보조 자료구조(Map/Set/배열)를 어디에 쓰는지 기준으로 공간 사용을 점검하세요. 불필요한 복사나 중간 배열 생성이 있으면 줄이는 것이 좋습니다.

### 🏷️ Naming & Clean Code
- Variable Naming: 단축 변수명('i', 'm', 'tmp')은 역할 기반 이름('left', 'countMap', 'currentSum')으로 바꾸면 디버깅 속도가 빨라집니다.
- Refactoring: 조건문을 함수로 분리하고, 상수를 'const'로 명시해 의도를 드러내세요. TypeScript에서는 입력/출력 타입을 먼저 고정하면 실수를 줄일 수 있습니다.

### 💡 Friendly Deep-dive
문제 해결은 "정답 맞히기"보다 "흐름 고정"이 더 중요해요. 지금은 실패하는 테스트 1개를 골라서 입력이 들어온 뒤 값이 어떻게 변하는지 한 줄씩 추적해보세요. Map은 메모장처럼 "이미 본 정보"를 빠르게 꺼내 쓰는 도구라서, 반복문을 줄일 때 특히 강합니다.

_Note: ${statusNote}_`
  }

  return `### 📊 Complexity Report
- Time Complexity: Direct runtime analysis is limited right now. Current pass rate is ${passedCount}/${totalCount}. ${allTestsPassed ? "Check whether nested loops can be reduced." : "Start with the first failing case and validate branch conditions."}
- Space Complexity: Review where auxiliary structures (Map/Set/arrays) are used and remove unnecessary copies.

### 🏷️ Naming & Clean Code
- Variable Naming: Replace short names with role-based names like \`left\`, \`countMap\`, \`currentSum\`.
- Refactoring: Extract branch logic into small functions and make intent explicit with strong TypeScript typing.

### 💡 Friendly Deep-dive
Focus on one failing case and trace state changes line by line. Think of Map as a quick-access notebook for things you've already seen.

_Note: ${statusNote}_`
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

**Your Role as a Supportive Coding Mentor:**
Your goal is to help the student **think like a developer** and grow their problem-solving skills. You're not here to just point out mistakes, but to guide them toward understanding.

**Your Task:**
1. **Analyze**: Look at their approach and logic
2. **Encourage**: Recognize what they did well, even if tests are failing
3. **Guide**: ${allTestsPassed ? "Suggest how they might optimize or refactor their solution" : "Ask thoughtful questions to help them discover what's wrong (don't give away the answer!)"}
4. **Teach**: Help them understand the 'why' behind the issue or improvement

**Guidelines:**
- Be warm, encouraging, and supportive
- Celebrate their progress and effort
- If tests are failing, use guiding questions like "What happens when...?" or "Have you considered...?"
- Help them build their debugging intuition
- Keep feedback concise but insightful (3-4 short paragraphs)
- Use a friendly, conversational tone
- Format with markdown for readability

Provide your supportive feedback now:

${getMentorPersonaInstruction(language)}
${getMentorReviewFormatInstruction(language)}
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

**Your Role as a Supportive Coding Mentor:**
Your goal is to help the student **think like a developer** and grow their problem-solving skills. You're not here to just point out mistakes, but to guide them toward understanding.

**Your Task:**
1. **Analyze**: Look at their approach and logic
2. **Encourage**: Recognize what they did well, even if tests are failing
3. **Guide**: ${allTestsPassed ? "Suggest how they might optimize or refactor their solution" : "Ask thoughtful questions to help them discover what's wrong (don't give away the answer!)"}
4. **Teach**: Help them understand the 'why' behind the issue or improvement

**Guidelines:**
- Be warm, encouraging, and supportive
- Celebrate their progress and effort
- If tests are failing, use guiding questions like "What happens when...?" or "Have you considered...?"
- Help them build their debugging intuition
- Keep feedback concise but insightful (3-4 short paragraphs)
- Use a friendly, conversational tone
- Format with markdown for readability

Provide your supportive feedback now:

${getMentorPersonaInstruction(language)}
${getMentorReviewFormatInstruction(language)}
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

**Your Role as a Supportive Coding Mentor:**
Your goal is to help the student **think like a developer** and grow their problem-solving skills. You're not here to just point out mistakes, but to guide them toward understanding.

**Your Task:**
1. **Analyze**: Look at their approach and logic
2. **Encourage**: Recognize what they did well, even if tests are failing
3. **Guide**: ${allTestsPassed ? "Suggest how they might optimize or refactor their solution" : "Ask thoughtful questions to help them discover what's wrong (don't give away the answer!)"}
4. **Teach**: Help them understand the 'why' behind the issue or improvement

**Guidelines:**
- Be warm, encouraging, and supportive
- Celebrate their progress and effort
- If tests are failing, use guiding questions like "What happens when...?" or "Have you considered...?"
- Help them build their debugging intuition
- Keep feedback concise but insightful (3-4 short paragraphs)
- Use a friendly, conversational tone
- Format with markdown for readability

Provide your supportive feedback now:

${getMentorPersonaInstruction(language)}
${getMentorReviewFormatInstruction(language)}
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
