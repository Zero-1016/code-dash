"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProblemCard } from "@/components/problem-card"
import { StreakWidget } from "@/components/streak-widget"
import { StatsWidget } from "@/components/stats-widget"
import { PageTransition } from "@/components/page-transition"
import { problems } from "@/lib/problems"

export default function HomePage() {
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
                  All Challenges
                </h2>
                <span className="text-sm text-muted-foreground">
                  {problems.length} problems
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {problems.map((problem, i) => (
                  <ProblemCard key={problem.id} problem={problem} index={i} />
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
