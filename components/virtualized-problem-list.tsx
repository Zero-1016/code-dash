"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ProblemCard } from "@/components/problem-card"
import type { Problem } from "@/lib/problems"

const ROW_HEIGHT = 104
const OVERSCAN = 6
const VIRTUALIZATION_THRESHOLD = 30
const DEFAULT_VISIBLE_ROWS = 16

interface VirtualizedProblemListProps {
  problems: Problem[]
  solvedIds: Set<string>
}

interface Range {
  start: number
  end: number
}

function getInitialRange(count: number): Range {
  if (count === 0) {
    return { start: 0, end: -1 }
  }
  return {
    start: 0,
    end: Math.min(count - 1, DEFAULT_VISIBLE_ROWS),
  }
}

export function VirtualizedProblemList({
  problems,
  solvedIds,
}: VirtualizedProblemListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const [visibleRange, setVisibleRange] = useState<Range>(getInitialRange(problems.length))

  useEffect(() => {
    setVisibleRange(getInitialRange(problems.length))
  }, [problems.length])

  useEffect(() => {
    if (problems.length <= VIRTUALIZATION_THRESHOLD) {
      return
    }

    const updateRange = () => {
      const container = containerRef.current
      if (!container) {
        return
      }

      const containerTop = window.scrollY + container.getBoundingClientRect().top
      const viewportTop = window.scrollY
      const viewportBottom = viewportTop + window.innerHeight
      const visibleTop = Math.max(0, viewportTop - containerTop)
      const visibleBottom = Math.max(0, viewportBottom - containerTop)

      const start = Math.max(0, Math.floor(visibleTop / ROW_HEIGHT) - OVERSCAN)
      const end = Math.min(
        problems.length - 1,
        Math.ceil(visibleBottom / ROW_HEIGHT) + OVERSCAN
      )

      setVisibleRange((prev) => {
        if (prev.start === start && prev.end === end) {
          return prev
        }
        return { start, end }
      })
    }

    const scheduleRangeUpdate = () => {
      if (frameRef.current !== null) {
        return
      }
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        updateRange()
      })
    }

    updateRange()
    window.addEventListener("scroll", scheduleRangeUpdate, { passive: true })
    window.addEventListener("resize", scheduleRangeUpdate)

    return () => {
      window.removeEventListener("scroll", scheduleRangeUpdate)
      window.removeEventListener("resize", scheduleRangeUpdate)
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [problems.length])

  const visibleItems = useMemo(() => {
    if (problems.length <= VIRTUALIZATION_THRESHOLD) {
      return []
    }
    if (visibleRange.end < visibleRange.start) {
      return []
    }

    const items: Array<{ problem: Problem; index: number }> = []
    for (let index = visibleRange.start; index <= visibleRange.end; index += 1) {
      const problem = problems[index]
      if (problem) {
        items.push({ problem, index })
      }
    }
    return items
  }, [problems, visibleRange.end, visibleRange.start])

  if (problems.length <= VIRTUALIZATION_THRESHOLD) {
    return (
      <div className="flex flex-col gap-3">
        {problems.map((problem, index) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            index={index}
            isSolved={solvedIds.has(problem.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative w-full" style={{ height: problems.length * ROW_HEIGHT }}>
        {visibleItems.map(({ problem, index }) => (
          <div
            key={problem.id}
            className="absolute left-0 right-0"
            style={{ top: index * ROW_HEIGHT }}
          >
            <ProblemCard
              problem={problem}
              index={index}
              isSolved={solvedIds.has(problem.id)}
              animate={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
