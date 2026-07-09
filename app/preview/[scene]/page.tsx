import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { SCENES, getScene } from "@/lib/scenes"
import { ogImageUrl } from "@/lib/site"
import { SceneBySlug, type SceneSlug } from "@/components/threecn/scene-by-slug"
import { PLAYGROUNDS } from "@/lib/playground"

export function generateStaticParams() {
  return SCENES.map((s) => ({ scene: s.slug }))
}

type SearchParams = Record<string, string | string[] | undefined>

/**
 * Rebuild the scene props from URL query params, coercing each value to the
 * type of its playground default so customizations survive into fullscreen.
 */
function propsFromSearch(
  scene: string,
  search: SearchParams
): Record<string, unknown> {
  const config = PLAYGROUNDS[scene as SceneSlug]
  if (!config) return {}
  const out: Record<string, unknown> = {}
  for (const [key, def] of Object.entries(config.defaults)) {
    const raw = search[key]
    if (raw === undefined) continue
    const value = Array.isArray(raw) ? raw[0] : raw
    if (typeof def === "number") {
      const n = Number(value)
      if (!Number.isNaN(n)) out[key] = n
    } else if (typeof def === "boolean") {
      out[key] = value === "true"
    } else {
      out[key] = value
    }
  }
  return out
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scene: string }>
}): Promise<Metadata> {
  const { scene } = await params
  const meta = getScene(scene)
  if (!meta) return { title: "Preview" }
  const og = ogImageUrl({
    eyebrow: "Scene",
    title: meta.name,
    subtitle: meta.description,
  })
  return {
    title: `${meta.name} preview`,
    description: meta.description,
    alternates: { canonical: `/preview/${meta.slug}` },
    openGraph: {
      title: `${meta.name} — threecn`,
      description: meta.description,
      images: [{ url: og, width: 1200, height: 630, alt: meta.name }],
    },
    twitter: { card: "summary_large_image", images: [og] },
  }
}

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ scene: string }>
  searchParams: Promise<SearchParams>
}) {
  const { scene } = await params
  const meta = getScene(scene)
  if (!meta) notFound()

  const sceneProps = propsFromSearch(scene, await searchParams)

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <SceneBySlug
        slug={scene as SceneSlug}
        className="h-full w-full"
        props={sceneProps}
      />
      <div className="pointer-events-none absolute bottom-4 left-5">
        <p className="font-mono text-sm font-medium text-foreground">
          {meta.name}
        </p>
        <p className="font-mono text-xs text-muted-foreground">threecn</p>
      </div>
    </div>
  )
}
