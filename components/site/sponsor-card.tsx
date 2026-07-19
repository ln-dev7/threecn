import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { ClaudeLogo } from "@/components/site/sponsors"

export { SPONSOR_EMAIL, SPONSOR_HREF } from "@/components/site/sponsors"

/**
 * Persistent sponsors card. Rendered in the docs right rail (TOC footer) on
 * every docs page, and in the scene gallery's sidebar.
 */
export function SponsorCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold tracking-tight">Sponsors</h3>
        <Link
          href="/sponsors"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Become a sponsor
          <IconArrowRight className="size-3.5" />
        </Link>
      </div>
      <p className="mt-4 font-mono text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
        Open Source Program
      </p>
      <a
        href="https://claude.com/?utm_source=threecn"
        target="_blank"
        rel="noopener sponsored"
        aria-label="Claude"
        className="mt-2 flex items-center justify-center rounded-xl border border-border/60 bg-muted/40 px-4 py-4 text-foreground transition-colors ease-out hover:bg-accent"
      >
        <ClaudeLogo className="h-8 w-full max-w-36 shrink-0" />
      </a>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Your logo in front of the community · Limited spots
      </p>
    </div>
  )
}
