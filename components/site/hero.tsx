"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { CodePreview } from "@/components/site/code-preview"
import { installCommand } from "@/lib/scenes"

const ParticleField = dynamic(
  () =>
    import("@/components/threecn/particle-field").then((m) => m.ParticleField),
  { ssr: false }
)

const GITHUB_URL = "https://github.com/ln-dev7/threecn"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* live, theme-aware particle field */}
      <div className="absolute inset-0 -z-10">
        <ParticleField count={1800} speed={0.4} className="h-full w-full" />
      </div>
      {/* legibility mask */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/70 to-background" />

      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-28 pb-24 text-center sm:pt-36 sm:pb-32">
        <Link
          href="/docs"
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          Theme-aware R3F scenes · v1
        </Link>

        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          3D scenes for shadcn/ui.
          <br />
          <span className="text-primary">One command away.</span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          Copy-paste React Three Fiber scenes that auto-adapt to your shadcn
          theme. Dark mode included. Zero Three.js expertise required.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="rounded-lg"
            render={
              <Link href="/#scenes">
                Browse scenes
                <IconArrowRight className="size-4" />
              </Link>
            }
          />
          <Button
            size="lg"
            variant="outline"
            className="rounded-lg"
            render={
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                <IconBrandGithub className="size-4" />
                View on GitHub
              </a>
            }
          />
        </div>

        <CodePreview
          command
          code={installCommand("particle-field")}
          className="mt-10 w-full max-w-xl bg-background/60 backdrop-blur"
        />
      </div>
    </section>
  )
}
