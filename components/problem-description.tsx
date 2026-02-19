"use client"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getLocalizedProblemText, type Problem } from "@/lib/problems"
import { cn } from "@/lib/utils"
import { useAppLanguage } from "@/lib/use-app-language"

const difficultyConfig: Record<string, { bg: string; text: string }> = {
  Easy: {
    bg: "bg-[hsl(145,65%,93%)]",
    text: "text-[hsl(145,65%,32%)]",
  },
  Medium: {
    bg: "bg-[hsl(38,92%,92%)]",
    text: "text-[hsl(38,72%,38%)]",
  },
  Hard: {
    bg: "bg-[hsl(0,72%,93%)]",
    text: "text-[hsl(0,72%,42%)]",
  },
}

interface ProblemDescriptionProps {
  problem: Problem
}

function renderExponentText(text: string, keyPrefix: string) {
  const parts = text.split(/(\^-?\d+)/g)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith("^") && /^-?\d+$/.test(part.slice(1))) {
      return (
        <sup
          key={`${keyPrefix}-sup-${i}`}
          className="relative -top-[0.3em] text-[0.72em] leading-none align-baseline"
        >
          {part.slice(1)}
        </sup>
      )
    }
    return <span key={`${keyPrefix}-txt-${i}`}>{part}</span>
  })
}

function renderMarkdown(text: string) {
  const parts = text.split(/(`[^`]+`)|(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded-lg bg-muted px-1.5 py-0.5 font-mono text-[13px] text-primary"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{renderExponentText(part, `md-${i}`)}</span>
  })
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const { language, copy } = useAppLanguage()
  const diffStyle = difficultyConfig[problem.difficulty]
  const localized = getLocalizedProblemText(problem, language)
  const isNew = (problem.tags ?? []).includes("NEW")

  return (
    <ScrollArea className="h-full">
      <div className="p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground lg:text-2xl">
              {localized.text.title}
            </h1>
            {isNew && (
              <Badge
                variant="secondary"
                className="border-0 text-xs font-semibold bg-[#fff4e5] text-[#b85a00]"
              >
                NEW
              </Badge>
            )}
            {localized.isFallback && (
              <Badge
                variant="secondary"
                className="border-0 text-xs font-semibold bg-[#eef4ff] text-[#2f66d0]"
              >
                {copy.problem.fallbackEnglish}
              </Badge>
            )}
            <Badge
              variant="secondary"
              className={cn(
                "border-0 text-xs font-semibold",
                diffStyle.bg,
                diffStyle.text
              )}
            >
              {problem.difficulty}
            </Badge>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {localized.text.category}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          className="mt-6"
        >
          {localized.text.description.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("1.") || paragraph.startsWith("2.") || paragraph.startsWith("3.")) {
              const items = paragraph.split("\n")
              return (
                <ol key={i} className="mt-3 flex flex-col gap-1.5 pl-5 text-sm leading-relaxed text-foreground/80 list-decimal">
                  {items.map((item, j) => (
                    <li key={j}>{renderMarkdown(item.replace(/^\d+\.\s*/, ""))}</li>
                  ))}
                </ol>
              )
            }
            return (
              <p
                key={i}
                className="mt-3 text-sm leading-relaxed text-foreground/80"
              >
                {renderMarkdown(paragraph)}
              </p>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          className="mt-8 flex flex-col gap-4"
        >
          {localized.text.examples.map((example, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-muted/50 p-4"
            >
              <p className="text-xs font-semibold text-muted-foreground">
                {copy.problem.examples} {i + 1}
              </p>
              <div className="mt-2 flex flex-col gap-1.5">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 text-xs font-medium text-muted-foreground">
                    {copy.problem.input}:
                  </span>
                  <code className="font-mono text-xs text-foreground">
                    {example.input}
                  </code>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 text-xs font-medium text-muted-foreground">
                    {copy.problem.output}:
                  </span>
                  <code className="font-mono text-xs text-primary">
                    {example.output}
                  </code>
                </div>
                {example.explanation && (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {example.explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
          className="mt-8"
        >
          <h3 className="text-sm font-semibold text-foreground">{copy.problem.constraints}</h3>
          <ul className="mt-2 flex flex-col gap-1">
            {localized.text.constraints.map((constraint, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary/40" />
                <code className="font-mono">{renderExponentText(constraint, `constraint-${i}`)}</code>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </ScrollArea>
  )
}
