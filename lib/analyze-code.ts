import { getApiSettings } from "@/lib/local-progress"

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
  testResults: TestResult[]
): Promise<CodeAnalysis> {
  try {
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
        aiConfig: getApiSettings(),
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const analysis: CodeAnalysis = await response.json()
    return analysis
  } catch (error) {
    console.error("Failed to get AI analysis, using mock:", error)
    return analyzeCode(code, allTestsPassed, passedRatio)
  }
}

/**
 * Mock AI analysis for submitted code (fallback).
 * Uses simple heuristics: nested loops → low efficiency, Map/Set usage → high efficiency.
 */
export function analyzeCode(
  code: string,
  allTestsPassed: boolean,
  passedRatio: number
): CodeAnalysis {
  // --- Correctness (0-60) ---
  const correctness = Math.round(passedRatio * 60)

  // --- Efficiency (0-20) ---
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
      "You used nested loops resulting in O(n^2) time complexity. Consider using a Hash Map to reduce it to O(n) by trading space for speed."
  } else if (usesHashStructure) {
    efficiency = 19
    bigO = "O(n)"
    efficiencyLevel = "High"
    suggestion =
      "Great job using a hash-based structure! Your solution runs in O(n) time, which is optimal for most cases."
  } else {
    efficiency = 13
    bigO = "O(n)"
    efficiencyLevel = "Medium"
    suggestion =
      "Your approach appears to use a single pass, but consider leveraging a Map or Set for clearer intent and guaranteed O(1) lookups."
  }

  // --- Readability (0-20) ---
  let readability = 14

  // Bonus: meaningful variable names (more than single chars)
  const varNames = code.match(/(?:let|const|var)\s+([a-zA-Z_$]\w*)/g) || []
  const meaningfulVars = varNames.filter((v) => {
    const name = v.replace(/^(?:let|const|var)\s+/, "")
    return name.length > 2
  })
  if (meaningfulVars.length >= 2) readability += 2

  // Bonus: has comments
  if (/\/\/|\/\*/.test(code)) readability += 2

  // Penalty: very long lines
  const lines = code.split("\n")
  const longLines = lines.filter((l) => l.length > 100)
  if (longLines.length > 2) readability -= 3

  // Bonus: consistent spacing
  if (!/\)\{/.test(code)) readability += 2

  readability = Math.max(0, Math.min(20, readability))

  // --- Total ---
  const totalScore = correctness + efficiency + readability

  // --- Detailed feedback ---
  let detailedFeedback: string
  if (totalScore >= 90) {
    detailedFeedback =
      "Excellent work! Your solution demonstrates strong problem-solving skills with clean, efficient code. Keep pushing for optimal solutions."
  } else if (totalScore >= 70) {
    detailedFeedback =
      "Solid solution! You've covered the core logic well. Focus on optimizing your approach and polishing code readability for even better results."
  } else if (totalScore >= 50) {
    detailedFeedback =
      "Good attempt! Your solution handles some cases correctly. Review edge cases and consider more efficient data structures to improve your score."
  } else {
    detailedFeedback =
      "Keep practicing! Review the problem constraints carefully and try breaking the problem into smaller steps. Consider studying common patterns like two-pointer or hash map techniques."
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
