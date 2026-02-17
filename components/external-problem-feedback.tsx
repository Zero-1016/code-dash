"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, X, ArrowLeft } from "lucide-react"
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
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  const normalizedProblemDescription =
    problemText.trim() || text.chatMissingProblemContext
  const normalizedProblemTitle = problemTitle.trim() || text.defaultProblemTitle

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[20px] px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{copy.externalFeedback.backHome}</span>
          </Link>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="hidden items-center gap-2 sm:flex">
            <Image
              src="/codedash-mark.svg"
              alt="CodeDash logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-[8px]"
              priority
            />
            <span className="text-sm font-semibold text-foreground">CodeDash</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAssistantOpen((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full bg-[#3182F6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2870d8]"
        >
          <MessageCircle className="h-4 w-4" />
          {copy.problem.aiMentor}
        </button>
      </header>

      <div className="relative flex-1 overflow-hidden">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          <ResizablePanel defaultSize={isMobile ? 40 : 45} minSize={isMobile ? 25 : 30}>
            <ScrollArea className="h-full">
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
                    className="min-h-[360px] resize-none"
                  />
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle={!isMobile} />

          <ResizablePanel defaultSize={isMobile ? 60 : 55} minSize={isMobile ? 35 : 30}>
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
        </ResizablePanelGroup>

        <AnimatePresence>
          {isAssistantOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAssistantOpen(false)}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 bottom-0 z-50 w-full border-l border-border bg-background shadow-2xl"
                style={{ maxWidth: isMobile ? "100%" : "440px" }}
              >
                <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{text.chatTitle}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{text.chatDescription}</p>
                  </div>
                  <button
                    onClick={() => setIsAssistantOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {!problemText.trim() ? (
                  <div className="border-b border-border/70 bg-amber-50/70 px-4 py-2 text-xs font-medium text-amber-700">
                    {text.chatMissingProblem}
                  </div>
                ) : null}
                <div className="h-[calc(100%-64px)]">
                  <CodeAssistantChat
                    code={code}
                    problemTitle={normalizedProblemTitle}
                    problemDescription={normalizedProblemDescription}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
