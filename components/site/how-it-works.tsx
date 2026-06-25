import { CodePreview } from "@/components/site/code-preview"
import { installCommand } from "@/lib/scenes"

const steps = [
  {
    n: "01",
    title: "Install",
    body: "Add any scene with the shadcn CLI. The scene file and the useShadcnTheme hook land in your project.",
    code: installCommand("particle-field"),
    command: true,
    label: undefined as string | undefined,
  },
  {
    n: "02",
    title: "Use",
    body: "Render it like any component. Set the height on the wrapper and you're done.",
    code: `<ParticleField className="h-64 rounded-lg" />`,
    command: false,
    label: "app/page.tsx",
  },
  {
    n: "03",
    title: "Customize",
    body: "Scenes read your CSS variables. Change --primary and every scene follows — light or dark.",
    code: `:root {
  --primary: 263 70% 50%;
}

/* the scene re-colors itself automatically */
const { primaryColor, isDark } = useShadcnTheme()`,
    command: false,
    label: "globals.css + scene",
  },
]

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="mb-14 max-w-2xl">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps to themed 3D
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-primary">{step.n}</span>
                <span className="h-px flex-1 bg-border" />
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{step.body}</p>
              <CodePreview
                code={step.code}
                command={step.command}
                label={step.label}
                className="mt-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
