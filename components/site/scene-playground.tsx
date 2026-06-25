"use client"

import * as React from "react"
import {
  IconCheck,
  IconCode,
  IconCopy,
  IconEye,
  IconRefresh,
  IconReload,
  IconSparkles,
} from "@tabler/icons-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PropTable } from "@/components/site/prop-table"
import { CliTabs } from "@/components/site/cli-tabs"
import { SceneBySlug, type SceneSlug } from "@/components/threecn/scene-by-slug"
import { PLAYGROUNDS, type Control } from "@/lib/playground"
import { getScene, REGISTRY_BASE } from "@/lib/scenes"

/* ── code generation ─────────────────────────────────────────────────────── */

function formatValue(value: unknown): string | null {
  if (typeof value === "boolean") return value ? "" : "{false}"
  if (typeof value === "number") return `{${value}}`
  if (typeof value === "string") return `"${value}"`
  return null
}

function generateUsage(
  componentName: string,
  props: Record<string, unknown>,
  controls: Control[]
) {
  const lines: string[] = []
  for (const control of controls) {
    const raw = props[control.prop]
    const formatted = formatValue(raw)
    if (formatted === null) continue
    lines.push(formatted === "" ? control.prop : `${control.prop}=${formatted}`)
  }
  lines.push(`className="h-80 w-full"`)
  return `<${componentName}\n  ${lines.join("\n  ")}\n/>`
}

function buildPrompt(
  componentName: string,
  slug: string,
  usage: string,
  propData: { name: string; type: string; default: string; description: string }[],
  deps: string[]
) {
  return `## Integrate the <${componentName} /> scene from threecn

You are integrating a theme-aware React Three Fiber scene into an existing
shadcn/ui + Next.js project.

### Install
\`\`\`bash
npx shadcn@latest add ${REGISTRY_BASE}/${slug}.json
\`\`\`

### Dependencies
${deps.join(", ")}

### Usage
\`\`\`tsx
${usage}
\`\`\`

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
${propData.map((p) => `| ${p.name} | ${p.type} | ${p.default || "—"} | ${p.description} |`).join("\n")}

### Notes
- The scene colors itself from your shadcn CSS variables via the bundled
  \`useShadcnTheme\` hook, so it follows light/dark mode automatically.
- Set the height on the wrapper through \`className\`.`
}

/* ── controls ────────────────────────────────────────────────────────────── */

function ControlField({
  control,
  value,
  onChange,
}: {
  control: Control
  value: unknown
  onChange: (next: unknown) => void
}) {
  if (control.kind === "slider") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{control.label}</span>
          <span className="font-mono text-foreground">
            {String(value)}
            {control.unit ?? ""}
          </span>
        </span>
        <input
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="accent-primary"
        />
      </label>
    )
  }

  if (control.kind === "select") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">{control.label}</span>
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 rounded-lg border border-border bg-background px-2 text-sm outline-none focus-visible:border-ring"
        >
          {control.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    )
  }

  if (control.kind === "switch") {
    return (
      <label className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{control.label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={cn(
            "relative h-5 w-9 rounded-full transition-colors",
            value ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-4 rounded-full bg-background transition-transform",
              value ? "translate-x-4" : "translate-x-0.5"
            )}
          />
        </button>
      </label>
    )
  }

  if (control.kind === "color") {
    return (
      <label className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{control.label}</span>
        <input
          type="color"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-12 cursor-pointer rounded border border-border bg-transparent"
        />
      </label>
    )
  }

  // text
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{control.label}</span>
      <input
        type="text"
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg border border-border bg-background px-2 text-sm outline-none focus-visible:border-ring"
      />
    </label>
  )
}

/* ── playground ──────────────────────────────────────────────────────────── */

export function ScenePlayground({ slug }: { slug: string }) {
  const sceneSlug = slug as SceneSlug
  const config = PLAYGROUNDS[sceneSlug]
  const meta = getScene(slug)

  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const [props, setProps] = React.useState<Record<string, unknown>>(
    () => ({ ...config.defaults })
  )
  const [replayKey, setReplayKey] = React.useState(0)
  const [copiedPrompt, setCopiedPrompt] = React.useState(false)
  const [copiedCode, setCopiedCode] = React.useState(false)

  if (!config || !meta) return null

  const hasChanges = Object.keys(config.defaults).some(
    (k) => props[k] !== config.defaults[k]
  )
  const usage = generateUsage(meta.componentName, props, config.controls)
  const url = `${REGISTRY_BASE}/${slug}.json`

  const setProp = (key: string, value: unknown) =>
    setProps((p) => ({ ...p, [key]: value }))
  const reset = () => {
    setProps({ ...config.defaults })
    setReplayKey((k) => k + 1)
  }

  const copyPrompt = async () => {
    const prompt = buildPrompt(meta.componentName, slug, usage, meta.props, config.dependencies)
    await navigator.clipboard.writeText(prompt).catch(() => {})
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 1800)
  }
  const copyCode = async () => {
    await navigator.clipboard.writeText(usage).catch(() => {})
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 1600)
  }

  const tabBtn = (key: "preview" | "code", label: string, Icon: typeof IconEye) => (
    <button
      type="button"
      onClick={() => setTab(key)}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors",
        tab === key
          ? "border-border bg-muted text-primary"
          : "border-border/60 text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-4" /> {label}
    </button>
  )

  return (
    <div className="my-6 not-prose">
      {/* toolbar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {tabBtn("preview", "Preview", IconEye)}
          {tabBtn("code", "Code", IconCode)}
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button variant="ghost" size="sm" className="rounded-lg" onClick={reset}>
              <IconRefresh className="size-4" /> Reset
            </Button>
          )}
          <Button variant="outline" size="sm" className="rounded-lg" onClick={copyPrompt}>
            {copiedPrompt ? (
              <IconCheck className="size-4 text-primary" />
            ) : (
              <IconSparkles className="size-4" />
            )}
            {copiedPrompt ? "Copied!" : "Copy AI prompt"}
          </Button>
        </div>
      </div>

      {tab === "preview" ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="relative h-[360px] overflow-hidden rounded-xl border border-border bg-muted/20">
            <button
              type="button"
              onClick={() => setReplayKey((k) => k + 1)}
              aria-label="Replay"
              className="absolute top-2 right-2 z-10 rounded-md bg-background/70 p-1.5 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
            >
              <IconReload className="size-4" />
            </button>
            <SceneBySlug
              key={replayKey}
              slug={sceneSlug}
              className="h-full w-full"
              props={props}
            />
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-border p-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground">
              Customize
            </p>
            {config.controls.map((c) => (
              <ControlField
                key={c.prop}
                control={c}
                value={props[c.prop]}
                onChange={(v) => setProp(c.prop, v)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <CliTabs url={url} />
          <div className="overflow-hidden rounded-xl border border-border bg-muted/40">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
              <span className="font-mono text-xs text-muted-foreground">Usage</span>
              <button
                type="button"
                onClick={copyCode}
                aria-label="Copy usage"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                {copiedCode ? (
                  <IconCheck className="size-4 text-primary" />
                ) : (
                  <IconCopy className="size-4" />
                )}
              </button>
            </div>
            <pre className="overflow-x-auto p-4">
              <code className="font-mono text-sm whitespace-pre text-foreground/90">
                {usage}
              </code>
            </pre>
          </div>
          <p className="text-xs text-muted-foreground">
            Dependencies: {config.dependencies.join(", ")}
          </p>
        </div>
      )}

      <PropTable data={meta.props} />
    </div>
  )
}
