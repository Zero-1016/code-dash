"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Loader2, Plus, Trash2 } from "lucide-react";
import type { Problem } from "@/lib/problems";
import { problems } from "@/lib/problems";
import { analyzeCodeWithAI, type CodeAnalysis } from "@/lib/analyze-code";
import { ResultFeedback } from "@/components/result-feedback";
import { AddTestCaseModal } from "@/components/add-test-case-modal";

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  isCustom?: boolean;
  consoleLogs?: string[];
}

interface CustomTestCase {
  input: string;
  expected: string;
}

interface JudgeResult {
  success: boolean;
  results: TestResult[];
  error?: string;
}

interface CodeEditorPanelProps {
  problem: Problem;
  code: string;
  setCode: (code: string) => void;
  setIsAiGenerating?: (value: boolean) => void;
  setPendingReview?: (review: string | null) => void;
  setIsAssistantOpen?: (value: boolean) => void;
  onSubmissionComplete?: (result: {
    success: boolean;
    passed: number;
    total: number;
  }) => void;
  onRunTests?: () => void;
}

function judgeCode(code: string, problem: Problem): JudgeResult {
  const results: TestResult[] = [];

  try {
    for (const testCase of problem.testCases) {
      const consoleLogs: string[] = [];

      try {
        // Create a custom console.log that captures output
        const mockConsole = {
          log: (...args: unknown[]) => {
            consoleLogs.push(
              args
                .map((arg) =>
                  typeof arg === "object" ? JSON.stringify(arg) : String(arg)
                )
                .join(" ")
            );
          },
        };

        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "console",
          `${code}\nreturn ${problem.functionName};`
        )(mockConsole);
        const actual = fn(...structuredClone(testCase.input));
        const passed =
          JSON.stringify(actual) === JSON.stringify(testCase.expected);

        results.push({
          passed,
          input: testCase.input.map((val) => JSON.stringify(val)).join(", "),
          expected: JSON.stringify(testCase.expected),
          actual: JSON.stringify(actual),
          consoleLogs: consoleLogs.length > 0 ? consoleLogs : undefined,
        });
      } catch (err) {
        results.push({
          passed: false,
          input: testCase.input.map((val) => JSON.stringify(val)).join(", "),
          expected: JSON.stringify(testCase.expected),
          actual: `Runtime Error: ${(err as Error).message}`,
          consoleLogs: consoleLogs.length > 0 ? consoleLogs : undefined,
        });
      }
    }

    return {
      success: results.every((r) => r.passed),
      results,
    };
  } catch (err) {
    return {
      success: false,
      results: [],
      error: `Syntax Error: ${(err as Error).message}`,
    };
  }
}

export function CodeEditorPanel({
  problem,
  code,
  setCode,
  setIsAiGenerating,
  setPendingReview,
  setIsAssistantOpen,
  onSubmissionComplete,
  onRunTests,
}: CodeEditorPanelProps) {
  const router = useRouter();
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [isJudging, setIsJudging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [customTestCases, setCustomTestCases] = useState<CustomTestCase[]>([]);
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);

  const handleSubmit = useCallback(async () => {
    setIsJudging(true);
    setShowResult(false);

    // Add a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = judgeCode(code, problem);
    const passedCount = result.results.filter((r) => r.passed).length;
    const totalCount = result.results.length;
    const passedRatio = totalCount > 0 ? passedCount / totalCount : 0;

    if (onSubmissionComplete) {
      onSubmissionComplete({
        success: result.success,
        passed: passedCount,
        total: totalCount,
      });
    }

    // Call AI API for analysis
    const codeAnalysis = await analyzeCodeWithAI(
      code,
      problem.title,
      result.success,
      passedRatio,
      result.results
    );

    setJudgeResult(result);
    setAnalysis(codeAnalysis);
    setIsJudging(false);
    setShowResult(true);
  }, [code, onSubmissionComplete, problem]);

  const handleReset = useCallback(() => {
    setCode(problem.starterCode);
    setJudgeResult(null);
    setAnalysis(null);
    setShowResult(false);
    setTestResults([]);
  }, [problem.starterCode, setCode]);

  const handleRunTests = useCallback(async () => {
    if (onRunTests) {
      onRunTests();
    }

    setIsRunningTests(true);
    setTestResults([]);

    // Clear any previous review
    if (setPendingReview) {
      setPendingReview(null);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    const result = judgeCode(code, problem);
    const defaultResults = result.results.slice(0, 2);

    // Run custom test cases
    const customResults: TestResult[] = customTestCases.map((testCase) => {
      const consoleLogs: string[] = [];
      try {
        // Parse input
        const parsedInput = JSON.parse(`[${testCase.input}]`);
        const parsedExpected = JSON.parse(testCase.expected);

        // Create mock console
        const mockConsole = {
          log: (...args: unknown[]) => {
            consoleLogs.push(
              args
                .map((arg) =>
                  typeof arg === "object" ? JSON.stringify(arg) : String(arg)
                )
                .join(" ")
            );
          },
        };

        // eslint-disable-next-line no-new-func
        const fn = new Function(
          "console",
          `${code}\nreturn ${problem.functionName};`
        )(mockConsole);
        const actual = fn(...parsedInput);
        const passed =
          JSON.stringify(actual) === JSON.stringify(parsedExpected);

        return {
          passed,
          input: testCase.input,
          expected: testCase.expected,
          actual: JSON.stringify(actual),
          isCustom: true,
          consoleLogs: consoleLogs.length > 0 ? consoleLogs : undefined,
        };
      } catch (err) {
        return {
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: `Error: ${(err as Error).message}`,
          isCustom: true,
          consoleLogs: consoleLogs.length > 0 ? consoleLogs : undefined,
        };
      }
    });

    const allResults = [...defaultResults, ...customResults];
    setTestResults(allResults);
    setIsRunningTests(false);

    // Trigger AI code review
    if (setIsAiGenerating && setPendingReview && setIsAssistantOpen) {
      setIsAiGenerating(true);

      try {
        const response = await fetch("/api/review-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            problemTitle: problem.title,
            problemDescription: problem.description,
            testResults: allResults,
            allTestsPassed: allResults.every((r) => r.passed),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setPendingReview(data.feedback);

          // Auto-open AI Assistant after a brief delay
          setTimeout(() => {
            setIsAssistantOpen(true);
          }, 800);
        }
      } catch (error) {
        console.error("Failed to get AI review:", error);
      } finally {
        setIsAiGenerating(false);
      }
    }
  }, [
    code,
    problem,
    customTestCases,
    setIsAiGenerating,
    setPendingReview,
    setIsAssistantOpen,
    onRunTests,
  ]);

  const handleAddCustomTest = useCallback((testCase: CustomTestCase) => {
    setCustomTestCases((prev) => [...prev, testCase]);
  }, []);

  const handleRemoveCustomTest = useCallback((index: number) => {
    setCustomTestCases((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleNextChallenge = useCallback(() => {
    const currentIndex = problems.findIndex((p) => p.id === problem.id);
    const nextIndex = (currentIndex + 1) % problems.length;
    const nextProblem = problems[nextIndex];
    router.push(`/problem/${nextProblem.id}`);
  }, [problem.id, router]);

  return (
    <div className="relative flex h-full max-h-full flex-col bg-background overflow-hidden">
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

      <div className="flex-1 min-h-0 relative z-10" style={{ overflow: 'visible' }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs"
          options={{
            fontSize: 14,
            fontFamily: "var(--font-jetbrains-mono), monospace",
            lineHeight: 22,
            padding: { top: 16, bottom: 16 },
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderLineHighlight: "none",
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            scrollbar: {
              vertical: "hidden",
              horizontal: "hidden",
            },
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: "on",
            folding: false,
            glyphMargin: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            fixedOverflowWidgets: true,
          }}
        />
      </div>

      {/* Test Cases Preview */}
      <div className="flex-shrink-0 border-t border-border/60 bg-muted/20 p-4 max-h-[320px] overflow-y-auto">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground">
            Test Cases (
            {problem.testCases.slice(0, 2).length + customTestCases.length})
          </h3>
        </div>

        <div className="space-y-2">
          {/* Default Test Cases */}
          {problem.testCases.slice(0, 2).map((testCase, index) => {
            const testResult = testResults[index];
            return (
              <div
                key={`default-${index}`}
                className="rounded-[16px] border border-border/60 bg-background p-4 text-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-foreground">
                    Test Case {index + 1}
                  </span>
                  {testResult && (
                    <span
                      className={`rounded-[12px] px-3 py-1.5 text-[10px] font-bold ${
                        testResult.passed
                          ? "bg-[#3182F6] text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {testResult.passed ? "Passed" : "Failed"}
                    </span>
                  )}
                </div>

                {/* Input Section */}
                <div className="mb-2">
                  <div className="text-muted-foreground font-semibold mb-1">
                    Input:
                  </div>
                  <code className="block rounded-[12px] bg-muted px-3 py-2 font-mono text-foreground">
                    {testCase.input
                      .map((val) => JSON.stringify(val))
                      .join(", ")}
                  </code>
                </div>

                {/* Console Output Section */}
                {testResult?.consoleLogs &&
                  testResult.consoleLogs.length > 0 && (
                    <div className="mb-2">
                      <div className="text-muted-foreground font-semibold mb-1">
                        Console Output:
                      </div>
                      <div className="rounded-[12px] bg-muted/50 px-3 py-2 font-mono text-[11px] space-y-0.5">
                        {testResult.consoleLogs.map((log, i) => (
                          <div key={i} className="text-muted-foreground">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Result Section */}
                {testResult && (
                  <div>
                    <div className="text-muted-foreground font-semibold mb-1">
                      Result:
                    </div>
                    {testResult.passed ? (
                      <div className="rounded-[12px] bg-[#3182F6]/10 px-3 py-2 text-[#3182F6] font-medium">
                        ✓ Passed
                      </div>
                    ) : (
                      <div className="rounded-[12px] bg-red-50 dark:bg-red-950/20 px-3 py-2 text-red-600 dark:text-red-400 font-medium">
                        Expected: {JSON.stringify(testCase.expected)}, but got:{" "}
                        {testResult.actual}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Custom Test Cases */}
          {customTestCases.map((testCase, index) => {
            const testResult =
              testResults[problem.testCases.slice(0, 2).length + index];
            return (
              <div
                key={`custom-${index}`}
                className="rounded-[16px] border-2 border-[#3182F6]/30 bg-[#3182F6]/5 p-4 text-xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      Custom Test {index + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveCustomTest(index)}
                      className="flex h-6 w-6 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  {testResult && (
                    <span
                      className={`rounded-[12px] px-3 py-1.5 text-[10px] font-bold ${
                        testResult.passed
                          ? "bg-[#3182F6] text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {testResult.passed ? "Passed" : "Failed"}
                    </span>
                  )}
                </div>

                {/* Input Section */}
                <div className="mb-2">
                  <div className="text-muted-foreground font-semibold mb-1">Input:</div>
                  <code className="block rounded-[12px] bg-background px-3 py-2 font-mono text-foreground">
                    {testCase.input}
                  </code>
                </div>

                {/* Console Output Section */}
                {testResult?.consoleLogs && testResult.consoleLogs.length > 0 && (
                  <div className="mb-2">
                    <div className="text-muted-foreground font-semibold mb-1">Console Output:</div>
                    <div className="rounded-[12px] bg-background/50 px-3 py-2 font-mono text-[11px] space-y-0.5">
                      {testResult.consoleLogs.map((log, i) => (
                        <div key={i} className="text-muted-foreground">{log}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Result Section */}
                {testResult && (
                  <div>
                    <div className="text-muted-foreground font-semibold mb-1">Result:</div>
                    {testResult.passed ? (
                      <div className="rounded-[12px] bg-[#3182F6]/20 px-3 py-2 text-[#3182F6] font-medium">
                        ✓ Passed
                      </div>
                    ) : (
                      <div className="rounded-[12px] bg-red-100 dark:bg-red-950/40 px-3 py-2 text-red-600 dark:text-red-400 font-medium">
                        Expected: {testCase.expected}, but got: {testResult.actual}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Test Case Button */}
          <button
            onClick={() => setIsAddTestModalOpen(true)}
            className="w-full rounded-[16px] border-2 border-dashed border-border bg-muted/30 p-3 text-xs font-semibold text-muted-foreground transition-all hover:border-[#3182F6] hover:bg-[#3182F6]/5 hover:text-[#3182F6]"
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              Add Custom Test Case
            </div>
          </button>
        </div>
      </div>

      <AddTestCaseModal
        isOpen={isAddTestModalOpen}
        onClose={() => setIsAddTestModalOpen(false)}
        onAdd={handleAddCustomTest}
      />

      <div className="flex-shrink-0 border-t border-border/60 p-4">
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="flex flex-1 items-center justify-center gap-2 rounded-[20px] border-2 border-[#3182F6] bg-background px-6 py-3.5 text-sm font-bold text-[#3182F6] transition-all hover:bg-[#3182F6]/5 disabled:opacity-50"
          >
            {isRunningTests ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Run Tests
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isJudging}
            className="flex flex-1 items-center justify-center gap-2 rounded-[20px] bg-[#3182F6] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3182F6]/30 transition-all hover:bg-[#2870d8] hover:shadow-xl hover:shadow-[#3182F6]/40 disabled:opacity-70"
          >
            <AnimatePresence mode="wait">
              {isJudging ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing...
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  Submit Solution
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showResult && judgeResult && analysis && (
          <ResultFeedback
            result={judgeResult}
            analysis={analysis}
            onClose={() => setShowResult(false)}
            onNextChallenge={handleNextChallenge}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
