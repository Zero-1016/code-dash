import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProblemById } from "@/lib/problems"
import { ProblemPageClient } from "./problem-page-client"

function buildProblemDescription(rawDescription: string): string {
  const firstParagraph = rawDescription.split("\n\n")[0] ?? rawDescription
  return firstParagraph.replace(/`/g, "").trim()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const problem = getProblemById(id)

  if (!problem) {
    return {
      title: "Problem Not Found",
      description: "The requested coding problem could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const description = buildProblemDescription(problem.description)
  const difficulty = problem.difficulty
  const category = problem.category
  const title = `${problem.title} (${difficulty})`
  const ogDescription = `${description} Solve this ${difficulty.toLowerCase()} ${category.toLowerCase()} challenge on CodeDash.`

  return {
    title,
    description,
    alternates: {
      canonical: `/problem/${problem.id}`,
    },
    openGraph: {
      type: "article",
      title,
      description: ogDescription,
      url: `/problem/${problem.id}`,
      siteName: "CodeDash",
      images: [
        {
          url: "/placeholder-logo.png",
          width: 1200,
          height: 630,
          alt: `${problem.title} problem on CodeDash`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ogDescription,
      images: ["/placeholder-logo.png"],
    },
  }
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const problem = getProblemById(id)

  if (!problem) {
    notFound()
  }

  return <ProblemPageClient problem={problem} />
}
