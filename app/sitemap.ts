import type { MetadataRoute } from "next"

import { source } from "@/lib/source"
import { SCENES } from "@/lib/scenes"
import { SITE } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const docPaths = source.getPages().map((p) => p.url)
  const previewPaths = SCENES.map((s) => `/preview/${s.slug}`)
  const paths = Array.from(new Set(["", ...docPaths, ...previewPaths]))

  const priorityFor = (path: string) => {
    if (path === "") return 1
    if (path === "/docs") return 0.9
    if (path.startsWith("/docs")) return 0.8
    return 0.6
  }

  return paths.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: priorityFor(path),
  }))
}
