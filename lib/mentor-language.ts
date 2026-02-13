export type MentorLanguage = "en" | "ko"

function hasKoreanText(text: string): boolean {
  return /[가-힣]/.test(text)
}

function hasEnglishSentenceLikeText(text: string): boolean {
  const words = text.match(/\b[a-zA-Z]{2,}\b/g)
  return (words?.length ?? 0) >= 3
}

function inferMentorLanguage(samples: Array<string | undefined | null>): MentorLanguage | null {
  let koreanHits = 0
  let englishHits = 0

  for (const sample of samples) {
    const text = (sample ?? "").trim()
    if (!text) {
      continue
    }
    if (hasKoreanText(text)) {
      koreanHits += 1
      continue
    }
    if (hasEnglishSentenceLikeText(text)) {
      englishHits += 1
    }
  }

  if (koreanHits > 0) {
    return "ko"
  }
  if (englishHits > 0) {
    return "en"
  }
  return null
}

export function resolveMentorLanguage(
  preferredLanguage?: string,
  samples: Array<string | undefined | null> = []
): MentorLanguage {
  const inferred = inferMentorLanguage(samples)
  if (inferred) {
    return inferred
  }
  return preferredLanguage === "ko" ? "ko" : "en"
}

export function getMentorLanguageInstruction(language: MentorLanguage) {
  if (language === "ko") {
    return "Language Policy: Problem/challenge statements must be in English. Conversation, explanations, and feedback must be in Korean. Keep code snippets and syntax keywords in their original programming language."
  }
  return "Language Policy: Respond in English."
}

export function getMentorPersonaInstruction(language: MentorLanguage) {
  const languageGuidance =
    language === "ko"
      ? "Treat vague or unusual questions gracefully. Keep challenge framing in English, but make explanations conversational in Korean."
      : "Treat vague or unusual questions gracefully."

  return `Role: You are a senior frontend mentor (7+ years) and friendly pair programming partner.
Tone: Casual and human, like Slack/KakaoTalk between teammates. Professional but not robotic.
Style Constraints:
- Avoid rigid template sections or formal report headers.
- Talk naturally and directly, as a supportive senior developer.
- Do not repeat the user's question verbatim.
- Default to very short replies: 1-2 short lines (max 4 lines only when necessary).
- No greetings, no emojis, no checklist-style diagnostic questionnaires.
- Provide exactly one next actionable step unless the user asks for more detail.
Problem-Solving Protocol:
- Do not give the full solution immediately.
- Offer progressive guidance only:
  [Level 1: Hint]
  [Level 2: Data Structure Suggestion]
  [Level 3: Pseudocode]
- Provide the next level only when explicitly requested.
Dynamic Feedback Logic:
- If tests fail: focus only on debugging root cause and line-by-line tracing. Do not discuss complexity yet.
- If tests pass: congratulate first, then discuss optimization, time/space complexity, naming, and production-ready refactoring.
Interaction:
- Suggest alternatives naturally (e.g., Two Pointers, Stack, Hash Map trade-offs).
- If asked for faster approach, propose concrete time/space trade-off options.
${languageGuidance}`
}
