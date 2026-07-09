"use client"

import Link from "next/link"
import {
  IconArrowsMaximize,
  IconArrowRight,
  IconArrowUpRight,
  IconBook2,
} from "@tabler/icons-react"

import { SCENES, registryRef } from "@/lib/scenes"
import { catalogFor } from "@/lib/scene-catalog"
import { SceneBySlug, type SceneSlug } from "@/components/threecn/scene-by-slug"
import { CodePreview } from "@/components/site/code-preview"
import { Button } from "@/components/ui/button"
import { commandFor, usePackageManager } from "@/lib/package-manager"

export function ScenesGrid() {
  const { manager } = usePackageManager()
  const featured = SCENES.filter((s) => catalogFor(s.slug)?.featured)
  const total = SCENES.filter((s) => catalogFor(s.slug)).length
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
          A few favorites below. Each scene is a single file plus the theme
          hook — install it with the shadcn CLI and its colors follow your
          design tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((scene) => (
          <div
            key={scene.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="relative h-44 border-b border-border bg-muted/30">
              <SceneBySlug
                slug={scene.slug as SceneSlug}
                className="h-full w-full"
              />
              <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <Link
                  href={`/docs/scenes/${scene.slug}`}
                  className="rounded-md bg-background/70 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
                  aria-label="Open documentation"
                >
                  <IconBook2 className="size-4" />
                </Link>
                <Link
                  href={`/preview/${scene.slug}`}
                  target="_blank"
                  className="rounded-md bg-background/70 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
                  aria-label="Open fullscreen preview"
                >
                  <IconArrowsMaximize className="size-4" />
                </Link>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <Link
                  href={`/docs/scenes/${scene.slug}`}
                  className="group/title inline-flex items-center gap-1 font-mono text-sm font-semibold transition-colors hover:text-primary"
                >
                  {scene.name}
                  <IconArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover/title:opacity-100" />
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">
                  {scene.description}
                </p>
              </div>
              <CodePreview
                command
                code={commandFor(manager, registryRef(scene.slug))}
                className="mt-auto text-xs"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Button
          size="lg"
          variant="outline"
          className="rounded-lg"
          nativeButton={false}
          render={
            <Link href="/docs/scenes">
              See all {total} scenes
              <IconArrowRight className="size-4" />
            </Link>
          }
        />
      </div>
    </section>
  )
}
