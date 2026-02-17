"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { VirtualizedProblemList } from "@/components/virtualized-problem-list"
import { StreakWidget } from "@/components/streak-widget"
import { StatsWidget } from "@/components/stats-widget"
import { ExternalProblemFeedback } from "@/components/external-problem-feedback"
import { PageTransition } from "@/components/page-transition"
import { problems } from "@/lib/problems"
import { localizeCategory } from "@/lib/problems"
import type { Difficulty, Problem } from "@/lib/problems"
import {
  getSolvedProblemIds,
  subscribeToProgressUpdates,
} from "@/lib/local-progress"
import { useAppLanguage } from "@/lib/use-app-language"
import { usePageEntryAnimation } from "@/lib/use-page-entry-animation"
import { useRestoreScroll } from "@/lib/use-restore-scroll"

interface HomeViewState {
  selectedCategory: string
  selectedDifficulty: "ALL" | Difficulty
  sortBy: "difficulty-asc" | "difficulty-desc"
}

function parseHomeViewState(value: unknown): HomeViewState | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const parsed = value as Partial<HomeViewState>
  if (
    typeof parsed.selectedCategory !== "string" ||
    (parsed.selectedDifficulty !== "ALL" &&
      parsed.selectedDifficulty !== "Easy" &&
      parsed.selectedDifficulty !== "Medium" &&
      parsed.selectedDifficulty !== "Hard") ||
    (parsed.sortBy !== "difficulty-asc" && parsed.sortBy !== "difficulty-desc")
  ) {
    return null
  }

  return {
    selectedCategory: parsed.selectedCategory,
    selectedDifficulty: parsed.selectedDifficulty,
    sortBy: parsed.sortBy,
  }
}

export default function HomePage() {
  const { language, copy } = useAppLanguage()
  const shouldAnimateOnMount = usePageEntryAnimation()
  const [viewState, setViewState] = useRestoreScroll<HomeViewState>({
    storageKey: "codedash.home.view-state.v1",
    defaultState: {
      selectedCategory: "ALL",
      selectedDifficulty: "ALL",
      sortBy: "difficulty-asc",
    },
    parseState: parseHomeViewState,
  })
  const { selectedCategory, selectedDifficulty, sortBy } = viewState
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const sync = () => setSolvedIds(getSolvedProblemIds())
    sync()
    return subscribeToProgressUpdates(sync)
  }, [])

  const categories = useMemo(() => {
    const map = new Map<string, number>()
    for (const problem of problems) {
      map.set(problem.category, (map.get(problem.category) ?? 0) + 1)
    }
    return [
      { name: "ALL", count: problems.length },
      ...Array.from(map.entries()).map(([name, count]) => ({ name, count })),
    ]
  }, [])

  const difficultyOptions: Array<"ALL" | Difficulty> = ["ALL", "Easy", "Medium", "Hard"]
  const allDifficultyLabel = language === "ko" ? "전체 난이도" : "All Difficulty"
  const sortByLabel = language === "ko" ? "정렬" : "Sort by"
  const sortDifficultyAscLabel =
    language === "ko" ? "난이도 오름차순" : "Difficulty Ascending"
  const sortDifficultyDescLabel =
    language === "ko" ? "난이도 내림차순" : "Difficulty Descending"

  const difficultyRank: Record<Difficulty, number> = {
    Easy: 0,
    Medium: 1,
    Hard: 2,
  }

  const filteredProblems = useMemo(() => {
    const byCategory = selectedCategory === "ALL"
      ? problems
      : problems.filter((problem) => problem.category === selectedCategory)

    const byDifficulty = selectedDifficulty === "ALL"
      ? byCategory
      : byCategory.filter((problem) => problem.difficulty === selectedDifficulty)

    const sorted = [...byDifficulty]
    if (sortBy === "difficulty-desc") {
      sorted.sort((a, b) => difficultyRank[b.difficulty] - difficultyRank[a.difficulty])
    } else {
      sorted.sort((a, b) => difficultyRank[a.difficulty] - difficultyRank[b.difficulty])
    }

    return sorted
  }, [selectedCategory, selectedDifficulty, sortBy, difficultyRank])

  const getDifficultyCount = (difficulty: "ALL" | Difficulty) => {
    const source: Problem[] = selectedCategory === "ALL"
      ? problems
      : problems.filter((problem) => problem.category === selectedCategory)
    if (difficulty === "ALL") {
      return source.length
    }
    return source.filter((problem) => problem.difficulty === difficulty).length
  }

  return (
    <PageTransition animateOnMount={shouldAnimateOnMount}>
      <HeroSection />
      <main className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Main Content Area */}
          <div id="problems" className="min-w-0 flex-1 w-full">
            <ExternalProblemFeedback />
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {selectedCategory === "ALL"
                  ? copy.home.allChallenges
                  : `${localizeCategory(selectedCategory, language)} ${copy.home.challenges}`}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredProblems.length} {copy.home.problems}
              </span>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() =>
                    setViewState((prev) => ({ ...prev, selectedCategory: category.name }))
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    category.name === selectedCategory
                      ? "bg-[#3182F6] text-white"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {category.name === "ALL"
                    ? copy.home.allCategory
                    : localizeCategory(category.name, language)}{" "}
                  ({category.count})
                </button>
              ))}
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {difficultyOptions.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() =>
                    setViewState((prev) => ({ ...prev, selectedDifficulty: difficulty }))
                  }
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    difficulty === selectedDifficulty
                      ? "bg-[#3182F6] text-white"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {difficulty === "ALL" ? allDifficultyLabel : difficulty} ({getDifficultyCount(difficulty)})
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{sortByLabel}</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setViewState((prev) => ({
                        ...prev,
                        sortBy: e.target.value as "difficulty-asc" | "difficulty-desc",
                      }))
                    }
                    className="h-8 appearance-none rounded-md border border-border bg-card pl-2 pr-8 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[#3182F6]"
                  >
                    <option value="difficulty-asc">{sortDifficultyAscLabel}</option>
                    <option value="difficulty-desc">{sortDifficultyDescLabel}</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
            <VirtualizedProblemList problems={filteredProblems} solvedIds={solvedIds} />
          </div>

          {/* Sidebar Widgets */}
          <aside className="w-full flex-shrink-0 lg:w-80 xl:w-[340px]">
            <div className="sticky top-24 flex flex-col gap-4">
              <StreakWidget />
              <StatsWidget />
            </div>
          </aside>
        </div>
      </main>
    </PageTransition>
  )
}
