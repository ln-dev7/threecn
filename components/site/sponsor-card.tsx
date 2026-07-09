import { IconHeartHandshake } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export const SPONSOR_EMAIL = "leonelngoya@gmail.com"

export const SPONSOR_HREF = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent(
  "Sponsoring threecn"
)}&body=${encodeURIComponent(
  "Hi Leonel,\n\nI'd love to sponsor threecn. A few details:\n\n- Name / company:\n- Website:\n- Tier of interest:\n\nThanks!"
)}`

/**
 * Persistent "Become a sponsor" card. Rendered in the docs right rail (TOC
 * footer) on every docs page, and in the scene gallery's sidebar.
 */
export function SponsorCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5",
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-primary uppercase">
        <IconHeartHandshake className="size-3.5" />
        Sponsor
      </span>
      <h3 className="mt-3 text-base font-semibold tracking-tight">
        Become a sponsor
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        threecn is free and open source. Sponsor the project to keep new scenes
        shipping and get your logo in front of the community.
      </p>
      <a
        href={SPONSOR_HREF}
        className="mt-4 flex h-9 w-full items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Become a sponsor
      </a>
    </div>
  )
}
