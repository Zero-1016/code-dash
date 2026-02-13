import { getApiSettings } from "@/lib/local-progress"
import type { MentorLanguage } from "@/lib/mentor-language"

export interface CodeAnalysis {
  correctness: number
  efficiency: number
  readability: number
  totalScore: number
  bigO: string
  efficiencyLevel: "High" | "Medium" | "Low"
  suggestion: string
  detailedFeedback: string
}

interface TestResult {
  passed: boolean
  input: string
  expected: string
  actual: string
}

/**
 * Calls the API to analyze code with AI.
 * Falls back to mock analysis if API is not available.
 */
export async function analyzeCodeWithAI(
  code: string,
  problemTitle: string,
  allTestsPassed: boolean,
  passedRatio: number,
  testResults: TestResult[],
  language: MentorLanguage = "en"
): Promise<CodeAnalysis> {
  const response = await fetch("/api/analyze-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
      problemTitle,
      allTestsPassed,
      passedRatio,
      testResults,
      language,
      aiConfig: getApiSettings(),
    }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { detail?: string; error?: string }
      | null
    const detail = payload?.detail || payload?.error || `API error: ${response.status}`
    throw new Error(detail)
  }

  const analysis: CodeAnalysis = await response.json()
  return analysis
}
