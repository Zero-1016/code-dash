"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageCircle, X } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProblemDescription } from "@/components/problem-description";
import { CodeEditorPanel } from "@/components/code-editor-panel";
import { CodeAssistantChat } from "@/components/code-assistant-chat";
import { ChallengeTimer } from "@/components/challenge-timer";
import { getLocalizedProblemText, type Problem } from "@/lib/problems";
import {
  deleteDraft,
  getDraft,
  getApiSettings,
  recordActivity,
  saveDraft,
  saveSolveRecord,
  subscribeToProgressUpdates,
} from "@/lib/local-progress";
import { useAppLanguage } from "@/lib/use-app-language";

interface ProblemPageClientProps {
  problem: Problem;
}

interface MentorTestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
}

export function ProblemPageClient({ problem }: ProblemPageClientProps) {
  const router = useRouter();
  const { language, copy } = useAppLanguage();
  const localized = getLocalizedProblemText(problem, language);
  const localizedProblem = useMemo(
    () => ({
      ...problem,
      title: localized.text.title,
      category: localized.text.category,
      description: localized.text.description,
      examples: localized.text.examples,
      constraints: localized.text.constraints,
    }),
    [localized.text, problem]
  );
  const [code, setCode] = useState(problem.starterCode);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [pendingReview, setPendingReview] = useState<string | null>(null);
  const [strategicHint, setStrategicHint] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasTriggered30MinHint, setHasTriggered30MinHint] = useState(false);
  const [showHintNotification, setShowHintNotification] = useState(false);
  const [latestTestResults, setLatestTestResults] = useState<MentorTestResult[]>([]);
  const [isMentorConfigured, setIsMentorConfigured] = useState(false);
  const [isMentorAlertOpen, setIsMentorAlertOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const settings = getApiSettings();
      const provider = settings.provider;
      const hasModel = Boolean(settings.models[provider]?.trim());
      const hasApiKey = Boolean(settings.apiKeys[provider]?.trim());
      setIsMentorConfigured(hasModel && hasApiKey);
    };
    sync();
    return subscribeToProgressUpdates(sync);
  }, []);

  useEffect(() => {
    const draft = getDraft(problem.id);
    if (draft?.code) {
      setCode(draft.code);
      return;
    }
    setCode(problem.starterCode);
  }, [problem.id, problem.starterCode]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (code.trim() && code !== problem.starterCode) {
        saveDraft(problem.id, code);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [code, problem.id, problem.starterCode]);

  const handleSubmissionComplete = useCallback(
    (result: { success: boolean; passed: number; total: number }) => {
      recordActivity();
      saveSolveRecord({
        problemId: problem.id,
        solvedAt: new Date().toISOString(),
        passed: result.passed,
        total: result.total,
        success: result.success,
        elapsedSeconds: result.success ? elapsedSeconds : undefined,
      });

      if (result.success) {
        deleteDraft(problem.id);
      }
    },
    [elapsedSeconds, problem.id]
  );

  const handleTimeUpdate = useCallback(
    async (seconds: number) => {
      setElapsedSeconds(seconds);

      // Trigger 30-minute strategic hint
      if (seconds >= 1800 && !hasTriggered30MinHint) {
        setHasTriggered30MinHint(true);
        setIsAiGenerating(true);
        setShowHintNotification(true);

        try {
          const response = await fetch("/api/strategic-hint", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              problemTitle: localizedProblem.title,
              problemDescription: localizedProblem.description,
              code,
              elapsedMinutes: 30,
              language,
              aiConfig: getApiSettings(),
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setStrategicHint(data.hint);
            // Don't auto-open - let the user click when ready
          }
        } catch (error) {
          console.error("Failed to get strategic hint:", error);
        } finally {
          setIsAiGenerating(false);
        }
      }
    },
    [hasTriggered30MinHint, localizedProblem.description, localizedProblem.title, code, language]
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-[20px] px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.problem.back}</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Image
              src="/codedash-mark.svg"
              alt="CodeDash logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-[8px]"
              priority
            />
            <span className="text-sm font-semibold text-foreground">
              CodeDash
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ChallengeTimer timeLimit={3600} onTimeUpdate={handleTimeUpdate} />
          <div className="h-4 w-px bg-border" />
          <p className="text-sm font-medium text-muted-foreground">
            {localizedProblem.title}
          </p>
          <div className="relative">
            <button
              onClick={() => {
                if (!isMentorConfigured) {
                  setIsMentorAlertOpen(true);
                  return;
                }
                setIsAssistantOpen(!isAssistantOpen);
                setShowHintNotification(false);
              }}
              className={`flex items-center gap-2 rounded-[20px] px-4 py-2 text-sm font-semibold transition-all ${
                isMentorConfigured
                  ? "bg-[#3182F6] text-white shadow-lg hover:bg-[#2870d8]"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              {copy.problem.aiMentor}
            </button>
            <AnimatePresence>
              {showHintNotification && !isAssistantOpen && isMentorConfigured && (
                <>
                  {/* Pulse ring */}
                  <motion.div
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#3182F6]"
                  />
                  {/* Notification badge */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#3182F6] border-2 border-background shadow-lg"
                  />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex-1 overflow-hidden relative"
      >
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={45} minSize={30}>
            <ProblemDescription problem={localizedProblem} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={55} minSize={35}>
            <CodeEditorPanel
              problem={localizedProblem}
              code={code}
              setCode={setCode}
              setIsAiGenerating={setIsAiGenerating}
              setPendingReview={setPendingReview}
              setIsAssistantOpen={setIsAssistantOpen}
              onSubmissionComplete={handleSubmissionComplete}
              onRunTests={recordActivity}
              onTestResultsUpdate={setLatestTestResults}
            />
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* AI Assistant Sidebar */}
        <AnimatePresence>
          {isAssistantOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAssistantOpen(false)}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              />

              {/* Sidebar */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed right-0 top-14 bottom-0 z-50 w-full max-w-[400px] border-l border-border bg-background shadow-2xl flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-[#3182F6]" />
                    <h2 className="text-base font-bold text-foreground">
                      {copy.problem.aiMentor}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsAssistantOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-hidden">
                  <CodeAssistantChat
                    code={code}
                    problemTitle={localizedProblem.title}
                    problemDescription={localizedProblem.description}
                    testResults={latestTestResults}
                    isAiGenerating={isAiGenerating}
                    pendingReview={pendingReview}
                    strategicHint={strategicHint}
                    elapsedMinutes={Math.floor(elapsedSeconds / 60)}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
      <AlertDialog open={isMentorAlertOpen} onOpenChange={setIsMentorAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI 멘토 설정 필요</AlertDialogTitle>
            <AlertDialogDescription>
              모델을 등록해야만 정확한 피드백이 가능합니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/settings")}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
