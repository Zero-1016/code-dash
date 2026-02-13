import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import {
  providerCandidates,
  resolveAIConfig,
  type AIConfigPayload,
} from "@/lib/ai-config"
import { getLanguageModel } from "@/lib/server/ai-model"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  code: string
  problemTitle: string
  problemDescription: string
  aiConfig?: Partial<AIConfigPayload>
}

// Helper to call Anthropic Claude API
async function chatWithClaude(
  messages: ChatMessage[],
  code: string,
  problemTitle: string,
  problemDescription: string,
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

  const result = await generateText({
    model: getLanguageModel("claude", model, apiKey),
    system: systemPrompt,
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

  const result = await generateText({
    model: getLanguageModel("gpt", model, apiKey),
    system: systemPrompt,
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

  const result = await generateText({
    model: getLanguageModel("gemini", model, apiKey),
    system: systemPrompt,
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
        return NextResponse.json(
          {
            message:
              "AI chat is not available. Please configure at least one AI API key in My Page.",
          },
          { status: 503 }
        )
      }
    } catch (error) {
      console.error("AI API error:", error)
      return NextResponse.json(
        { message: "Sorry, I'm having trouble connecting right now. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: responseText })
  } catch (error) {
    console.error("Error in chat endpoint:", error)
    return NextResponse.json({ message: "An error occurred. Please try again." }, { status: 500 })
  }
}
