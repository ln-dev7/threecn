import { cn } from "@/lib/utils"

/**
 * Embeds a scene's fullscreen preview route in an isolated iframe — keeps the
 * docs page from spawning extra WebGL contexts in the same document.
 */
export function ScenePreview({
  slug,
  height = 360,
  className,
}: {
  slug: string
  height?: number
  className?: string
}) {
  return (
    <iframe
      src={`/preview/${slug}`}
      title={`${slug} preview`}
      loading="lazy"
      style={{ height }}
      className={cn(
        "my-6 w-full rounded-xl border border-border bg-muted/20",
        className
      )}
    />
  )
}
