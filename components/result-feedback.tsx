"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  BookOpen,
  TrendingUp,
  X,
} from "lucide-react";
import { ScoreGauge } from "@/components/score-gauge";
import type { CodeAnalysis } from "@/lib/analyze-code";

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  consoleLogs?: string[];
}

interface JudgeResult {
  success: boolean;
  results: TestResult[];
  error?: string;
}

type DifficultyFeedback = "easy" | "fair" | "hard" | null;

interface ResultFeedbackProps {
  result: JudgeResult;
  analysis: CodeAnalysis;
  onClose: () => void;
  onNextChallenge: () => void;
}

function AnimatedCounter({
  target,
  max,
  delay = 0,
}: {
  target: number;
  max: number;
  delay?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 800;
      const startTime = Date.now();

      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        start = Math.round(eased * target);
        setValue(start);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, delay]);

  return (
    <span className="tabular-nums">
      {value}
      <span className="text-muted-foreground">/{max}</span>
    </span>
  );
}

function EfficiencyBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  const config = {
    High: {
      bg: "bg-[hsl(145,65%,93%)]",
      text: "text-[hsl(145,65%,32%)]",
      icon: Zap,
    },
    Medium: {
      bg: "bg-[hsl(38,92%,92%)]",
      text: "text-[hsl(38,72%,38%)]",
      icon: TrendingUp,
    },
    Low: {
      bg: "bg-[hsl(0,72%,93%)]",
      text: "text-[hsl(0,72%,42%)]",
      icon: AlertTriangle,
    },
  };

  const c = config[level];
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${c.bg} ${c.text}`}
    >
      <Icon className="h-3 w-3" />
      {level} Efficiency
    </span>
  );
}

export function ResultFeedback({
  result,
  analysis,
  onClose,
  onNextChallenge,
}: ResultFeedbackProps) {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFeedback>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const confettiFired = useRef(false);

  // Fire confetti for perfect score
  useEffect(() => {
    if (analysis.totalScore === 100 && !confettiFired.current) {
      confettiFired.current = true;
      // @ts-ignore
      import("canvas-confetti").then((mod) => {
        const fire = mod.default;
        // Two bursts
        fire({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6, x: 0.3 },
          colors: ["#3B82F6", "#10B981", "#F59E0B"],
        });
        setTimeout(() => {
          fire({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6, x: 0.7 },
            colors: ["#3B82F6", "#10B981", "#F59E0B"],
          });
        }, 200);
      });
    }
  }, [analysis.totalScore]);

  const handleDifficulty = useCallback((level: DifficultyFeedback) => {
    setSelectedDifficulty(level);
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 2000);
  }, []);

  const passedCount = result.results.filter((r) => r.passed).length;
  const totalCount = result.results.length;

  const breakdownItems = [
    {
      label: "Correctness",
      value: analysis.correctness,
      max: 60,
      icon: CheckCircle2,
      color: "text-success",
      delay: 600,
    },
    {
      label: "Efficiency",
      value: analysis.efficiency,
      max: 20,
      icon: Zap,
      color: "text-primary",
      delay: 800,
    },
    {
      label: "Readability",
      value: analysis.readability,
      max: 20,
      icon: BookOpen,
      color: "text-warning",
      delay: 1000,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-[32px] bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle + close */}
        <div className="relative flex flex-shrink-0 items-center justify-center px-6 pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-border" />
          <button
            onClick={onClose}
            className="absolute right-4 top-3 flex h-8 w-8 items-center justify-center rounded-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close results"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Error state */}
          {result.error ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="py-8"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Compilation Error
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fix the error and try again
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
                <code className="whitespace-pre-wrap font-mono text-xs text-destructive">
                  {result.error}
                </code>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Score gauge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex flex-col items-center pt-2"
              >
                <ScoreGauge score={analysis.totalScore} size={180} />

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-1 text-sm text-muted-foreground"
                >
                  {passedCount}/{totalCount} test cases passed
                </motion.p>
              </motion.div>

              {/* Score breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 rounded-[24px] border border-border/60 bg-card p-5"
              >
                <h4 className="text-sm font-semibold text-foreground">
                  Score Breakdown
                </h4>
                <div className="mt-3 flex flex-col gap-3">
                  {breakdownItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <item.icon
                        className={`h-4 w-4 flex-shrink-0 ${item.color}`}
                      />
                      <span className="min-w-[85px] text-sm text-foreground">
                        {item.label}
                      </span>
                      <div className="flex-1">
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              backgroundColor:
                                item.label === "Correctness"
                                  ? "hsl(145, 65%, 42%)"
                                  : item.label === "Efficiency"
                                  ? "hsl(213, 90%, 55%)"
                                  : "hsl(38, 92%, 50%)",
                            }}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(item.value / item.max) * 100}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              ease: "easeOut",
                              delay: item.delay / 1000,
                            }}
                          />
                        </div>
                      </div>
                      <span className="min-w-[45px] text-right text-sm font-semibold text-foreground">
                        <AnimatedCounter
                          target={item.value}
                          max={item.max}
                          delay={item.delay}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Feedback card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 rounded-[24px] border border-[#3182F6]/20 bg-[#3182F6]/5 p-5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-accent-foreground">
                    How to improve?
                  </h4>
                  <EfficiencyBadge level={analysis.efficiencyLevel} />
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <div className="rounded-[16px] bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Complexity Analysis
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      Your solution runs in{" "}
                      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
                        {analysis.bigO}
                      </code>{" "}
                      time complexity.
                    </p>
                  </div>

                  <div className="rounded-[16px] bg-background p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Recommendation
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                      {analysis.suggestion}
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {analysis.detailedFeedback}
                  </p>
                </div>
              </motion.div>

              {/* Test case results (Programmers Style) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4 rounded-[24px] border border-border/60 bg-card p-5"
              >
                <h4 className="text-base font-bold text-foreground">
                  Test Cases
                </h4>
                <div className="mt-4 flex flex-col gap-3">
                  {result.results.map((testResult, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + i * 0.05 }}
                      className={`rounded-[16px] border-2 p-4 ${
                        testResult.passed
                          ? "border-[#3182F6]/20 bg-[#3182F6]/5"
                          : "border-red-500/20 bg-red-50 dark:bg-red-950/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-foreground">
                          Test {i + 1}
                        </span>
                        <span
                          className={`rounded-[12px] px-3 py-1.5 text-xs font-bold ${
                            testResult.passed
                              ? "bg-[#3182F6] text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {testResult.passed ? "통과하였습니다" : "실패"}
                        </span>
                      </div>

                      {/* Input Section */}
                      <div className="mb-2">
                        <div className="text-muted-foreground font-semibold text-xs mb-1">
                          Input:
                        </div>
                        <code className="block rounded-[12px] bg-background px-3 py-2 font-mono text-xs text-foreground">
                          {testResult.input}
                        </code>
                      </div>

                      {/* Console Output Section */}
                      {testResult.consoleLogs &&
                        testResult.consoleLogs.length > 0 && (
                          <div className="mb-2">
                            <div className="text-muted-foreground font-semibold text-xs mb-1">
                              Console Output:
                            </div>
                            <div className="rounded-[12px] bg-muted/50 px-3 py-2 font-mono text-[11px] space-y-0.5">
                              {testResult.consoleLogs.map((log, idx) => (
                                <div
                                  key={idx}
                                  className="text-muted-foreground"
                                >
                                  {log}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Output Section */}
                      <div className="mb-2">
                        <div className="text-muted-foreground font-semibold text-xs mb-1">
                          Output:
                        </div>
                        <code className="block rounded-[12px] bg-background px-3 py-2 font-mono text-xs text-foreground">
                          {testResult.actual}
                        </code>
                      </div>

                      {/* Result Section */}
                      {!testResult.passed && (
                        <div>
                          <div className="text-muted-foreground font-semibold text-xs mb-1">
                            Status:
                          </div>
                          <div className="rounded-[12px] bg-background p-3">
                            <p className="text-xs font-medium text-red-600 dark:text-red-400">
                              Expected: {testResult.expected}, but got:{" "}
                              {testResult.actual}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Self-reflection survey */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-4 rounded-[24px] border border-border/60 bg-card p-5"
              >
                <h4 className="text-sm font-semibold text-foreground">
                  How difficult was this for you?
                </h4>
                <div className="mt-3 flex items-center justify-center gap-3">
                  {(
                    [
                      { key: "easy", emoji: "\u{1F60A}", label: "Easy" },
                      { key: "fair", emoji: "\u{1F914}", label: "Fair" },
                      { key: "hard", emoji: "\u{1F92F}", label: "Hard" },
                    ] as const
                  ).map((item) => (
                    <motion.button
                      key={item.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDifficulty(item.key)}
                      className={`flex flex-col items-center gap-1 rounded-2xl border px-5 py-3 transition-all ${
                        selectedDifficulty === item.key
                          ? "border-primary bg-accent shadow-sm"
                          : "border-border/60 bg-background hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      <span
                        className="text-2xl"
                        role="img"
                        aria-label={item.label}
                      >
                        {item.emoji}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {showThankYou && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-2 text-center text-xs text-primary"
                    >
                      Thanks for your feedback!
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Next Challenge button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-6 pb-2"
              >
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onNextChallenge}
                  className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#3182F6] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#3182F6]/30 transition-all hover:bg-[#2870d8] hover:shadow-xl hover:shadow-[#3182F6]/40"
                >
                  Next Challenge
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
