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
  language?: MentorLanguage
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

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min
  }
  return Math.min(max, Math.max(min, value))
}

function extractJsonObject(content: string): string {
  const fencedJson = content.match(/```json\s*([\s\S]*?)\s*```/i)
  if (fencedJson?.[1]) {
    return fencedJson[1]
  }

  const firstBraceIndex = content.indexOf("{")
  if (firstBraceIndex === -1) {
    return content
  }

  let depth = 0
  for (let index = firstBraceIndex; index < content.length; index += 1) {
    const char = content[index]
    if (char === "{") {
      depth += 1
    } else if (char === "}") {
      depth -= 1
      if (depth === 0) {
        return content.slice(firstBraceIndex, index + 1)
      }
    }
  }

  return content.slice(firstBraceIndex)
}

function toIntInRange(value: unknown, min: number, max: number): number {
  return Math.round(clamp(Number(value), min, max))
}

function deriveCorrectnessScore(testResults: AnalyzeRequest["testResults"]): number {
  if (!testResults.length) {
    return 0
  }

  const passedCount = testResults.filter((result) => result.passed).length
  const passRatio = passedCount / testResults.length
  return Math.round(passRatio * 60)
}

function deriveEfficiencyLevel(efficiency: number): CodeAnalysis["efficiencyLevel"] {
  if (efficiency >= 16) {
    return "High"
  }
  if (efficiency >= 10) {
    return "Medium"
  }
  return "Low"
}

function parseAnalysisJson(
  content: string,
  testResults: AnalyzeRequest["testResults"]
): CodeAnalysis {
  const jsonText = extractJsonObject(content)
  const parsed = JSON.parse(jsonText) as Partial<CodeAnalysis>

  const efficiencyLevelRaw = String(parsed.efficiencyLevel ?? "").toLowerCase()
  const modelEfficiencyLevel: CodeAnalysis["efficiencyLevel"] =
    efficiencyLevelRaw === "high"
      ? "High"
      : efficiencyLevelRaw === "medium"
      ? "Medium"
      : "Low"
  const correctness = deriveCorrectnessScore(testResults)
  const efficiency = toIntInRange(parsed.efficiency, 0, 20)
  const readability = toIntInRange(parsed.readability, 0, 20)
  const totalScore = correctness + efficiency + readability
  const efficiencyLevel = parsed.efficiencyLevel
    ? modelEfficiencyLevel
    : deriveEfficiencyLevel(efficiency)

  return {
    correctness,
    efficiency,
    readability,
    totalScore,
    bigO: String(parsed.bigO ?? "-").trim() || "-",
    efficiencyLevel,
    suggestion: String(parsed.suggestion ?? ""),
    detailedFeedback: String(parsed.detailedFeedback ?? ""),
  }
}

// Helper to call Anthropic Claude API
async function analyzeWithClaude(
  code: string,
  problemTitle: string,
  allTestsPassed: boolean,
  passedRatio: number,
  testResults: AnalyzeRequest["testResults"],
  language: MentorLanguage,
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
- Keep "efficiencyLevel" strictly one of: High, Medium, Low.
- Keep JSON keys and numeric fields exactly as requested.
- ${getMentorLanguageInstruction(language)}

Return ONLY the JSON object, no other text.`

  const result = await generateText({
    model: getLanguageModel("claude", model, apiKey),
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  const content = result.text

  try {
    return parseAnalysisJson(content, testResults)
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
  language: MentorLanguage,
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
- Keep "efficiencyLevel" strictly one of: High, Medium, Low.
- Keep JSON keys and numeric fields exactly as requested.
- ${getMentorLanguageInstruction(language)}

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
    return parseAnalysisJson(content, testResults)
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
  language: MentorLanguage,
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
- Keep "efficiencyLevel" strictly one of: High, Medium, Low.
- Keep JSON keys and numeric fields exactly as requested.
- ${getMentorLanguageInstruction(language)}

Return ONLY the JSON object, no other text.`

  const result = await generateText({
    model: getLanguageModel("gemini", model, apiKey),
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  const content = result.text

  try {
    return parseAnalysisJson(content, testResults)
  } catch (e) {
    throw new Error(`Failed to parse Gemini response: ${content}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: AnalyzeRequest = await req.json()
    const { code, allTestsPassed, problemTitle, testResults } = body
    const passedRatio = testResults.length
      ? testResults.filter((result) => result.passed).length / testResults.length
      : 0
    const language = resolveMentorLanguage(body.language)

    // Determine which AI provider to use based on available API keys
    const config = resolveAIConfig(body.aiConfig)

    let analysis: CodeAnalysis | null = null

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
              language,
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
              language,
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
            language,
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
      } else if (providerError) {
        console.error("AI API error:", providerError)
      } else {
        console.warn("No AI API keys configured for analysis")
      }
    } catch (error) {
      console.error("AI API error:", error)
    }

    if (!analysis) {
      return NextResponse.json(
        {
          error: "AI analysis is unavailable.",
          detail:
            language === "ko"
              ? "AI 연결에 실패하여 분석을 생성하지 못했습니다."
              : "Failed to generate AI analysis due to provider or configuration issues.",
        },
        { status: 503 }
      )
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
