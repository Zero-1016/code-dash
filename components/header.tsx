"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Code2, Flame, Settings } from "lucide-react"
import {
  getCurrentStreak,
  saveLanguagePreference,
  subscribeToProgressUpdates,
  type AppLanguage,
} from "@/lib/local-progress"
import { useAppLanguage } from "@/lib/use-app-language"

export function Header() {
  const [streak, setStreak] = useState(0)
  const { language, copy } = useAppLanguage()

  useEffect(() => {
    const sync = () => setStreak(getCurrentStreak())
    sync()
    return subscribeToProgressUpdates(sync)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            CodeDash
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <label
            htmlFor="header-language"
            className="sr-only"
          >
            {copy.header.language}
          </label>
          <select
            id="header-language"
            value={language}
            onChange={(event) =>
              saveLanguagePreference(event.target.value as AppLanguage)
            }
            className="h-9 rounded-xl border border-input bg-background px-2 text-xs font-medium text-foreground outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20 sm:px-3 sm:text-sm"
          >
            <option value="en">{copy.header.languageEnglish}</option>
            <option value="ko">{copy.header.languageKorean}</option>
          </select>
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-xl bg-muted px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.header.settings}</span>
          </Link>
          <div className="flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5">
            <Flame className="h-4 w-4 text-warning" />
            <span className="text-sm font-semibold text-accent-foreground">
              {streak}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
