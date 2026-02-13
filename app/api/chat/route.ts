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
  const latestUserMessage = [...messages].reverse().find((msg) => msg.role === "user")?.content.trim()
  const hasCode = code.trim().length > 0

  if (language === "ko") {
    return `AI 연결 없이도 지금 바로 같이 풀어볼게요.${latestUserMessage ? `\n\n질문: "${latestUserMessage}"` : ""}

${hasCode ? "현재 코드 기준으로 점검해보면 좋아요." : "아직 코드가 비어 있다면 먼저 작은 예제로 시작해보세요."}

다음 3가지만 확인해보세요.
- 입력/출력 예시를 손으로 1번 추적했는지
- 시간복잡도를 O(n^2)에서 줄일 수 있는 자료구조 후보가 있는지
- 엣지 케이스(빈 배열, 중복값, 최소/최대값)를 분리해서 테스트했는지

원하면 현재 막힌 지점(테스트 케이스/오류 메시지/의도한 로직)을 한 줄로 적어주세요. 그 지점만 집중해서 다음 힌트를 줄게요.`
  }

  return `Let's keep moving even without a live AI provider.${latestUserMessage ? `\n\nQuestion: "${latestUserMessage}"` : ""}

${hasCode ? "We can still reason from your current code." : "If your editor is empty, start with a tiny example first."}

Check these 3 items next:
- Did you trace one sample input-output by hand?
- Is there a data structure that can reduce O(n^2) behavior?
- Did you isolate edge cases (empty input, duplicates, min/max values)?

If you share your exact blocker (failing test, error message, or intended logic), I can give a focused next hint for that part.`
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
