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

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatTestResult {
  passed: boolean
  input: string
  expected: string
  actual: string
}

interface ChatRequest {
  messages: ChatMessage[]
  code: string
  problemTitle: string
  problemDescription: string
  testResults?: ChatTestResult[]
  allTestsPassed?: boolean
  language?: MentorLanguage
  aiConfig?: Partial<AIConfigPayload>
}

const MENTOR_REPLY_FORMAT_RULES = `Reply format:
- Default: 1-2 short lines.
- Max: 4 short lines only if absolutely needed.
- No greetings, emojis, long intros, or "quick diagnostic questions".
- No markdown headings/bullets unless user explicitly asks for structured format.
- End with one concrete next step.`

function buildTestResultsContext(testResults: ChatTestResult[] = [], allTestsPassed?: boolean): string {
  if (!testResults.length) {
    return "No recent test output context was provided."
  }

  const lines = testResults.map(
    (result, index) =>
      `Test ${index + 1}: ${result.passed ? "PASS" : "FAIL"} | input=${result.input} | expected=${result.expected} | actual=${result.actual}`
  )

  return `Recent test outputs:
${lines.join("\n")}
Overall: ${allTestsPassed ? "ALL_PASS" : "HAS_FAIL"}`
}

function generateFallbackMentorResponse(
  language: MentorLanguage,
  code: string,
  messages: ChatMessage[],
  testResults: ChatTestResult[] = [],
  allTestsPassed?: boolean
): string {
  const latestUserMessage = [...messages].reverse().find((msg) => msg.role === "user")?.content.trim() ?? ""
  const hasCode = code.trim().length > 0
  const normalized = latestUserMessage.toLowerCase()
  const hasFailingTests = testResults.length > 0 && allTestsPassed === false

  const requestType = (() => {
    if (/(hint|힌트|단서)/i.test(normalized)) return "hint"
    if (/(review|리뷰|피드백)/i.test(normalized)) return "review"
    if (/(explain|설명|이해)/i.test(normalized)) return "explain"
    return "general"
  })()
  const asksConceptually = /(what|why|how|difference|개념|원리|차이|왜|어떻게|시간복잡도|공간복잡도|자료구조|알고리즘)/i.test(
    normalized
  )
  const asksDebug = /(error|실패|버그|디버깅|안돼|틀려|runtime|exception|stack trace|오류)/i.test(
    normalized
  )
  const asksConfirmation = /(맞나|맞나요|인가요|거요|그건가|이건가|즉|그러면|맞지)/i.test(normalized)
  const mentionsDuplicateCase = /(중복|duplicate|같은 숫자|같은 값|2번 들어|two same|same number)/i.test(
    normalized
  )
  const asksRelationally = /(대답하기 싫|무시하|왜 대답 안|답하기 싫)/i.test(normalized)
  const shouldUseDebugFlow = hasFailingTests || asksDebug

  if (language === "ko") {
    if (asksRelationally) {
      return `아니야, 네 질문에 맞춰서 제대로 답해주고 싶어.
지금 궁금한 걸 한 문장으로 다시 적어주면 바로 그 포인트만 짧게 답할게.`
    }

    if (asksConfirmation && mentionsDuplicateCase) {
      return `맞아, 그런 중복 케이스를 먼저 확인하는 게 핵심이야.
같은 값이 들어왔을 때 네 로직이 true/false 중 어느 쪽으로 가야 하는지만 먼저 정하고 테스트해보자.`
    }

    const context = hasCode
      ? "지금은 코드 전체보다 문제 조건 1개만 먼저 확인하면 돼. 예를 들면 빈 입력, 중복 값, 최소/최대 경계 같은 조건."
      : "코드가 없으면 예시 입력 1개를 손으로 먼저 추적해보자."
    const failingContext =
      hasFailingTests
        ? `실패 케이스부터 보자. (${testResults.filter((r) => r.passed).length}/${testResults.length} 통과)`
        : context

    if (requestType === "hint") {
      if (shouldUseDebugFlow) {
        return `${failingContext}
실패 케이스에서 입력이 조건문을 통과하는 순서를 한 줄씩 추적해봐.
원하면 실패 케이스 1개를 보내줘. 그 케이스 기준으로 다음 힌트를 바로 줄게.`
      }

      return `좋아, 첫 힌트만 바로 줄게.
먼저 중복/빈 입력/경계값 중 하나를 고르고, 그 경우에 정답이 어떻게 나와야 하는지 기준을 딱 정해봐.`
    }

    if (requestType === "review") {
      return `${context}
의도한 알고리즘을 한 줄로 적어줘. 실제 동작과 어긋나는 지점을 바로 짚어줄게.`
    }

    if (requestType === "explain") {
      return `핵심은 흐름이야: 문제를 한 문장으로 요약하고 자료구조 후보 2개만 써봐.
그중 이 문제 핵심에 맞는 선택을 짧게 정리해줄게.`
    }

    if (asksConceptually && !shouldUseDebugFlow) {
      return `좋아, 코드 없이도 충분히 풀 수 있어.
핵심 개념을 짧게 설명해줄게. 지금 궁금한 포인트 하나만 지정해주면 그 주제부터 바로 정리해줄게.`
    }

    if (shouldUseDebugFlow) {
      return `${failingContext}
오류 메시지나 실패 테스트 1개만 보내줘. 그 지점만 바로 같이 디버깅하자.`
    }

    return `${context}
아직 코드를 안 써도 괜찮아. 접근 아이디어(자료구조 후보 1-2개)만 적어주면 맞는 방향인지 바로 피드백해줄게.`
  }

  const failingContext =
    hasFailingTests
      ? `Start from one failing case first. (${testResults.filter((r) => r.passed).length}/${testResults.length} passing)`
      : null
  const context = hasCode
    ? "Focus on one concrete condition first (for example: empty input, duplicates, or min/max boundary cases)."
    : "If code is empty, trace one tiny example manually first."

  if (asksConfirmation && mentionsDuplicateCase) {
    return `Yes, checking duplicate-value cases first is a good move.
Decide expected behavior for that case, then verify your branch follows it consistently.`
  }

  if (requestType === "hint") {
    if (shouldUseDebugFlow) {
      return `${failingContext ?? context}
Trace one failing case line by line through your branch conditions.
If you share that single failing case, I can give the next focused hint.`
    }

    return `Good starting hint:
Pick one condition first (duplicates, empty input, or boundary values) and lock expected behavior for it.`
  }

  if (requestType === "review") {
    return `${context}
Write your intended algorithm in one line, and I will pinpoint where behavior drifts.`
  }

  if (requestType === "explain") {
    return `Summarize the problem in one sentence and list two data-structure candidates.
I will pick the better fit and explain why in short.`
  }

  if (asksConceptually && !shouldUseDebugFlow) {
    return `You can ask without writing code first.
Share one concept you want to clarify, and I will explain it with one practical example.`
  }

  if (shouldUseDebugFlow) {
    return `${failingContext ?? context}
Send one error or failed test, and we will debug only that point next.`
  }

  return `${context}
No code yet is fine. Send one approach idea, and I will tell you if it is a good direction.`
}

function buildChatSystemPrompt(
  problemTitle: string,
  problemDescription: string,
  code: string,
  testOutputContext: string
): string {
  return `You are a **Supportive Coding Mentor** helping a student work through: "${problemTitle}".

**Problem Description:**
${problemDescription}

**Student's Current Code:**
\`\`\`javascript
${code}
\`\`\`

**Recent Test Output Context:**
${testOutputContext}

**Your Role:**
You are mentoring like a senior teammate in pair programming chat.

**Guidelines:**
- If user asks a conceptual/no-code question, answer directly and clearly first; do not force debugging flow.
- If user asks for a first hint, provide the first-step hint immediately (do not ask for failed case first).
- If tests are failing, focus on root cause from outputs first. Avoid complexity talk at this stage.
- If tests are passing, brief congrats then suggest one optimization/refactor.
- Keep replies practical and context-aware.
- Do not paste full solution code unless explicitly requested.
- Do not use explicit labels like "[Level 1: Hint]" in replies.
- ${MENTOR_REPLY_FORMAT_RULES}

Remember: Help the learner think clearly, not just finish this one problem.`
}

// Helper to call Anthropic Claude API
async function chatWithClaude(
  messages: ChatMessage[],
  code: string,
  problemTitle: string,
  problemDescription: string,
  testOutputContext: string,
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const systemPrompt = buildChatSystemPrompt(
    problemTitle,
    problemDescription,
    code,
    testOutputContext
  )

  const mentorPersonaInstruction = getMentorPersonaInstruction(language)
  const languageInstruction = getMentorLanguageInstruction(language)

  const result = await generateText({
    model: getLanguageModel("claude", model, apiKey),
    system: `${systemPrompt}\n\n${mentorPersonaInstruction}\n\n${languageInstruction}`,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    maxOutputTokens,
    temperature: 0.7,
  })
  return result.text
}

// Helper to call OpenAI GPT API
async function chatWithGPT(
  messages: ChatMessage[],
  code: string,
  problemTitle: string,
  problemDescription: string,
  testOutputContext: string,
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const systemPrompt = buildChatSystemPrompt(
    problemTitle,
    problemDescription,
    code,
    testOutputContext
  )

  const mentorPersonaInstruction = getMentorPersonaInstruction(language)
  const languageInstruction = getMentorLanguageInstruction(language)

  const result = await generateText({
    model: getLanguageModel("gpt", model, apiKey),
    system: `${systemPrompt}\n\n${mentorPersonaInstruction}\n\n${languageInstruction}`,
    messages,
    maxOutputTokens,
    temperature: 0.7,
  })
  return result.text
}

// Helper to call Google Gemini API
async function chatWithGemini(
  messages: ChatMessage[],
  code: string,
  problemTitle: string,
  problemDescription: string,
  testOutputContext: string,
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const systemPrompt = buildChatSystemPrompt(
    problemTitle,
    problemDescription,
    code,
    testOutputContext
  )

  const mentorPersonaInstruction = getMentorPersonaInstruction(language)
  const languageInstruction = getMentorLanguageInstruction(language)

  const result = await generateText({
    model: getLanguageModel("gemini", model, apiKey),
    system: `${systemPrompt}\n\n${mentorPersonaInstruction}\n\n${languageInstruction}`,
    messages,
    maxOutputTokens,
    temperature: 0.7,
  })
  return result.text
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()
    const { messages, code, problemTitle, problemDescription } = body
    const testOutputContext = buildTestResultsContext(body.testResults ?? [], body.allTestsPassed)
    const learnerMessages = messages
      .filter((msg) => msg.role === "user")
      .map((msg) => msg.content)
    const language = resolveMentorLanguage(body.language, [
      ...learnerMessages,
      problemTitle,
      problemDescription,
    ])

    // Determine which AI provider to use
    const config = resolveAIConfig(body.aiConfig)

    let responseText: string

    try {
      let resolved: string | null = null
      for (const provider of providerCandidates(config)) {
        const apiKey = config.apiKeys[provider]?.trim()
        if (!apiKey) {
          continue
        }

        try {
          if (provider === "claude") {
            resolved = await chatWithClaude(
              messages,
              code,
              problemTitle,
              problemDescription,
              testOutputContext,
              language,
              apiKey,
              config.models.claude,
              config.maxTokens.claude
            )
            break
          }

          if (provider === "gpt") {
            resolved = await chatWithGPT(
              messages,
              code,
              problemTitle,
              problemDescription,
              testOutputContext,
              language,
              apiKey,
              config.models.gpt,
              config.maxTokens.gpt
            )
            break
          }

          resolved = await chatWithGemini(
            messages,
            code,
            problemTitle,
            problemDescription,
            testOutputContext,
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
        responseText = resolved
      } else {
        responseText = generateFallbackMentorResponse(
          language,
          code,
          messages,
          body.testResults ?? [],
          body.allTestsPassed
        )
      }
    } catch (error) {
      console.error("AI API error:", error)
      responseText = generateFallbackMentorResponse(
        language,
        code,
        messages,
        body.testResults ?? [],
        body.allTestsPassed
      )
    }

    return NextResponse.json({ message: responseText })
  } catch (error) {
    console.error("Error in chat endpoint:", error)
    return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 })
  }
}
