"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"

export function ProblemLanguageSwitcher() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

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
