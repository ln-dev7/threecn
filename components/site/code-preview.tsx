"use client"

import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export type CodePreviewProps = {
  code: string
  /** Optional label shown in the top bar (e.g. a filename or "Terminal"). */
  label?: string
  /** Render as a single-line command with a `$` prompt. */
  command?: boolean
  className?: string
}

/** A compact, copy-to-clipboard code block. */
export function CodePreview({
  code,
  label,
  command = false,
  className,
}: CodePreviewProps) {
  const [copied, setCopied] = React.useState(false)

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard unavailable; no-op
    }
  }, [code])

  return (
    <div
      className={cn(
        "group/code relative overflow-hidden rounded-xl border border-border bg-muted/40",
        className
      )}
    >
      {label ? (
        <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">
            {label}
          </span>
        </div>
      ) : null}
      <div className="flex items-center gap-3 px-4 py-3">
        {command ? (
          <span className="select-none font-mono text-sm text-primary">$</span>
        ) : null}
        <pre className="min-w-0 flex-1 overflow-x-auto">
          <code className="font-mono text-sm whitespace-pre text-foreground/90">
            {code}
          </code>
        </pre>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <IconCheck className="size-4 text-primary" />
          ) : (
            <IconCopy className="size-4" />
          )}
        </button>
      </div>
    </div>
  )
}
