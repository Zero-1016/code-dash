import { NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  code: string
  problemTitle: string
  problemDescription: string
}

// Helper to call Anthropic Claude API
async function chatWithClaude(
  messages: ChatMessage[],
  code: string,
  problemTitle: string,
  problemDescription: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured")
  }

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
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error: ${error}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// Helper to call OpenAI GPT API
async function chatWithGPT(
  messages: ChatMessage[],
  code: string,
  problemTitle: string,
  problemDescription: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured")
  }

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
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Helper to call Google Gemini API
async function chatWithGemini(
  messages: ChatMessage[],
  code: string,
  problemTitle: string,
  problemDescription: string
): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured")
  }

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

  // Convert messages to Gemini format
  const conversationHistory = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
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
    const body: ChatRequest = await req.json()
    const { messages, code, problemTitle, problemDescription } = body

    // Determine which AI provider to use
    const provider = process.env.AI_PROVIDER || "auto"

    let responseText: string

    try {
      if (provider === "claude" || (provider === "auto" && process.env.ANTHROPIC_API_KEY)) {
        responseText = await chatWithClaude(messages, code, problemTitle, problemDescription)
      } else if (provider === "gpt" || (provider === "auto" && process.env.OPENAI_API_KEY)) {
        responseText = await chatWithGPT(messages, code, problemTitle, problemDescription)
      } else if (provider === "gemini" || (provider === "auto" && process.env.GOOGLE_API_KEY)) {
        responseText = await chatWithGemini(messages, code, problemTitle, problemDescription)
      } else {
        return NextResponse.json(
          {
            message:
              "AI chat is not available. Please configure at least one AI API key in your .env.local file.",
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
