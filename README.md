# threecn

**3D scenes for shadcn/ui. One command away.**

threecn is a shadcn-style registry of ready-to-use React Three Fiber (R3F) +
drei scenes. Each scene is theme-aware via a `useShadcnTheme()` hook that bridges
your CSS variables into Three.js materials — so dark mode (and any token change)
just works. Published in the shadcn registry under the `@threecn` namespace, so
you install any scene by name.

```bash
npx shadcn@latest add @threecn/particle-field
```

```tsx
import { ParticleField } from "@/components/threecn/particle-field"

export default function Page() {
  return <ParticleField className="h-64 rounded-lg" />
}
```

## Scenes

- **SceneContainer** — themed canvas wrapper (camera, lighting rig, fog).
- **ParticleField** — drifting, theme-colored particle cloud.
- **ProductViewer** — orbitable polished product volume.
- **FloatingCard3D** — parallax-tilting card with HTML overlay.
- **Text3D** — extruded, floating 3D text.
- **ProductShowcase** — product on a pedestal with soft contact shadows.

## The CSS → WebGL bridge

`useShadcnTheme()` reads `--primary`, `--background`, `--border`, … from
`document.documentElement`, parses the HSL values into `THREE.Color` instances,
and watches the `.dark` class with a `MutationObserver`. Toggle the theme or
change a token at runtime and every mounted scene recolors on the next frame.

## Development

```bash
pnpm install
pnpm dev          # start the site + docs
pnpm build        # production build
pnpm exec shadcn build   # regenerate public/r/*.json from registry.json
```

- Landing page: `app/(home)`
- Docs (Fumadocs): `app/docs` + `content/docs`
- Scenes: `components/threecn`
- Theme hook: `components/hooks/use-shadcn-theme.ts`
- Registry manifest: `registry.json` → built to `public/r/*.json`

Built with React Three Fiber, drei, and shadcn/ui.
