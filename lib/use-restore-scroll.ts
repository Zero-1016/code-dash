"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"

interface StoredScrollState<T> {
  state: T
  scrollY: number
}

interface UseRestoreScrollOptions<T> {
  storageKey: string
  defaultState: T
  parseState?: (value: unknown) => T | null
}

function readStoredScrollState<T>({
  storageKey,
  parseState,
}: Pick<UseRestoreScrollOptions<T>, "storageKey" | "parseState">): StoredScrollState<T> | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const raw = window.sessionStorage.getItem(storageKey)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Partial<StoredScrollState<unknown>>
    const nextState = parseState ? parseState(parsed.state) : (parsed.state as T)
    if (!nextState) {
      return null
    }

    return {
      state: nextState,
      scrollY:
        typeof parsed.scrollY === "number" && Number.isFinite(parsed.scrollY)
          ? Math.max(0, parsed.scrollY)
          : 0,
    }
  } catch {
    return null
  }
}

export function useRestoreScroll<T>({
  storageKey,
  defaultState,
  parseState,
}: UseRestoreScrollOptions<T>) {
  const [initialStoredState] = useState<StoredScrollState<T> | null>(() =>
    readStoredScrollState({ storageKey, parseState })
  )
  const [state, setState] = useState<T>(() => initialStoredState?.state ?? defaultState)

  const persistState = useCallback(
    (nextState: T, scrollY: number) => {
      if (typeof window === "undefined") {
        return
      }
      const payload: StoredScrollState<T> = {
        state: nextState,
        scrollY: Math.max(0, scrollY),
      }
      window.sessionStorage.setItem(storageKey, JSON.stringify(payload))
    },
    [storageKey]
  )

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    persistState(state, window.scrollY)
  }, [persistState, state])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) {
        return
      }
      ticking = true
      window.requestAnimationFrame(() => {
        ticking = false
        persistState(state, window.scrollY)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [persistState, state])

  useLayoutEffect(() => {
    if (!initialStoredState || typeof window === "undefined") {
      return
    }

    // Restore after one animation frame so list layout/virtual rows are mounted.
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: initialStoredState.scrollY, behavior: "auto" })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [initialStoredState])

  return [state, setState] as const
}
