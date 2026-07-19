import Link from "next/link"

import { Logo } from "@/components/shared/logo"

const GITHUB_URL = "https://github.com/ln-dev7/threecn"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground">
            Theme-aware React Three Fiber scenes, installable with the shadcn
            CLI.
          </p>
        </div>

        <div className="flex gap-16">
          <nav className="flex flex-col gap-2 text-sm">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Resources
            </span>
            <Link href="/docs" className="text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <Link
              href="/sponsors"
              className="text-muted-foreground hover:text-foreground"
            >
              Sponsors
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://x.com/ln_dev7"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Twitter / X
            </a>
          </nav>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="font-mono text-xs text-muted-foreground">
            Built with R3F, Drei, and shadcn/ui.
          </p>
        </div>
      </div>
    </footer>
  )
}
