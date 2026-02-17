"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ExternalProblemFeedback } from "@/components/external-problem-feedback"
import { withMentorAccessGuard } from "@/components/with-mentor-access-guard"
import { PageTransition } from "@/components/page-transition"
import { useAppLanguage } from "@/lib/use-app-language"
import { usePageEntryAnimation } from "@/lib/use-page-entry-animation"

function ExternalFeedbackPage() {
  const { copy } = useAppLanguage()
  const shouldAnimateOnMount = usePageEntryAnimation()

  return (
    <PageTransition animateOnMount={shouldAnimateOnMount}>
      <main className="mx-auto w-full max-w-[1400px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.externalFeedback.backHome}
          </Link>
        </div>
        <ExternalProblemFeedback />
      </main>
    </PageTransition>
  )
}

export default withMentorAccessGuard(ExternalFeedbackPage, {
  fallbackPath: "/",
})
