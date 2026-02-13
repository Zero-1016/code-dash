"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronDown, Code2, Flame, Settings } from "lucide-react"
import {
  getCurrentStreak,
  saveLanguagePreference,
  subscribeToProgressUpdates,
  type AppLanguage,
} from "@/lib/local-progress"
import { useAppLanguage } from "@/lib/use-app-language"

const headerActionBaseClass =
  "inline-flex h-9 items-center rounded-xl px-3 text-sm font-semibold transition-colors"

function HeaderActionLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`${headerActionBaseClass} gap-2 bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground`}
    >
      {children}
    </Link>
  )
}

function HeaderActionSelect({
  id,
  value,
  onChange,
  options,
}: {
  id: string
  value: AppLanguage
  onChange: (value: AppLanguage) => void
  options: Array<{ value: AppLanguage; label: string }>
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as AppLanguage)}
        className={`${headerActionBaseClass} w-[108px] appearance-none border border-input bg-background pr-9 text-foreground outline-none focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

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
          <label htmlFor="header-language" className="sr-only">
            {copy.header.language}
          </label>
          <HeaderActionSelect
            id="header-language"
            value={language}
            onChange={saveLanguagePreference}
            options={[
              { value: "en", label: copy.header.languageEnglish },
              { value: "ko", label: copy.header.languageKorean },
            ]}
          />
          <HeaderActionLink href="/settings">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.header.settings}</span>
          </HeaderActionLink>
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
