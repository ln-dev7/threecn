import { renderOgImage } from "@/lib/og"

/**
 * Dynamic Open Graph image endpoint.
 * Usage: /og?title=...&subtitle=...&eyebrow=...
 * Pages point their `openGraph.images` here via `ogImageUrl()` in lib/site.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? "3D scenes for shadcn/ui."
  const subtitle = searchParams.get("subtitle") ?? undefined
  const eyebrow = searchParams.get("eyebrow") ?? undefined
  return renderOgImage({ title, subtitle, eyebrow })
}
