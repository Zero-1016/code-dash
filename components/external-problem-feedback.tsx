"use client"

import { useState } from "react"
import Editor from "@monaco-editor/react"
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

  return (
    <div className="h-[calc(100dvh-64px)] overflow-hidden bg-background">
      <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
        <ResizablePanel defaultSize={isMobile ? 38 : 36} minSize={isMobile ? 24 : 24}>
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

        <ResizablePanel defaultSize={isMobile ? 32 : 34} minSize={isMobile ? 24 : 26}>
          <div className="flex h-full flex-col">
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{text.editorTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{text.editorDescription}</p>
            </div>
            <div className="flex-1">
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

        <ResizableHandle withHandle={!isMobile} />

        <ResizablePanel defaultSize={isMobile ? 30 : 30} minSize={isMobile ? 20 : 20}>
          <div className="flex h-full flex-col border-l border-border/70">
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
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
