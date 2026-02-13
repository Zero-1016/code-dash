"use client"

import { useEffect, useState } from "react"
import { Clock, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ChallengeTimerProps {
  timeLimit: number // in seconds
  onTimeUpdate?: (elapsedSeconds: number) => void
  onTimeUp?: () => void
}

function RollingDigit({ value, isUrgent }: { value: string; isUrgent: boolean }) {
  return (
    <div className="relative inline-block h-5 w-3 overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`absolute inset-0 flex items-center justify-center font-mono font-bold text-sm tabular-nums ${
            isUrgent ? "text-red-500" : "text-foreground"
          }`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

export function ChallengeTimer({ timeLimit, onTimeUpdate, onTimeUp }: ChallengeTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isTimeUp, setIsTimeUp] = useState(false)

  useEffect(() => {
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setElapsedSeconds(elapsed)

      if (onTimeUpdate) {
        onTimeUpdate(elapsed)
      }

      if (elapsed >= timeLimit && !isTimeUp) {
        setIsTimeUp(true)
        if (onTimeUp) {
          onTimeUp()
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLimit, onTimeUpdate, onTimeUp, isTimeUp])

  const remainingSeconds = Math.max(0, timeLimit - elapsedSeconds)
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  const progress = (elapsedSeconds / timeLimit) * 100
  const isWarning = remainingSeconds <= 600 && remainingSeconds > 300 // 10-5 minutes
  const isCritical = remainingSeconds <= 300 && remainingSeconds > 0 // Last 5 minutes
  const isUrgent = isWarning || isCritical || isTimeUp

  const minutesStr = String(minutes).padStart(2, "0")
  const secondsStr = String(seconds).padStart(2, "0")

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <motion.div
          animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: isCritical ? Infinity : 0 }}
        >
          <Clock
            className={`h-4 w-4 ${
              isTimeUp
                ? "text-red-600"
                : isCritical
                ? "text-red-500"
                : isWarning
                ? "text-orange-500"
                : "text-muted-foreground"
            }`}
          />
        </motion.div>

        {/* Rolling Number Display */}
        <div className="flex items-center gap-0.5 rounded-[16px] bg-[#F2F4F6] px-3 py-1.5">
          <RollingDigit value={minutesStr[0]} isUrgent={isUrgent} />
          <RollingDigit value={minutesStr[1]} isUrgent={isUrgent} />
          <span className={`mx-0.5 font-mono font-bold text-sm ${isUrgent ? "text-red-500" : "text-foreground"}`}>
            :
          </span>
          <RollingDigit value={secondsStr[0]} isUrgent={isUrgent} />
          <RollingDigit value={secondsStr[1]} isUrgent={isUrgent} />
        </div>

        <AnimatePresence>
          {(isWarning || isCritical || isTimeUp) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <AlertCircle
                className={`h-3.5 w-3.5 ${
                  isTimeUp
                    ? "text-red-600"
                    : isCritical
                    ? "text-red-500"
                    : "text-orange-500"
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${
            isTimeUp
              ? "bg-red-600"
              : isCritical
              ? "bg-red-500"
              : isWarning
              ? "bg-orange-500"
              : "bg-[#3182F6]"
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
