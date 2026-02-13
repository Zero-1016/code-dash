"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { getProblemById } from "@/lib/problems"
import { ProblemPageClient } from "./problem-page-client"

export default function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const problem = getProblemById(id)

  if (!problem) {
    notFound()
  }

  return <ProblemPageClient problem={problem} />
}
