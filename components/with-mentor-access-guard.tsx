"use client"

import { useEffect, useState, type ComponentType } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getApiSettings, subscribeToProgressUpdates } from "@/lib/local-progress"
import { isMentorConfigured } from "@/lib/mentor-access"
import { useAppLanguage } from "@/lib/use-app-language"

interface MentorAccessGuardOptions {
  fallbackPath?: string
}

export function withMentorAccessGuard<P extends object>(
  WrappedComponent: ComponentType<P>,
  options?: MentorAccessGuardOptions
) {
  const fallbackPath = options?.fallbackPath ?? "/"

  const GuardedComponent = (props: P) => {
    const router = useRouter()
    const { copy } = useAppLanguage()
    const [ready, setReady] = useState(false)
    const [allowed, setAllowed] = useState(false)

    useEffect(() => {
      const sync = () => {
        setAllowed(isMentorConfigured(getApiSettings()))
        setReady(true)
      }

      sync()
      return subscribeToProgressUpdates(sync)
    }, [])

    if (ready && allowed) {
      return <WrappedComponent {...props} />
    }

    return (
      <AlertDialog
        open={ready && !allowed}
        onOpenChange={(open) => {
          if (!open) {
            router.push(fallbackPath)
          }
        }}
      >
        <AlertDialogContent overlayClassName="bg-black/45">
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.problem.mentorSetupTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {copy.problem.mentorSetupDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => router.push(fallbackPath)}>
              {copy.problem.mentorSetupCancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/settings")}>
              {copy.problem.mentorSetupGoToSettings}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  GuardedComponent.displayName = `withMentorAccessGuard(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`

  return GuardedComponent
}
