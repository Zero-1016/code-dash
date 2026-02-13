import type { MetadataRoute } from "next"
import { problems } from "@/lib/problems"
import { getSiteUrl } from "@/lib/site-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().toString().replace(/\/$/, "")

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/settings`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]

  const problemRoutes: MetadataRoute.Sitemap = problems.map((problem) => ({
    url: `${base}/problem/${problem.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...problemRoutes]
}

