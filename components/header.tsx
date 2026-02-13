"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Code2, Settings } from "lucide-react"
import { useAppLanguage } from "@/lib/use-app-language"
import { LanguageSwitcher } from "@/components/language-switcher"

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

export function Header() {
  const { copy } = useAppLanguage()

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
          <LanguageSwitcher id="header-language" />
          <HeaderActionLink href="/settings">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.header.settings}</span>
          </HeaderActionLink>
        </div>
      </div>
    </header>
  )
}
