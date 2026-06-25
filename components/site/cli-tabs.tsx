"use client"

import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

const MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const
type Manager = (typeof MANAGERS)[number]

/** Build the shadcn `add` command for a given package manager. */
function commandFor(manager: Manager, url: string) {
  switch (manager) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${url}`
    case "yarn":
      return `yarn dlx shadcn@latest add ${url}`
    case "bun":
      return `bunx shadcn@latest add ${url}`
    case "npm":
    default:
      return `npx shadcn@latest add ${url}`
  }
}

/**
 * Package-manager tabbed install block for a registry URL.
 * Inspired by the React Bits CLI installation panel.
 */
export function CliTabs({ url, className }: { url: string; className?: string }) {
  const [manager, setManager] = React.useState<Manager>("pnpm")
  const [copied, setCopied] = React.useState(false)
  const command = commandFor(manager, url)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-muted/40",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/70 pr-2">
        <div className="flex">
          {MANAGERS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setManager(m)}
              className={cn(
                "border-b-2 px-3.5 py-2 font-mono text-xs transition-colors",
                manager === m
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy command"
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <IconCheck className="size-4 text-primary" />
          ) : (
            <IconCopy className="size-4" />
          )}
        </button>
      </div>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="select-none font-mono text-sm text-primary">$</span>
        <pre className="min-w-0 flex-1 overflow-x-auto">
          <code className="font-mono text-sm whitespace-pre text-foreground/90">
            {command}
          </code>
        </pre>
      </div>
    </div>
  )
}
