"use client"

import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProblemCard } from "@/components/problem-card"
import { StreakWidget } from "@/components/streak-widget"
import { StatsWidget } from "@/components/stats-widget"
import { PageTransition } from "@/components/page-transition"
import { problems } from "@/lib/problems"
import {
  getSolvedProblemIds,
  subscribeToProgressUpdates,
} from "@/lib/local-progress"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
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
      { name: "All", count: problems.length },
      ...Array.from(map.entries()).map(([name, count]) => ({ name, count })),
    ]
  }, [])

  const filteredProblems = useMemo(() => {
    if (selectedCategory === "All") {
      return problems
    }
    return problems.filter((problem) => problem.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageTransition>
        <HeroSection />
        <main className="mx-auto w-full max-w-[1400px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Main Content Area */}
            <div id="problems" className="min-w-0 flex-1 w-full">
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  {selectedCategory === "All"
                    ? "All Challenges"
                    : `${selectedCategory} Challenges`}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {filteredProblems.length} problems
                </span>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                      category.name === selectedCategory
                        ? "bg-[#3182F6] text-white"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {filteredProblems.map((problem, i) => (
                  <ProblemCard
                    key={problem.id}
                    problem={problem}
                    index={i}
                    isSolved={solvedIds.has(problem.id)}
                  />
                ))}
              </div>
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
    </div>
  )
}
