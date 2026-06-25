import type { SceneProp } from "@/lib/scenes"

/**
 * Props reference rendered as a table on desktop and as cards on mobile.
 * Adapted from the React Bits PropTable.
 */
export function PropTable({ data }: { data: SceneProp[] }) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-foreground">
        Props
      </h3>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-xl border border-border sm:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {["Prop", "Type", "Default", "Description"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr
                key={p.name}
                className="border-b border-border/60 last:border-0 hover:bg-muted/20"
              >
                <td className="px-4 py-3 align-top">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">
                    {p.name}
                  </code>
                </td>
                <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                  {p.type}
                </td>
                <td className="px-4 py-3 align-top">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground/80">
                    {p.default?.length ? p.default : "—"}
                  </code>
                </td>
                <td className="px-4 py-3 align-top text-sm text-muted-foreground">
                  {p.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        {data.map((p) => (
          <div key={p.name} className="rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-2">
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">
                {p.name}
              </code>
              <span className="font-mono text-xs text-muted-foreground">
                {p.type}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Default</span>
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground/80">
                {p.default?.length ? p.default : "—"}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
