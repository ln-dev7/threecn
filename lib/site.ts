/** Central site constants used across metadata, OG images, sitemap and JSON-LD. */
export const SITE = {
  url: "https://threecn.dev",
  name: "threecn",
  title: "3D scenes for shadcn/ui",
  tagline: "3D scenes for shadcn/ui. One command away.",
  description:
    "Copy-paste React Three Fiber scenes that auto-adapt to your shadcn theme. Dark mode included. Zero Three.js expertise required.",
  github: "https://github.com/ln-dev7/threecn",
  twitter: "https://x.com/ln_dev7",
  twitterHandle: "@ln_dev7",
} as const

/** Build a relative URL to the dynamic OG image endpoint. */
export function ogImageUrl(opts: {
  title: string
  subtitle?: string
  eyebrow?: string
}) {
  const params = new URLSearchParams({ title: opts.title })
  if (opts.subtitle) params.set("subtitle", opts.subtitle)
  if (opts.eyebrow) params.set("eyebrow", opts.eyebrow)
  return `/og?${params.toString()}`
}
