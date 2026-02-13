import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import {
  providerCandidates,
  resolveAIConfig,
  type AIConfigPayload,
} from "@/lib/ai-config"
import { getLanguageModel } from "@/lib/server/ai-model"

interface StrategicHintRequest {
  problemTitle: string
  problemDescription: string
  code: string
  elapsedMinutes: number
  aiConfig?: Partial<AIConfigPayload>
}

async function generateHintWithClaude(
  problemTitle: string,
  problemDescription: string,
  code: string,
  elapsedMinutes: number,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = `You are a **Supportive Coding Mentor** helping a student who has been working on this problem for ${elapsedMinutes} minutes.

**Problem:** "${problemTitle}"

**Description:**
${problemDescription}

**Student's Current Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Role:**
You are NOT here to solve the problem for them. You are here to provide a **Strategic Hint** that:
1. Reveals the **core algorithm or data structure** they should consider
2. Provides a **decisive clue** about the optimal approach (e.g., "Try using a Hash Map to reduce complexity to O(n)")
3. Helps them **think like a developer** by explaining WHY this approach works
4. **DOES NOT** provide any actual solution code

**Guidelines:**
- Be warm, encouraging, and supportive
- Focus on the conceptual breakthrough they need
- Explain the "aha moment" without crossing the finish line for them
- Use analogies or real-world examples when helpful
- Keep it concise (2-4 paragraphs)
- Format with markdown for readability

**Important:** This is a crucial moment - they've been stuck for ${elapsedMinutes} minutes. Give them the key insight they need to succeed, but let them implement it themselves.

Provide your strategic hint now:`

  const result = await generateText({
    model: getLanguageModel("claude", model, apiKey),
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  return result.text
}

async function generateHintWithGPT(
  problemTitle: string,
  problemDescription: string,
  code: string,
  elapsedMinutes: number,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = `You are a **Supportive Coding Mentor** helping a student who has been working on this problem for ${elapsedMinutes} minutes.

**Problem:** "${problemTitle}"

**Description:**
${problemDescription}

**Student's Current Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Role:**
You are NOT here to solve the problem for them. You are here to provide a **Strategic Hint** that:
1. Reveals the **core algorithm or data structure** they should consider
2. Provides a **decisive clue** about the optimal approach (e.g., "Try using a Hash Map to reduce complexity to O(n)")
3. Helps them **think like a developer** by explaining WHY this approach works
4. **DOES NOT** provide any actual solution code

**Guidelines:**
- Be warm, encouraging, and supportive
- Focus on the conceptual breakthrough they need
- Explain the "aha moment" without crossing the finish line for them
- Use analogies or real-world examples when helpful
- Keep it concise (2-4 paragraphs)
- Format with markdown for readability

**Important:** This is a crucial moment - they've been stuck for ${elapsedMinutes} minutes. Give them the key insight they need to succeed, but let them implement it themselves.

Provide your strategic hint now:`

  const result = await generateText({
    model: getLanguageModel("gpt", model, apiKey),
    system:
      "You are a supportive coding mentor who provides strategic hints and guides students to think like developers. You never give away complete solutions.",
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  return result.text
}

async function generateHintWithGemini(
  problemTitle: string,
  problemDescription: string,
  code: string,
  elapsedMinutes: number,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = `You are a **Supportive Coding Mentor** helping a student who has been working on this problem for ${elapsedMinutes} minutes.

**Problem:** "${problemTitle}"

**Description:**
${problemDescription}

**Student's Current Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Role:**
You are NOT here to solve the problem for them. You are here to provide a **Strategic Hint** that:
1. Reveals the **core algorithm or data structure** they should consider
2. Provides a **decisive clue** about the optimal approach (e.g., "Try using a Hash Map to reduce complexity to O(n)")
3. Helps them **think like a developer** by explaining WHY this approach works
4. **DOES NOT** provide any actual solution code

**Guidelines:**
- Be warm, encouraging, and supportive
- Focus on the conceptual breakthrough they need
- Explain the "aha moment" without crossing the finish line for them
- Use analogies or real-world examples when helpful
- Keep it concise (2-4 paragraphs)
- Format with markdown for readability

**Important:** This is a crucial moment - they've been stuck for ${elapsedMinutes} minutes. Give them the key insight they need to succeed, but let them implement it themselves.

Provide your strategic hint now:`

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
    const body: StrategicHintRequest = await req.json()
    const { problemTitle, problemDescription, code, elapsedMinutes } = body

    const config = resolveAIConfig(body.aiConfig)

    let hint: string

    try {
      let resolved: string | null = null
      for (const provider of providerCandidates(config)) {
        const apiKey = config.apiKeys[provider]?.trim()
        if (!apiKey) {
          continue
        }

        try {
          if (provider === "claude") {
            resolved = await generateHintWithClaude(
              problemTitle,
              problemDescription,
              code,
              elapsedMinutes,
              apiKey,
              config.models.claude,
              config.maxTokens.claude
            )
            break
          }

          if (provider === "gpt") {
            resolved = await generateHintWithGPT(
              problemTitle,
              problemDescription,
              code,
              elapsedMinutes,
              apiKey,
              config.models.gpt,
              config.maxTokens.gpt
            )
            break
          }

          resolved = await generateHintWithGemini(
            problemTitle,
            problemDescription,
            code,
            elapsedMinutes,
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
        hint = resolved
      } else {
        hint = `## 💡 Strategic Hint (${elapsedMinutes} minutes milestone)

You've been working hard on this problem! Here's a key insight to help you break through:

**Core Approach:** Consider the data structure that would allow you to look up values efficiently. Instead of nested loops (O(n²)), think about how you could reduce this to a single pass through the data.

**Key Question:** What if you could "remember" values you've already seen and check against them instantly?

Think about Hash Maps and how they enable O(1) lookups. This could transform your approach!

*Note: AI hints are currently unavailable. Configure at least one API key in My Page to get personalized strategic hints.*`
      }
    } catch (error) {
      console.error("AI API error:", error)
      hint = `## 💡 Strategic Hint (${elapsedMinutes} minutes milestone)

You've been working hard on this problem! Here's a key insight to help you break through:

**Core Approach:** Consider the data structure that would allow you to look up values efficiently. Instead of nested loops (O(n²)), think about how you could reduce this to a single pass through the data.

**Key Question:** What if you could "remember" values you've already seen and check against them instantly?

Think about Hash Maps and how they enable O(1) lookups. This could transform your approach!

*Note: AI service temporarily unavailable. Try refreshing or checking your configuration.*`
    }

    return NextResponse.json({ hint })
  } catch (error) {
    console.error("Error generating strategic hint:", error)
    return NextResponse.json(
      { hint: "An error occurred while generating your strategic hint. Please try again." },
      { status: 500 }
    )
  }
}
