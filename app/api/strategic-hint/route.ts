import { NextRequest, NextResponse } from "next/server"

interface StrategicHintRequest {
  problemTitle: string
  problemDescription: string
  code: string
  elapsedMinutes: number
}

async function generateHintWithClaude(
  problemTitle: string,
  problemDescription: string,
  code: string,
  elapsedMinutes: number
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured")
  }

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

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error: ${error}`)
  }

  const data = await response.json()
  return data.content[0].text
}

async function generateHintWithGPT(
  problemTitle: string,
  problemDescription: string,
  code: string,
  elapsedMinutes: number
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured")
  }

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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a supportive coding mentor who provides strategic hints and guides students to think like developers. You never give away complete solutions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function generateHintWithGemini(
  problemTitle: string,
  problemDescription: string,
  code: string,
  elapsedMinutes: number
): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured")
  }

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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

export async function POST(req: NextRequest) {
  try {
    const body: StrategicHintRequest = await req.json()
    const { problemTitle, problemDescription, code, elapsedMinutes } = body

    const provider = process.env.AI_PROVIDER || "auto"

    let hint: string

    try {
      if (provider === "claude" || (provider === "auto" && process.env.ANTHROPIC_API_KEY)) {
        hint = await generateHintWithClaude(problemTitle, problemDescription, code, elapsedMinutes)
      } else if (provider === "gpt" || (provider === "auto" && process.env.OPENAI_API_KEY)) {
        hint = await generateHintWithGPT(problemTitle, problemDescription, code, elapsedMinutes)
      } else if (provider === "gemini" || (provider === "auto" && process.env.GOOGLE_API_KEY)) {
        hint = await generateHintWithGemini(problemTitle, problemDescription, code, elapsedMinutes)
      } else {
        hint = `## 💡 Strategic Hint (${elapsedMinutes} minutes milestone)

You've been working hard on this problem! Here's a key insight to help you break through:

**Core Approach:** Consider the data structure that would allow you to look up values efficiently. Instead of nested loops (O(n²)), think about how you could reduce this to a single pass through the data.

**Key Question:** What if you could "remember" values you've already seen and check against them instantly?

Think about Hash Maps and how they enable O(1) lookups. This could transform your approach!

*Note: AI hints are currently unavailable. Configure an API key to get personalized strategic hints.*`
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
