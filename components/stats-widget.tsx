"use client"

import { motion } from "framer-motion"
import { Target, Zap, CheckCircle2 } from "lucide-react"

const stats = [
  {
    label: "Solved",
    value: "24",
    icon: Target,
    color: "text-primary",
    bg: "bg-accent",
  },
  {
    label: "Speed Avg",
    value: "12m",
    icon: Zap,
    color: "text-warning",
    bg: "bg-[hsl(38,92%,92%)]",
  },
  {
    label: "Completion",
    value: "86%",
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-[hsl(145,65%,93%)]",
  },
]

export function StatsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      className="w-full rounded-[24px] border border-border/60 bg-card p-6 box-border"
    >
      <h3 className="text-sm font-semibold text-foreground">Your Stats</h3>
      <div className="mt-4 flex flex-col gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}
            >
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
