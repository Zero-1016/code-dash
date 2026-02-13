"use client"

import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"

export function ProblemLanguageSwitcher() {
  const pathname = usePathname()
  const isProblemPage = pathname.startsWith("/problem/")

  if (!isProblemPage) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-background/90 p-1.5 shadow-lg backdrop-blur-sm">
      <LanguageSwitcher id="problem-floating-language" />
    </div>
  )
}
