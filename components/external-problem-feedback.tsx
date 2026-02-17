"use client"

import { useState } from "react"
import { MessageCircle } from "lucide-react"
import Editor from "@monaco-editor/react"
import { useAppLanguage } from "@/lib/use-app-language"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CodeAssistantChat } from "@/components/code-assistant-chat"

export function ExternalProblemFeedback() {
  const { copy } = useAppLanguage()
  const text = copy.externalFeedback
  const [problemTitle, setProblemTitle] = useState("")
  const [problemText, setProblemText] = useState("")
  const [code, setCode] = useState("")

  const normalizedProblemDescription =
    problemText.trim() || text.chatMissingProblemContext
  const normalizedProblemTitle = problemTitle.trim() || text.defaultProblemTitle

  return (
    <section className="mb-6">
      <div className="mb-4">
        <h3 className="text-base font-bold text-foreground">{text.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{text.description}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                {text.titleLabel}
              </label>
              <Input
                value={problemTitle}
                onChange={(event) => setProblemTitle(event.target.value)}
                placeholder={text.titlePlaceholder}
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
                className="min-h-[180px] resize-y"
              />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-foreground">{text.editorTitle}</p>
            <p className="mt-1 text-xs text-muted-foreground">{text.editorDescription}</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-border/70">
              <Editor
                height="360px"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#3182F6]" />
              <p className="text-sm font-semibold text-foreground">{text.chatTitle}</p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{text.chatDescription}</p>
            {!problemText.trim() ? (
              <p className="mt-2 text-xs font-medium text-amber-600">{text.chatMissingProblem}</p>
            ) : null}
          </div>
          <div className="h-[620px]">
            <CodeAssistantChat
              code={code}
              problemTitle={normalizedProblemTitle}
              problemDescription={normalizedProblemDescription}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
