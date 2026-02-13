"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Plus } from "lucide-react"

interface CustomTestCase {
  input: string
  expected: string
}

interface AddTestCaseModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (testCase: CustomTestCase) => void
}

export function AddTestCaseModal({ isOpen, onClose, onAdd }: AddTestCaseModalProps) {
  const [input, setInput] = useState("")
  const [expected, setExpected] = useState("")
  const inputId = useId()
  const expectedId = useId()
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const resetForm = useCallback(() => {
    setInput("")
    setExpected("")
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    inputRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [handleClose, isOpen])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmedInput = input.trim()
      const trimmedExpected = expected.trim()

      if (!trimmedInput || !trimmedExpected) {
        return
      }

      onAdd({ input: trimmedInput, expected: trimmedExpected })
      handleClose()
    },
    [expected, handleClose, input, onAdd]
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-custom-test-case-title"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <h2 id="add-custom-test-case-title" className="text-lg font-bold text-foreground">
                Add Custom Test Case
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close add test case modal"
                className="flex h-8 w-8 items-center justify-center rounded-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-foreground">
                    Input
                  </label>
                  <textarea
                    id={inputId}
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='e.g., [2, 7, 11, 15], 9'
                    rows={3}
                    className="w-full resize-none rounded-[16px] border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#3182F6] focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Enter input as comma-separated values (e.g., array, number)
                  </p>
                </div>

                <div>
                  <label htmlFor={expectedId} className="mb-2 block text-sm font-semibold text-foreground">
                    Expected Output
                  </label>
                  <textarea
                    id={expectedId}
                    value={expected}
                    onChange={(e) => setExpected(e.target.value)}
                    placeholder='e.g., [0, 1]'
                    rows={2}
                    className="w-full resize-none rounded-[16px] border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#3182F6] focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Enter the expected result
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 rounded-[20px] border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || !expected.trim()}
                  className="flex-1 rounded-[20px] bg-[#3182F6] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#2870d8] disabled:opacity-50 disabled:hover:bg-[#3182F6]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Test Case
                  </div>
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
