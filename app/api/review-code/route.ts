import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import {
  providerCandidates,
  resolveAIConfig,
  type AIConfigPayload,
} from "@/lib/ai-config"
import { getLanguageModel } from "@/lib/server/ai-model"

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
  aiConfig?: Partial<AIConfigPayload>
}

async function reviewWithClaude(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
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

  const result = await generateText({
    model: getLanguageModel("claude", model, apiKey),
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  return result.text
}

async function reviewWithGPT(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
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

  const result = await generateText({
    model: getLanguageModel("gpt", model, apiKey),
    system:
      "You are a helpful coding mentor who provides constructive feedback and guides students to learn.",
    prompt,
    maxOutputTokens,
    temperature: 0.7,
  })
  return result.text
}

async function reviewWithGemini(
  code: string,
  problemTitle: string,
  problemDescription: string,
  testResults: TestResult[],
  allTestsPassed: boolean,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
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
    const body: ReviewRequest = await req.json()
    const { code, problemTitle, problemDescription, testResults, allTestsPassed } = body

    const config = resolveAIConfig(body.aiConfig)

    let feedback: string

    try {
      let resolved: string | null = null
      for (const provider of providerCandidates(config)) {
        const apiKey = config.apiKeys[provider]?.trim()
        if (!apiKey) {
          continue
        }

        try {
          if (provider === "claude") {
            resolved = await reviewWithClaude(
              code,
              problemTitle,
              problemDescription,
              testResults,
              allTestsPassed,
              apiKey,
              config.models.claude,
              config.maxTokens.claude
            )
            break
          }

          if (provider === "gpt") {
            resolved = await reviewWithGPT(
              code,
              problemTitle,
              problemDescription,
              testResults,
              allTestsPassed,
              apiKey,
              config.models.gpt,
              config.maxTokens.gpt
            )
            break
          }

          resolved = await reviewWithGemini(
            code,
            problemTitle,
            problemDescription,
            testResults,
            allTestsPassed,
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
        feedback = resolved
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
