import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import {
  providerCandidates,
  resolveAIConfig,
  type AIConfigPayload,
} from "@/lib/ai-config"
import { getLanguageModel } from "@/lib/server/ai-model"

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
  aiConfig?: Partial<AIConfigPayload>
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
  testResults: AnalyzeRequest["testResults"],
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<CodeAnalysis> {
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

  const result = await generateText({
    model: getLanguageModel("claude", model, apiKey),
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  const content = result.text

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
  testResults: AnalyzeRequest["testResults"],
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<CodeAnalysis> {
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

  const result = await generateText({
    model: getLanguageModel("gpt", model, apiKey),
    system: "You are a helpful coding mentor. Always respond with valid JSON only.",
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  const content = result.text

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
  testResults: AnalyzeRequest["testResults"],
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<CodeAnalysis> {
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

  const result = await generateText({
    model: getLanguageModel("gemini", model, apiKey),
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  const content = result.text

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
    const config = resolveAIConfig(body.aiConfig)

    let analysis: CodeAnalysis

    try {
      let providerError: Error | null = null
      let resolved: CodeAnalysis | null = null

      for (const provider of providerCandidates(config)) {
        const apiKey = config.apiKeys[provider]?.trim()
        if (!apiKey) {
          continue
        }

        try {
          if (provider === "claude") {
            resolved = await analyzeWithClaude(
              code,
              problemTitle,
              allTestsPassed,
              passedRatio,
              testResults,
              apiKey,
              config.models.claude,
              config.maxTokens.claude
            )
            break
          }

          if (provider === "gpt") {
            resolved = await analyzeWithGPT(
              code,
              problemTitle,
              allTestsPassed,
              passedRatio,
              testResults,
              apiKey,
              config.models.gpt,
              config.maxTokens.gpt
            )
            break
          }

          resolved = await analyzeWithGemini(
            code,
            problemTitle,
            allTestsPassed,
            passedRatio,
            testResults,
            apiKey,
            config.models.gemini,
            config.maxTokens.gemini
          )
          break
        } catch (error) {
          providerError = error as Error
          console.error(`AI API error (${provider}):`, error)
        }
      }

      if (resolved) {
        analysis = resolved
      } else {
        if (providerError) {
          console.error("AI API error, falling back to mock analysis:", providerError)
        } else {
          console.warn("No AI API keys configured, using mock analysis")
        }
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
