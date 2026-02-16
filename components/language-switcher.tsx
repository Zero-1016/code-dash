"use client"

import { ChevronDown } from "lucide-react"
import type { AppLanguage } from "@/lib/app-language"
import { saveLanguagePreference } from "@/lib/local-progress"
import { useAppLanguage } from "@/lib/use-app-language"

interface LanguageSwitcherProps {
  id?: string
  className?: string
}

export function LanguageSwitcher({
  id = "app-language",
  className = "",
}: LanguageSwitcherProps) {
  const { language, copy } = useAppLanguage()

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {copy.header.language}
      </label>
      <select
        id={id}
        value={language}
        onChange={(event) =>
          saveLanguagePreference(event.target.value as AppLanguage)
        }
        className="inline-flex h-9 w-[108px] appearance-none items-center rounded-xl border border-input bg-background px-3 pr-9 text-sm font-semibold text-foreground outline-none transition-colors focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/20"
      >
        <option value="en">{copy.header.languageEnglish}</option>
        <option value="ko">{copy.header.languageKorean}</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}
