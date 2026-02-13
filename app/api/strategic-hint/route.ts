import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import {
  providerCandidates,
  resolveAIConfig,
  type AIConfigPayload,
} from "@/lib/ai-config"
import { getLanguageModel } from "@/lib/server/ai-model"
import {
  getMentorPersonaInstruction,
  getMentorLanguageInstruction,
  resolveMentorLanguage,
  type MentorLanguage,
} from "@/lib/mentor-language"

interface StrategicHintRequest {
  problemTitle: string
  problemDescription: string
  code: string
  elapsedMinutes: number
  language?: MentorLanguage
  aiConfig?: Partial<AIConfigPayload>
}

const STRATEGIC_HINT_REPLY_RULES = `Reply format:
- Keep it concise by default, but do not enforce hard line or character limits.
- No greetings, emojis, markdown headings, or long paragraphs.
- Give one decisive algorithm insight and one immediate next step.
- Avoid rhetorical phrasing and filler.
- Do not provide full solution code.`

function buildStrategicHintPrompt(
  problemTitle: string,
  problemDescription: string,
  code: string,
  elapsedMinutes: number,
  language: MentorLanguage
): string {
  return `You are a **Supportive Coding Mentor** helping a student who has been working on this problem for ${elapsedMinutes} minutes.

**Problem:** "${problemTitle}"

**Description:**
${problemDescription}

**Student's Current Code:**
\`\`\`javascript
${code}
\`\`\`

**Your Role:**
Provide a strategic hint, not a full solution.

**Hint goal:**
1. Reveal the core algorithm/data structure to consider.
2. Explain why it matters for this specific problem.
3. Give one concrete next step to try immediately.

**Guidelines:**
- Focus on the conceptual breakthrough.
- Keep it short and direct, like pair programming chat.
- ${STRATEGIC_HINT_REPLY_RULES}

This is a key stuck moment at ${elapsedMinutes} minutes. Deliver only the highest-leverage hint.

${getMentorPersonaInstruction(language)}
${getMentorLanguageInstruction(language)}`
}

async function generateHintWithClaude(
  problemTitle: string,
  problemDescription: string,
  code: string,
  elapsedMinutes: number,
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = buildStrategicHintPrompt(
    problemTitle,
    problemDescription,
    code,
    elapsedMinutes,
    language
  )

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
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = buildStrategicHintPrompt(
    problemTitle,
    problemDescription,
    code,
    elapsedMinutes,
    language
  )

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
  language: MentorLanguage,
  apiKey: string,
  model: string,
  maxOutputTokens: number
): Promise<string> {
  const prompt = buildStrategicHintPrompt(
    problemTitle,
    problemDescription,
    code,
    elapsedMinutes,
    language
  )

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
    const language = resolveMentorLanguage(body.language, [problemTitle, problemDescription])

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
              language,
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
              language,
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
            language,
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
        hint =
          language === "ko"
            ? `핵심은 "이미 본 값을 즉시 조회"하는 구조를 쓰는 거야. 중첩 루프 대신 Hash Map으로 한 번 순회를 시도해봐.
안내: AI 힌트가 비활성화되어 있어. 마이페이지에서 API Key를 설정해줘.`
            : `The key is instant lookup of previously seen values. Try a one-pass Hash Map approach instead of nested loops.
Note: AI hints are unavailable right now. Configure an API key in My Page.`
      }
    } catch (error) {
      console.error("AI API error:", error)
      hint =
        language === "ko"
          ? `핵심은 "이미 본 값을 즉시 조회"하는 구조야. Hash Map으로 한 번 순회가 가능한지 먼저 점검해봐.
안내: AI 서비스 연결이 불안정해. 잠시 후 다시 시도해줘.`
          : `The core insight is instant lookup of seen values. Check whether a one-pass Hash Map fits this case.
Note: AI service is temporarily unstable. Please try again shortly.`
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
