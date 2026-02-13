"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAppLanguage } from "@/lib/use-app-language"

interface ScoreGaugeProps {
  score: number
  size?: number
}

function getScoreColor(score: number) {
  if (score >= 90) return "hsl(145, 65%, 42%)"
  if (score >= 70) return "hsl(213, 90%, 55%)"
  if (score >= 50) return "hsl(38, 92%, 50%)"
  return "hsl(0, 72%, 55%)"
}

function getScoreLabel(score: number, language: "en" | "ko") {
  if (language === "ko") {
    if (score >= 90) return "매우 우수"
    if (score >= 70) return "좋음"
    if (score >= 50) return "보통"
    return "개선 필요"
  }

  if (score >= 90) return "Excellent"
  if (score >= 70) return "Great"
  if (score >= 50) return "Good"
  return "Needs Work"
}

export function ScoreGauge({ score, size = 200 }: ScoreGaugeProps) {
  const { language } = useAppLanguage()
  const [animatedScore, setAnimatedScore] = useState(0)

  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  // Semi-circle: half circumference
  const circumference = Math.PI * radius
  const color = getScoreColor(score)
  const label = getScoreLabel(score, language)

  useEffect(() => {
    const delay = setTimeout(() => {
      const duration = 1000
      const startTime = Date.now()

      const tick = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setAnimatedScore(Math.round(eased * score))
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    }, 300)
    return () => clearTimeout(delay)
  }, [score])

  const progress = animatedScore / 100
  const dashOffset = circumference * (1 - progress)

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: size, height: size / 2 + 40 }}
    >
      <svg
        width={size}
        height={size / 2 + strokeWidth}
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        className="overflow-visible"
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="hsl(214, 15%, 91%)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Animated progress arc */}
        <motion.path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>

      {/* Score number in the center */}
      <div
        className="absolute flex flex-col items-center"
        style={{ top: size / 2 - 28 }}
      >
        <motion.span
          className="text-4xl font-bold tabular-nums text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.8,
            type: "spring",
            stiffness: 200,
          }}
        >
          {animatedScore}
        </motion.span>
        <motion.span
          className="text-xs font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  )
}
