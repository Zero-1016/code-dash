"use client"

import { motion } from "framer-motion"
import { Flame, Check } from "lucide-react"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const completedDays = [true, true, true, true, true, true, false]

export function StreakWidget() {
  const streak = completedDays.filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="w-full rounded-[24px] border border-border/60 bg-card p-5 box-border"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-foreground">Daily Streak</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Keep it going!
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-[hsl(38,92%,92%)] px-2.5 py-1 flex-shrink-0">
          <Flame className="h-3.5 w-3.5 text-[hsl(25,95%,53%)]" />
          <span className="text-sm font-bold text-[hsl(25,95%,40%)]">
            {streak}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-1 sm:gap-1.5">
        {days.map((day, i) => (
          <motion.div
            key={day}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 15,
              delay: 0.4 + i * 0.06,
            }}
            className="flex flex-col items-center gap-1 sm:gap-1.5 flex-1 min-w-0"
          >
            {completedDays[i] ? (
              <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary shadow-sm shadow-primary/20 flex-shrink-0">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" strokeWidth={3} />
              </div>
            ) : (
              <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-muted flex-shrink-0">
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
              </div>
            )}
            <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground truncate w-full text-center">
              {day}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
