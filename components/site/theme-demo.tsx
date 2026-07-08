"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { IconMoon, IconRefresh, IconSun } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useShadcnTheme } from "@/components/hooks/use-shadcn-theme"

const ProductShowcase = dynamic(
  () =>
    import("@/components/threecn/product-showcase").then(
      (m) => m.ProductShowcase
    ),
  { ssr: false }
)

const SWATCHES: { name: string; hsl: string; dot: string }[] = [
  { name: "Violet", hsl: "263 70% 55%", dot: "hsl(263 70% 55%)" },
  { name: "Blue", hsl: "217 91% 60%", dot: "hsl(217 91% 60%)" },
  { name: "Emerald", hsl: "160 84% 39%", dot: "hsl(160 84% 39%)" },
  { name: "Rose", hsl: "350 89% 60%", dot: "hsl(350 89% 60%)" },
  { name: "Amber", hsl: "38 92% 50%", dot: "hsl(38 92% 50%)" },
]

function ThemeReadout() {
  const { primaryColor, isDark } = useShadcnTheme()
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
      <span
        className="size-3 rounded-full border border-border"
        style={{ background: `#${primaryColor.getHexString()}` }}
      />
      <span>--primary → #{primaryColor.getHexString()}</span>
      <span className="text-border">|</span>
      <span>{isDark ? "dark" : "light"}</span>
    </div>
  )
}

export function ThemeDemo() {
  const { resolvedTheme, setTheme } = useTheme()
  const [active, setActive] = React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)

  // Detect the client mount to avoid a variant hydration mismatch with next-themes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), [])

  const applyColor = (hsl: string) => {
    document.documentElement.style.setProperty("--primary", hsl)
    setActive(hsl)
  }
  const reset = () => {
    document.documentElement.style.removeProperty("--primary")
    setActive(null)
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div className="mb-12 max-w-2xl">
        <p className="font-mono text-xs tracking-widest text-primary uppercase">
          The bridge
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your tokens, in WebGL
        </h2>
        <p className="mt-3 text-muted-foreground">
          Flip the theme or swap the accent. The scene re-reads your CSS
          variables through useShadcnTheme and recolors instantly — no props
          rewired.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-border lg:grid-cols-[1.4fr_1fr]">
        <div className="relative min-h-[340px] border-b border-border bg-muted/20 lg:border-r lg:border-b-0">
          <ProductShowcase className="h-full w-full" />
          <div className="absolute bottom-3 left-4">
            <ThemeReadout />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 p-6">
          <div>
            <p className="mb-2 text-sm font-medium">Mode</p>
            <div className="flex gap-2">
              <Button
                variant={
                  mounted && resolvedTheme === "light" ? "default" : "outline"
                }
                size="sm"
                className="rounded-lg"
                onClick={() => setTheme("light")}
              >
                <IconSun className="size-4" /> Light
              </Button>
              <Button
                variant={
                  mounted && resolvedTheme === "dark" ? "default" : "outline"
                }
                size="sm"
                className="rounded-lg"
                onClick={() => setTheme("dark")}
              >
                <IconMoon className="size-4" /> Dark
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Accent (--primary)</p>
            <div className="flex flex-wrap gap-2">
              {SWATCHES.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => applyColor(s.hsl)}
                  aria-label={s.name}
                  className={cn(
                    "size-8 rounded-full border-2 transition-transform hover:scale-110",
                    active === s.hsl ? "border-foreground" : "border-border"
                  )}
                  style={{ background: s.dot }}
                />
              ))}
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full"
                aria-label="Reset accent"
                onClick={reset}
              >
                <IconRefresh className="size-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Tip: press <kbd className="rounded bg-muted px-1 font-mono">d</kbd>{" "}
            anywhere to toggle dark mode.
          </p>
        </div>
      </div>
    </section>
  )
}
