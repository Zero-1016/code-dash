"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
import { RotateCcw } from "lucide-react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useIsMobile } from "@/components/ui/use-mobile"
import { CodeAssistantChat } from "@/components/code-assistant-chat"
import { useAppLanguage } from "@/lib/use-app-language"

export function ExternalProblemFeedback() {
  const { copy } = useAppLanguage()
  const isMobile = useIsMobile()
  const text = copy.externalFeedback
  const [problemTitle, setProblemTitle] = useState("")
  const [problemText, setProblemText] = useState("")
  const [code, setCode] = useState("")

  const normalizedProblemDescription =
    problemText.trim() || text.chatMissingProblemContext
  const normalizedProblemTitle = problemTitle.trim() || text.defaultProblemTitle
  const handleReset = () => {
    setCode("")
  }

  return (
    <div className="h-[calc(100dvh-64px)] overflow-hidden bg-background">
      <div className={`flex h-full ${isMobile ? "flex-col" : "flex-row"}`}>
        <div className={`min-w-0 ${isMobile ? "h-[60dvh]" : "flex-1"}`}>
          <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
            <ResizablePanel defaultSize={isMobile ? 45 : 48} minSize={isMobile ? 24 : 24}>
              <ScrollArea className="h-full border-r border-border/70">
                <div className="space-y-4 p-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{text.title}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
                  </div>
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
                      className="min-h-[420px] resize-none"
                    />
                  </div>
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle={!isMobile} />

            <ResizablePanel defaultSize={isMobile ? 55 : 52} minSize={isMobile ? 24 : 26}>
              <div className="relative flex h-full max-h-full flex-col overflow-hidden bg-background">
                <div className="flex-shrink-0 flex items-center justify-between border-b border-border/60 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-warning/60" />
                    <div className="h-3 w-3 rounded-full bg-success/60" />
                    <span className="ml-2 text-xs font-medium text-muted-foreground">
                      solution.js
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-[16px] px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </button>
                </div>
                <div className="min-h-0 flex-1">
                  <Editor
                    height="100%"
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
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <aside className={`border-l border-border/70 ${isMobile ? "h-[40dvh] w-full" : "w-[420px] flex-shrink-0"}`}>
          <div className="flex h-full flex-col">
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{text.chatTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{text.chatDescription}</p>
            </div>
            {!problemText.trim() ? (
              <div className="border-b border-border/70 bg-amber-50/70 px-4 py-2 text-xs font-medium text-amber-700">
                {text.chatMissingProblem}
              </div>
            ) : null}
            <div className="min-h-0 flex-1">
              <CodeAssistantChat
                code={code}
                problemTitle={normalizedProblemTitle}
                problemDescription={normalizedProblemDescription}
                conversationId="external-feedback"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
