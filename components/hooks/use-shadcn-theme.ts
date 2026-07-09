"use client"

import * as React from "react"
import { Color } from "three"

/**
 * The set of theme-derived colors exposed to R3F scenes.
 * Every value is a live `THREE.Color`, ready to assign to a material.
 */
export type ShadcnThemeColors = {
  primaryColor: Color
  primaryForegroundColor: Color
  bgColor: Color
  foregroundColor: Color
  borderColor: Color
  mutedColor: Color
  accentColor: Color
  isDark: boolean
}

/** CSS custom properties read from `:root` / `.dark`. */
const CSS_VARS = {
  primaryColor: "--primary",
  primaryForegroundColor: "--primary-foreground",
  bgColor: "--background",
  foregroundColor: "--foreground",
  borderColor: "--border",
  mutedColor: "--muted-foreground",
  accentColor: "--accent",
} as const

/**
 * Neutral SSR defaults (a dark-ish indigo palette) used before the DOM is
 * available, so the first paint is never a flash of pure black.
 */
function createDefaults(): ShadcnThemeColors {
  return {
    primaryColor: new Color().setHSL(263 / 360, 0.7, 0.6),
    primaryForegroundColor: new Color().setHSL(0, 0, 0.98),
    bgColor: new Color().setHSL(240 / 360, 0.1, 0.039),
    foregroundColor: new Color().setHSL(0, 0, 0.98),
    borderColor: new Color().setHSL(240 / 360, 0.037, 0.159),
    mutedColor: new Color().setHSL(240 / 360, 0.05, 0.649),
    accentColor: new Color().setHSL(240 / 360, 0.037, 0.159),
    isDark: true,
  }
}

/** Matches a bare shadcn HSL triplet, e.g. "263 70% 50%" (optional "/ alpha"). */
const HSL_TRIPLET = /^-?[\d.]+\s+-?[\d.]+%\s+-?[\d.]+%(\s*\/\s*[\d.]+%?)?$/

/**
 * A lazily-created 1x1 canvas 2D context used to normalise arbitrary CSS
 * colors. The browser's own color parser resolves ANY format the CSS spec
 * supports — including `oklch()` (Tailwind v4 / recent shadcn), `color()`,
 * `hsl()`, `rgb()`, hex and named colors — and serialises the result back as
 * `#rrggbb` / `rgba(...)`, which `THREE.Color.setStyle` understands.
 */
let probeCtx: CanvasRenderingContext2D | null | undefined
function getProbeCtx(): CanvasRenderingContext2D | null {
  if (probeCtx !== undefined) return probeCtx
  if (typeof document === "undefined") return (probeCtx = null)
  probeCtx = document.createElement("canvas").getContext("2d")
  return probeCtx
}

/**
 * Normalise any CSS color string to a form THREE can parse (or `null` if the
 * browser rejects it). Assigning an invalid color to `fillStyle` is a no-op, so
 * we probe with two different sentinels: if the result differs, the input was
 * valid and both reflect its normalised value; if it "sticks" to a sentinel,
 * the input was invalid.
 */
function normalizeColor(input: string): string | null {
  const ctx = getProbeCtx()
  if (!ctx) return null
  ctx.fillStyle = "#000"
  ctx.fillStyle = input
  const a = ctx.fillStyle
  ctx.fillStyle = "#fff"
  ctx.fillStyle = input
  const b = ctx.fillStyle
  return a === b ? a : null
}

/**
 * Parse a raw CSS color (as read from a custom property) into a `THREE.Color`.
 *
 * shadcn ships colors as bare HSL triplets ("263 70% 50%"), which we wrap in
 * `hsl(...)`. Everything else — `oklch()`, `rgb()`, `#hex`, `hsl()`, named — is
 * handed to the browser's parser via a canvas probe, so modern oklch-based
 * themes resolve correctly instead of silently falling back to the default.
 */
function parseColor(raw: string, target: Color): Color {
  const value = raw.trim()
  if (!value) return target

  const candidate = HSL_TRIPLET.test(value) ? `hsl(${value})` : value

  // Preferred path: let the browser resolve any CSS color format.
  const normalized = normalizeColor(candidate)
  if (normalized) {
    try {
      return target.setStyle(normalized)
    } catch {
      /* fall through to the manual paths below */
    }
  }

  // Fallbacks for environments without a canvas (e.g. exotic SSR shims).
  const triplet = value.match(/^(-?[\d.]+)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/)
  if (triplet) {
    const h = parseFloat(triplet[1]) / 360
    const s = parseFloat(triplet[2]) / 100
    const l = parseFloat(triplet[3]) / 100
    return target.setHSL(h, s, l)
  }
  try {
    return target.setStyle(value)
  } catch {
    return target
  }
}

function readColors(previous?: ShadcnThemeColors): ShadcnThemeColors {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return previous ?? createDefaults()
  }

  const root = document.documentElement
  const styles = getComputedStyle(root)
  const base = previous ?? createDefaults()

  const next: ShadcnThemeColors = {
    ...base,
    primaryColor: parseColor(
      styles.getPropertyValue(CSS_VARS.primaryColor),
      base.primaryColor.clone()
    ),
    primaryForegroundColor: parseColor(
      styles.getPropertyValue(CSS_VARS.primaryForegroundColor),
      base.primaryForegroundColor.clone()
    ),
    bgColor: parseColor(
      styles.getPropertyValue(CSS_VARS.bgColor),
      base.bgColor.clone()
    ),
    foregroundColor: parseColor(
      styles.getPropertyValue(CSS_VARS.foregroundColor),
      base.foregroundColor.clone()
    ),
    borderColor: parseColor(
      styles.getPropertyValue(CSS_VARS.borderColor),
      base.borderColor.clone()
    ),
    mutedColor: parseColor(
      styles.getPropertyValue(CSS_VARS.mutedColor),
      base.mutedColor.clone()
    ),
    accentColor: parseColor(
      styles.getPropertyValue(CSS_VARS.accentColor),
      base.accentColor.clone()
    ),
    isDark: root.classList.contains("dark"),
  }

  return next
}

export type ThemeMode = "auto" | "light" | "dark"

/**
 * Bridges your shadcn/ui CSS variables into Three.js.
 *
 * - Reads `--primary`, `--background`, `--border`, ... on mount.
 * - Watches `<html class>` with a MutationObserver and re-reads on dark-mode
 *   toggles (works with next-themes, which flips the `.dark` class).
 * - SSR-safe: returns neutral defaults until the DOM is ready.
 *
 * @param mode `"auto"` (default) tracks the document theme. `"light"` / `"dark"`
 *   force a palette by temporarily toggling a detached probe element.
 */
export function useShadcnTheme(mode: ThemeMode = "auto"): ShadcnThemeColors {
  const [colors, setColors] = React.useState<ShadcnThemeColors>(() =>
    createDefaults()
  )

  React.useEffect(() => {
    if (typeof window === "undefined") return

    // These reads pull the live values out of an external system (the DOM's
    // computed CSS variables), which is a legitimate effect → state sync.
    if (mode !== "auto") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setColors((prev) => readForcedMode(mode, prev))
      return
    }

    // Initial read once mounted (handles hydration + system theme).
    setColors((prev) => readColors(prev))

    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setColors((prev) => readColors(prev))
    })
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    })

    return () => observer.disconnect()
  }, [mode])

  return colors
}

/**
 * Read the palette as it would appear under a forced light/dark mode.
 * We synchronously toggle the `.dark` class on `<html>`, read the computed
 * variables, then restore the original class in the same synchronous block.
 * getComputedStyle forces a style flush, so the values are accurate and the
 * browser never paints the intermediate state (no flicker).
 */
function readForcedMode(
  mode: "light" | "dark",
  previous: ShadcnThemeColors
): ShadcnThemeColors {
  if (typeof document === "undefined") return previous

  const root = document.documentElement
  const wasDark = root.classList.contains("dark")
  const wantDark = mode === "dark"

  if (wantDark !== wasDark) root.classList.toggle("dark", wantDark)
  const result = readColors(previous)
  if (wantDark !== wasDark) root.classList.toggle("dark", wasDark)

  return result
}
