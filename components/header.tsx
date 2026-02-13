"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Code2, Flame } from "lucide-react"

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            CodeDash
          </span>
        </Link>

        <div className="flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5">
          <Flame className="h-4 w-4 text-warning" />
          <span className="text-sm font-semibold text-accent-foreground">
            7
          </span>
        </div>
      </div>
    </motion.header>
  )
}
