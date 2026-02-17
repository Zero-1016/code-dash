"use client"

import { ExternalProblemFeedback } from "@/components/external-problem-feedback"
import { withMentorAccessGuard } from "@/components/with-mentor-access-guard"
import { PageTransition } from "@/components/page-transition"
import { usePageEntryAnimation } from "@/lib/use-page-entry-animation"

function ExternalFeedbackPage() {
  const shouldAnimateOnMount = usePageEntryAnimation()

  return (
    <PageTransition animateOnMount={shouldAnimateOnMount}>
      <ExternalProblemFeedback />
    </PageTransition>
  )
}

export default withMentorAccessGuard(ExternalFeedbackPage, {
  fallbackPath: "/",
})
