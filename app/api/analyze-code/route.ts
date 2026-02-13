import { NextRequest, NextResponse } from "next/server"

interface AnalyzeRequest {
  code: string
  allTestsPassed: boolean
  passedRatio: number
  problemTitle: string
  testResults: Array<{
    passed: boolean
    input: string
    expected: string
    actual: string
  }>
}

interface CodeAnalysis {
  correctness: number
  efficiency: number
  readability: number
  totalScore: number
  bigO: string
  efficiencyLevel: "High" | "Medium" | "Low"
  suggestion: string
  detailedFeedback: string
}

// Helper to call Anthropic Claude API
async function analyzeWithClaude(
  code: string,
  problemTitle: string,
  allTestsPassed: boolean,
  passedRatio: number,
  testResults: AnalyzeRequest["testResults"]
): Promise<CodeAnalysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured")
  }

  const prompt = `You are a coding mentor analyzing a student's solution to the problem: "${problemTitle}".

Code submitted:
\`\`\`javascript
${code}
\`\`\`

Test Results:
- Tests Passed: ${testResults.filter(r => r.passed).length}/${testResults.length}
- Pass Rate: ${(passedRatio * 100).toFixed(1)}%

Test Details:
${testResults.map((r, i) => `Test ${i + 1}: ${r.passed ? "✓ PASSED" : "✗ FAILED"}
  Input: ${r.input}
  Expected: ${r.expected}
  Actual: ${r.actual}`).join("\n")}

Please analyze this code and provide feedback in the following JSON format:
{
  "correctness": <number 0-60, based on test pass rate>,
  "efficiency": <number 0-20, based on time complexity>,
  "readability": <number 0-20, based on code quality>,
  "totalScore": <sum of above>,
  "bigO": "<time complexity, e.g., O(n), O(n^2)>",
  "efficiencyLevel": "<High|Medium|Low>",
  "suggestion": "<one-sentence optimization tip>",
  "detailedFeedback": "<2-3 sentences of overall feedback>"
}

Rules:
- Correctness: 0-60 points based on pass rate (${passedRatio * 60} points for ${(passedRatio * 100).toFixed(1)}% pass rate)
- Efficiency: 0-20 points. O(n) or better = 18-20, O(n log n) = 14-17, O(n^2) = 5-10
- Readability: 0-20 points. Consider variable names, spacing, comments
- Be encouraging but honest
- Focus on concrete improvements

Return ONLY the JSON object, no other text.`

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
  const content = data.content[0].text

  try {
    const analysis = JSON.parse(content)
    return analysis
  } catch (e) {
    throw new Error(`Failed to parse Claude response: ${content}`)
  }
}

// Helper to call OpenAI GPT API
async function analyzeWithGPT(
  code: string,
  problemTitle: string,
  allTestsPassed: boolean,
  passedRatio: number,
  testResults: AnalyzeRequest["testResults"]
): Promise<CodeAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured")
  }

  const prompt = `You are a coding mentor analyzing a student's solution to the problem: "${problemTitle}".

Code submitted:
\`\`\`javascript
${code}
\`\`\`

Test Results:
- Tests Passed: ${testResults.filter(r => r.passed).length}/${testResults.length}
- Pass Rate: ${(passedRatio * 100).toFixed(1)}%

Test Details:
${testResults.map((r, i) => `Test ${i + 1}: ${r.passed ? "✓ PASSED" : "✗ FAILED"}
  Input: ${r.input}
  Expected: ${r.expected}
  Actual: ${r.actual}`).join("\n")}

Please analyze this code and provide feedback in the following JSON format:
{
  "correctness": <number 0-60, based on test pass rate>,
  "efficiency": <number 0-20, based on time complexity>,
  "readability": <number 0-20, based on code quality>,
  "totalScore": <sum of above>,
  "bigO": "<time complexity, e.g., O(n), O(n^2)>",
  "efficiencyLevel": "<High|Medium|Low>",
  "suggestion": "<one-sentence optimization tip>",
  "detailedFeedback": "<2-3 sentences of overall feedback>"
}

Rules:
- Correctness: 0-60 points based on pass rate (${passedRatio * 60} points for ${(passedRatio * 100).toFixed(1)}% pass rate)
- Efficiency: 0-20 points. O(n) or better = 18-20, O(n log n) = 14-17, O(n^2) = 5-10
- Readability: 0-20 points. Consider variable names, spacing, comments
- Be encouraging but honest
- Focus on concrete improvements

Return ONLY the JSON object, no other text.`

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
            "You are a helpful coding mentor. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  try {
    const analysis = JSON.parse(content)
    return analysis
  } catch (e) {
    throw new Error(`Failed to parse GPT response: ${content}`)
  }
}

// Helper to call Google Gemini API
async function analyzeWithGemini(
  code: string,
  problemTitle: string,
  allTestsPassed: boolean,
  passedRatio: number,
  testResults: AnalyzeRequest["testResults"]
): Promise<CodeAnalysis> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY not configured")
  }

  const prompt = `You are a coding mentor analyzing a student's solution to the problem: "${problemTitle}".

Code submitted:
\`\`\`javascript
${code}
\`\`\`

Test Results:
- Tests Passed: ${testResults.filter(r => r.passed).length}/${testResults.length}
- Pass Rate: ${(passedRatio * 100).toFixed(1)}%

Test Details:
${testResults.map((r, i) => `Test ${i + 1}: ${r.passed ? "✓ PASSED" : "✗ FAILED"}
  Input: ${r.input}
  Expected: ${r.expected}
  Actual: ${r.actual}`).join("\n")}

Please analyze this code and provide feedback in the following JSON format:
{
  "correctness": <number 0-60, based on test pass rate>,
  "efficiency": <number 0-20, based on time complexity>,
  "readability": <number 0-20, based on code quality>,
  "totalScore": <sum of above>,
  "bigO": "<time complexity, e.g., O(n), O(n^2)>",
  "efficiencyLevel": "<High|Medium|Low>",
  "suggestion": "<one-sentence optimization tip>",
  "detailedFeedback": "<2-3 sentences of overall feedback>"
}

Rules:
- Correctness: 0-60 points based on pass rate (${passedRatio * 60} points for ${(passedRatio * 100).toFixed(1)}% pass rate)
- Efficiency: 0-20 points. O(n) or better = 18-20, O(n log n) = 14-17, O(n^2) = 5-10
- Readability: 0-20 points. Consider variable names, spacing, comments
- Be encouraging but honest
- Focus on concrete improvements

Return ONLY the JSON object, no other text.`

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
  const content = data.candidates[0].content.parts[0].text

  try {
    // Gemini might wrap JSON in markdown code blocks
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content
    const analysis = JSON.parse(jsonText)
    return analysis
  } catch (e) {
    throw new Error(`Failed to parse Gemini response: ${content}`)
  }
}

// Fallback mock analysis (same as original)
function getMockAnalysis(
  code: string,
  allTestsPassed: boolean,
  passedRatio: number
): CodeAnalysis {
  const correctness = Math.round(passedRatio * 60)

  const hasNestedLoop = /for\s*\(.*\)[\s\S]*?for\s*\(/.test(code)
  const hasWhileInLoop =
    /for\s*\(.*\)[\s\S]*?while\s*\(/.test(code) ||
    /while\s*\(.*\)[\s\S]*?while\s*\(/.test(code)
  const usesMap = /new\s+Map|\.has\(|\.get\(|\.set\(/.test(code)
  const usesSet = /new\s+Set/.test(code)
  const usesHashStructure = usesMap || usesSet

  let efficiency: number
  let bigO: string
  let efficiencyLevel: "High" | "Medium" | "Low"
  let suggestion: string

  if (hasNestedLoop || hasWhileInLoop) {
    efficiency = 6
    bigO = "O(n^2)"
    efficiencyLevel = "Low"
    suggestion =
      "You used nested loops resulting in O(n^2) time complexity. Consider using a Hash Map to reduce it to O(n)."
  } else if (usesHashStructure) {
    efficiency = 19
    bigO = "O(n)"
    efficiencyLevel = "High"
    suggestion =
      "Great job using a hash-based structure! Your solution runs in O(n) time."
  } else {
    efficiency = 13
    bigO = "O(n)"
    efficiencyLevel = "Medium"
    suggestion =
      "Your approach uses a single pass, but consider leveraging a Map or Set for clearer intent."
  }

  let readability = 14

  const varNames = code.match(/(?:let|const|var)\s+([a-zA-Z_$]\w*)/g) || []
  const meaningfulVars = varNames.filter((v) => {
    const name = v.replace(/^(?:let|const|var)\s+/, "")
    return name.length > 2
  })
  if (meaningfulVars.length >= 2) readability += 2
  if (/\/\/|\/\*/.test(code)) readability += 2

  const lines = code.split("\n")
  const longLines = lines.filter((l) => l.length > 100)
  if (longLines.length > 2) readability -= 3
  if (!/\)\{/.test(code)) readability += 2

  readability = Math.max(0, Math.min(20, readability))

  const totalScore = correctness + efficiency + readability

  let detailedFeedback: string
  if (totalScore >= 90) {
    detailedFeedback =
      "Excellent work! Your solution demonstrates strong problem-solving skills with clean, efficient code."
  } else if (totalScore >= 70) {
    detailedFeedback =
      "Solid solution! You've covered the core logic well. Focus on optimizing your approach for better results."
  } else if (totalScore >= 50) {
    detailedFeedback =
      "Good attempt! Review edge cases and consider more efficient data structures to improve your score."
  } else {
    detailedFeedback =
      "Keep practicing! Review the problem constraints and try breaking it into smaller steps."
  }

  return {
    correctness,
    efficiency,
    readability,
    totalScore,
    bigO,
    efficiencyLevel,
    suggestion,
    detailedFeedback,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json()
    const { code, allTestsPassed, passedRatio, problemTitle, testResults } = body

    // Determine which AI provider to use based on available API keys
    const provider = process.env.AI_PROVIDER || "auto"

    let analysis: CodeAnalysis

    try {
      if (provider === "claude" || (provider === "auto" && process.env.ANTHROPIC_API_KEY)) {
        analysis = await analyzeWithClaude(
          code,
          problemTitle,
          allTestsPassed,
          passedRatio,
          testResults
        )
      } else if (provider === "gpt" || (provider === "auto" && process.env.OPENAI_API_KEY)) {
        analysis = await analyzeWithGPT(
          code,
          problemTitle,
          allTestsPassed,
          passedRatio,
          testResults
        )
      } else if (provider === "gemini" || (provider === "auto" && process.env.GOOGLE_API_KEY)) {
        analysis = await analyzeWithGemini(
          code,
          problemTitle,
          allTestsPassed,
          passedRatio,
          testResults
        )
      } else {
        // No API keys configured, use mock analysis
        console.warn("No AI API keys configured, using mock analysis")
        analysis = getMockAnalysis(code, allTestsPassed, passedRatio)
      }
    } catch (error) {
      console.error("AI API error, falling back to mock analysis:", error)
      analysis = getMockAnalysis(code, allTestsPassed, passedRatio)
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing code:", error)
    return NextResponse.json(
      { error: "Failed to analyze code" },
      { status: 500 }
    )
  }
}
