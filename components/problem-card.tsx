"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Hash,
  Layers,
  Link as LinkIcon,
  TrendingUp,
  LayoutGrid,
  ScanLine,
  GitBranch,
  Droplets,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  getLocalizedProblemText,
  type Problem,
} from "@/lib/problems"
import { cn } from "@/lib/utils"
import { useAppLanguage } from "@/lib/use-app-language"

const iconMap: Record<string, React.ElementType> = {
  Hash,
  Layers,
  Link: LinkIcon,
  TrendingUp,
  LayoutGrid,
  ScanLine,
  GitBranch,
  Droplets,
}

const difficultyConfig: Record<
  string,
  { bg: string; text: string }
> = {
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

interface ProblemCardProps {
  problem: Problem
  index: number
  isSolved?: boolean
}

export function ProblemCard({ problem, index, isSolved = false }: ProblemCardProps) {
  const { language, copy } = useAppLanguage()
  const Icon = iconMap[problem.categoryIcon] || Hash
  const diffStyle = difficultyConfig[problem.difficulty]
  const localized = getLocalizedProblemText(problem, language)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="w-full"
    >
      <Link href={`/problem/${problem.id}`} className="group block">
        <div className="flex items-center gap-3 sm:gap-4 rounded-[24px] border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:bg-accent/50 hover:shadow-lg hover:shadow-primary/5 lg:p-5 w-full box-border">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="truncate text-sm font-semibold text-foreground lg:text-base">
                {localized.text.title}
              </h3>
              {localized.isFallback && (
                <Badge
                  variant="secondary"
                  className="border-0 text-[10px] font-semibold bg-[#eef4ff] text-[#2f66d0]"
                >
                  {copy.problem.fallbackEnglish}
                </Badge>
              )}
              {isSolved && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(145,65%,93%)] px-2 py-0.5 text-[10px] font-semibold text-[hsl(145,65%,32%)]">
                  <CheckCircle2 className="h-3 w-3" />
                  {copy.problemCard.solved}
                </span>
              )}
              <Badge
                variant="secondary"
                className={cn(
                  "border-0 text-[11px] font-semibold flex-shrink-0",
                  diffStyle.bg,
                  diffStyle.text
                )}
              >
                {problem.difficulty}
              </Badge>
            </div>

            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              {localized.text.category}
            </p>
          </div>

          <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary hidden sm:block" />
        </div>
      </Link>
    </motion.div>
  )
}
