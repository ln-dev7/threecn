import Link from "next/link"
import { IconBrandGithub } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const GITHUB_URL = "https://github.com/ln-dev7/threecn"

const links = [
  { label: "Docs", href: "/docs" },
  { label: "Components", href: "/#scenes" },
  { label: "GitHub", href: GITHUB_URL, external: true },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button
            size="icon"
            variant="ghost"
            aria-label="GitHub"
            className="md:hidden"
            render={
              <a href={GITHUB_URL} target="_blank" rel="noreferrer">
                <IconBrandGithub className="size-[1.15rem]" />
              </a>
            }
          />
          <Button
            size="sm"
            className="rounded-lg"
            render={<Link href="/docs">Get started</Link>}
          />
        </div>
      </div>
    </header>
  )
}
