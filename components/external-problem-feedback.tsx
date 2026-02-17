"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { getApiSettings } from "@/lib/local-progress"
import { useAppLanguage } from "@/lib/use-app-language"

interface ChatResponse {
  message?: string
}

export function ExternalProblemFeedback() {
  const REQUEST_TIMEOUT_MS = 20000
  const { language, copy } = useAppLanguage()
  const [problemTitle, setProblemTitle] = useState("")
  const [problemText, setProblemText] = useState("")
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const text = copy.externalFeedback

  const handleSubmit = async () => {
    if (!problemText.trim()) {
      setError(text.errorRequired)
      return
    }

    setError("")
    setFeedback("")
    setIsLoading(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: text.mentorPrompt,
            },
          ],
          code,
          problemTitle: problemTitle.trim() || text.defaultProblemTitle,
          problemDescription: problemText,
          language,
          aiConfig: getApiSettings(),
        }),
      })

      if (!response.ok) {
        throw new Error("REQUEST_FAILED")
      }

      const data = (await response.json()) as ChatResponse
      setFeedback(data.message?.trim() || text.errorGeneric)
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        setError(text.errorTimeout)
      } else {
        setError(text.errorGeneric)
      }
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }
  }

  return (
    <section className="mb-6 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground">{text.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text.description}</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            {text.titleLabel}
          </label>
          <Textarea
            value={problemTitle}
            onChange={(event) => setProblemTitle(event.target.value)}
            placeholder={text.titlePlaceholder}
            className="min-h-[56px] resize-y"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            {text.problemLabel}
          </label>
          <Textarea
            value={problemText}
            onChange={(event) => setProblemText(event.target.value)}
            placeholder={text.problemPlaceholder}
            className="min-h-[140px] resize-y"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            {text.codeLabel}
          </label>
          <Textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={text.codePlaceholder}
            className="min-h-[120px] resize-y font-mono text-xs"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => void handleSubmit()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-full bg-[#3182F6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2870d8] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLoading ? text.loading : text.submit}
        </button>
        {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
      </div>

      {feedback ? (
        <div className="mt-4 rounded-xl border border-border/70 bg-muted/40 p-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">{text.resultTitle}</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{feedback}</p>
        </div>
      ) : null}
    </section>
  )
}
