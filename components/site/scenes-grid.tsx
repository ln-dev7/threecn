"use client"

import Link from "next/link"
import { IconArrowUpRight } from "@tabler/icons-react"

import { SCENES, installCommand } from "@/lib/scenes"
import { SceneBySlug, type SceneSlug } from "@/components/threecn/scene-by-slug"
import { CodePreview } from "@/components/site/code-preview"

export function ScenesGrid() {
  return (
    <section id="scenes" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24">
      <div className="mb-12 max-w-2xl">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          Components
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready-to-use 3D scenes
        </h2>
        <p className="mt-3 text-muted-foreground">
          Each scene is a single file plus the theme hook. Install it with the
          shadcn CLI and drop it in — colors follow your design tokens.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SCENES.map((scene) => (
          <div
            key={scene.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="relative h-44 border-b border-border bg-muted/30">
              <SceneBySlug slug={scene.slug as SceneSlug} className="h-full w-full" />
              <Link
                href={`/preview/${scene.slug}`}
                target="_blank"
                className="absolute top-2 right-2 rounded-md bg-background/70 p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:text-foreground"
                aria-label="Open fullscreen preview"
              >
                <IconArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <h3 className="font-mono text-sm font-semibold">{scene.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {scene.description}
                </p>
              </div>
              <CodePreview
                command
                code={installCommand(scene.slug)}
                className="mt-auto text-xs"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
