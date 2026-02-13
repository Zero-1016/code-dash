import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import {
  providerCandidates,
  resolveAIConfig,
  type AIConfigPayload,
} from "@/lib/ai-config"
import { getLanguageModel } from "@/lib/server/ai-model"
import {
  getMentorLanguageInstruction,
  resolveMentorLanguage,
  type MentorLanguage,
} from "@/lib/mentor-language"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  code: string
  problemTitle: string
  problemDescription: string
  language?: MentorLanguage
  aiConfig?: Partial<AIConfigPayload>
}

function generateFallbackMentorResponse(
  language: MentorLanguage,
  code: string,
  messages: ChatMessage[]
): string {
  const latestUserMessage = [...messages].reverse().find((msg) => msg.role === "user")?.content.trim() ?? ""
  const hasCode = code.trim().length > 0
  const normalized = latestUserMessage.toLowerCase()

  const requestType = (() => {
    if (/(hint|힌트|단서)/i.test(normalized)) return "hint"
    if (/(review|리뷰|피드백)/i.test(normalized)) return "review"
    if (/(explain|설명|이해)/i.test(normalized)) return "explain"
    return "general"
  })()

  if (language === "ko") {
    const lead = "좋아, 나는 지금부터 네 사고 흐름을 잡아주는 멘토로 같이 갈게."
    const context = hasCode
      ? "지금 코드 기준으로 핵심 분기 하나만 먼저 좁혀보자."
      : "아직 코드가 없다면 예시 입력 하나를 손으로 추적하면서 시작하자."

    if (requestType === "hint") {
      return `${lead}

${context}
정답 코드를 주기보다, 지금 막히는 조건 하나를 정확히 찾는 게 먼저야.
실패한 케이스 1개만 가져오면 그 케이스를 기준으로 다음 힌트를 바로 이어서 줄게.`
    }

    if (requestType === "review") {
      return `${lead}

${context}
리뷰는 "의도한 로직"과 "실제 동작"의 차이를 찾는 과정이야.
네가 의도한 알고리즘을 한 줄로 적어주면, 틀어지는 지점을 멘토 관점으로 짚어줄게.`
    }

    if (requestType === "explain") {
      return `${lead}

개념은 외우는 게 아니라 흐름으로 이해하면 오래가.
문제를 한 문장으로 요약하고 필요한 자료구조 후보를 2개만 적어봐.
그다음 어떤 선택이 맞는지 이유까지 같이 정리해줄게.`
    }

    return `${lead}

${context}
지금은 넓게 보지 말고, 가장 먼저 깨지는 포인트 하나만 고르자.
오류 메시지나 실패 테스트를 보내주면 그 지점만 집중해서 다음 단계를 안내할게.`
  }

  const lead = "Good. I will mentor your thinking process step by step."
  const context = hasCode
    ? "Let's narrow down one critical branch in your current code first."
    : "If code is empty, start by tracing one tiny example manually."

  if (requestType === "hint") {
    return `${lead}

${context}
Instead of giving the final code, we should isolate the first failing condition.
Share one failing case and I will give you the next targeted hint from there.`
  }

  if (requestType === "review") {
    return `${lead}

${context}
A good review compares intended logic vs actual behavior.
Write your intended algorithm in one line, and I will pinpoint where it drifts.`
  }

  if (requestType === "explain") {
    return `${lead}

Concepts stick when you understand the flow, not just definitions.
Summarize the problem in one sentence and list two candidate data structures.
I will help you choose the right one and explain why.`
  }

  return `${lead}

${context}
Do not debug everything at once; pick the first breaking point.
Send the error or failed test and I will guide only that step next.`
}

// Helper to call Anthropic Claude API
async function chatWithClaude(
  messages: ChatMessage[],
  code: string,
  problemTitle: string,
  problemDescription: string,
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const systemPrompt = `You are a **Supportive Coding Mentor** helping a student work through: "${problemTitle}".

**Problem Description:**
${problemDescription}

**Student's Current Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Role:**
You're here to guide the student to **think like a developer** and build problem-solving confidence. Your goal is to help them discover solutions, not hand them over.

**Guidelines:**
- Be warm, encouraging, and patient
- Celebrate their effort and progress
- Ask thoughtful questions that guide them toward insights ("What happens when...?" "Have you considered...?")
- Provide hints that reveal thinking patterns, not code
- Explain concepts clearly with real-world analogies when helpful
- Point out errors or issues if they're stuck
- Keep responses conversational and brief (2-4 sentences ideal)
- If they ask for hints, give progressively helpful clues
- **Never** write complete solution code unless they explicitly ask for it
- Help build their debugging and analytical skills

Remember: Your job is to make them better developers, not just solve this one problem for them.`

  const languageInstruction = getMentorLanguageInstruction(language)

  const result = await generateText({
    model: getLanguageModel("claude", model, apiKey),
    system: `${systemPrompt}\n\n${languageInstruction}`,
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
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const systemPrompt = `You are a **Supportive Coding Mentor** helping a student work through: "${problemTitle}".

**Problem Description:**
${problemDescription}

**Student's Current Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Role:**
You're here to guide the student to **think like a developer** and build problem-solving confidence. Your goal is to help them discover solutions, not hand them over.

**Guidelines:**
- Be warm, encouraging, and patient
- Celebrate their effort and progress
- Ask thoughtful questions that guide them toward insights ("What happens when...?" "Have you considered...?")
- Provide hints that reveal thinking patterns, not code
- Explain concepts clearly with real-world analogies when helpful
- Point out errors or issues if they're stuck
- Keep responses conversational and brief (2-4 sentences ideal)
- If they ask for hints, give progressively helpful clues
- **Never** write complete solution code unless they explicitly ask for it
- Help build their debugging and analytical skills

Remember: Your job is to make them better developers, not just solve this one problem for them.`

  const languageInstruction = getMentorLanguageInstruction(language)

  const result = await generateText({
    model: getLanguageModel("gpt", model, apiKey),
    system: `${systemPrompt}\n\n${languageInstruction}`,
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
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const systemPrompt = `You are a **Supportive Coding Mentor** helping a student work through: "${problemTitle}".

**Problem Description:**
${problemDescription}

**Student's Current Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Role:**
You're here to guide the student to **think like a developer** and build problem-solving confidence. Your goal is to help them discover solutions, not hand them over.

**Guidelines:**
- Be warm, encouraging, and patient
- Celebrate their effort and progress
- Ask thoughtful questions that guide them toward insights ("What happens when...?" "Have you considered...?")
- Provide hints that reveal thinking patterns, not code
- Explain concepts clearly with real-world analogies when helpful
- Point out errors or issues if they're stuck
- Keep responses conversational and brief (2-4 sentences ideal)
- If they ask for hints, give progressively helpful clues
- **Never** write complete solution code unless they explicitly ask for it
- Help build their debugging and analytical skills

Remember: Your job is to make them better developers, not just solve this one problem for them.`

  const languageInstruction = getMentorLanguageInstruction(language)

  const result = await generateText({
    model: getLanguageModel("gemini", model, apiKey),
    system: `${systemPrompt}\n\n${languageInstruction}`,
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
    const language = resolveMentorLanguage(body.language)

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
          messages
        )
      }
    } catch (error) {
      console.error("AI API error:", error)
      responseText = generateFallbackMentorResponse(
        language,
        code,
        messages
      )
    }

    return NextResponse.json({ message: responseText })
  } catch (error) {
    console.error("Error in chat endpoint:", error)
    return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 })
  }
}
