import { NextRequest, NextResponse } from "next/server"

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
}

async function reviewWithClaude(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured")
  }

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

Provide your supportive feedback now:`

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

async function reviewWithGPT(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured")
  }

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

Provide your supportive feedback now:`

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
            "You are a helpful coding mentor who provides constructive feedback and guides students to learn.",
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

async function reviewWithGemini(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean
): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured")
  }

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

Provide your supportive feedback now:`

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
    const body: ReviewRequest = await req.json()
    const { code, problemTitle, problemDescription, testResults, allTestsPassed } = body

    const provider = process.env.AI_PROVIDER || "auto"

    let feedback: string

    try {
      if (provider === "claude" || (provider === "auto" && process.env.ANTHROPIC_API_KEY)) {
        feedback = await reviewWithClaude(
          code,
          problemTitle,
          problemDescription,
          testResults,
          allTestsPassed
        )
      } else if (provider === "gpt" || (provider === "auto" && process.env.OPENAI_API_KEY)) {
        feedback = await reviewWithGPT(
          code,
          problemTitle,
          problemDescription,
          testResults,
          allTestsPassed
        )
      } else if (provider === "gemini" || (provider === "auto" && process.env.GOOGLE_API_KEY)) {
        feedback = await reviewWithGemini(
          code,
          problemTitle,
          problemDescription,
          testResults,
          allTestsPassed
        )
      } else {
        feedback = `I noticed you ran some tests! Unfortunately, AI code review is not available right now because no API keys are configured.

However, I can see that ${testResults.filter(r => r.passed).length} out of ${testResults.length} tests passed. ${
          !allTestsPassed
            ? "Try reviewing the failed test cases above and see if you can spot any patterns in what's going wrong."
            : "Great job! All tests are passing. Consider reviewing your code for potential optimizations."
        }`
      }
    } catch (error) {
      console.error("AI API error:", error)
      feedback = `I'm having trouble connecting to the AI service right now, but I can see your test results. ${
        !allTestsPassed
          ? "Focus on the failing tests and try to understand what might be causing the issues."
          : "Your tests are passing! Keep up the good work."
      }`
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error in code review:", error)
    return NextResponse.json({ feedback: "An error occurred while reviewing your code." }, { status: 500 })
  }
}
