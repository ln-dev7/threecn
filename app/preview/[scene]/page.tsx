import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { SCENES, getScene } from "@/lib/scenes"
import { SceneBySlug, type SceneSlug } from "@/components/threecn/scene-by-slug"

export function generateStaticParams() {
  return SCENES.map((s) => ({ scene: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ scene: string }>
}): Promise<Metadata> {
  const { scene } = await params
  const meta = getScene(scene)
  return { title: meta ? `${meta.name} preview` : "Preview" }
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ scene: string }>
}) {
  const { scene } = await params
  const meta = getScene(scene)
  if (!meta) notFound()

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <SceneBySlug slug={scene as SceneSlug} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-4 left-5">
        <p className="font-mono text-sm font-medium text-foreground">
          {meta.name}
        </p>
        <p className="font-mono text-xs text-muted-foreground">threecn</p>
      </div>
    </div>
  )
}
