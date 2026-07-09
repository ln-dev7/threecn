"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconArrowsMaximize,
  IconArrowUpRight,
  IconBook2,
  IconChevronDown,
  IconSearch,
} from "@tabler/icons-react"

import { SCENES } from "@/lib/scenes"
import { SCENE_CATEGORIES, catalogFor } from "@/lib/scene-catalog"
import { SceneBySlug, type SceneSlug } from "@/components/threecn/scene-by-slug"
import { Input } from "@/components/ui/input"

const ALL = "All"

export function ScenesGallery() {
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string>(ALL)

  const scenes = React.useMemo(
    () => SCENES.filter((s) => catalogFor(s.slug)),
    []
  )

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return scenes.filter((s) => {
      const entry = catalogFor(s.slug)
      if (!entry) return false
      if (category !== ALL && entry.category !== category) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q)
      )
    })
  }, [scenes, query, category])

  return (
    <div>
      <p className="font-mono text-xs tracking-widest text-primary uppercase">
        Components
      </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Scenes
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Every ready-to-use 3D scene, in one place. Each is a single file
            plus the theme hook — install it with the shadcn CLI and its colors
            follow your design tokens.
          </p>

          {/* Controls */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scenes..."
                className="pl-9"
              />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="h-9 w-full appearance-none rounded-lg border border-border bg-input/30 pr-9 pl-3 text-sm outline-none transition-colors hover:bg-input/50 focus-visible:border-ring sm:w-[180px]"
              >
                <option value={ALL}>All components</option>
                {SCENE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <IconChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <p className="mt-14 text-center text-sm text-muted-foreground">
              No scenes match “{query}”.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {filtered.map((scene) => {
                const entry = catalogFor(scene.slug)
                return (
                  <div
                    key={scene.slug}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="relative h-40 border-b border-border bg-muted/30">
                      <SceneBySlug
                        slug={scene.slug as SceneSlug}
                        className="h-full w-full"
                      />
                      {entry?.isNew ? (
                        <span className="absolute top-2 left-2 rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-primary uppercase backdrop-blur">
                          New
                        </span>
                      ) : null}
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
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <Link
                        href={`/docs/scenes/${scene.slug}`}
                        className="group/title inline-flex items-center gap-1 font-mono text-sm font-semibold transition-colors hover:text-primary"
                      >
                        {scene.name}
                        <IconArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover/title:opacity-100" />
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {entry?.category}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
    </div>
  )
}
