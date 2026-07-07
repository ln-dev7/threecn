"use client"

import dynamic from "next/dynamic"
import * as React from "react"

import type { ThemeMode } from "@/components/hooks/use-shadcn-theme"
import type { ParticleFieldProps } from "@/components/threecn/particle-field"
import type { ProductViewerProps } from "@/components/threecn/product-viewer"
import type { FloatingCard3DProps } from "@/components/threecn/floating-card-3d"
import type { Text3DProps } from "@/components/threecn/text-3d"
import type { ProductShowcaseProps } from "@/components/threecn/product-showcase"
import type { SceneContainerProps } from "@/components/threecn/scene-container"
import type { GlobeProps } from "@/components/threecn/globe"
import type { WaveTerrainProps } from "@/components/threecn/wave-terrain"
import type { CrystalProps } from "@/components/threecn/crystal"
import type { HaloProps } from "@/components/threecn/halo"
import type { DnaHelixProps } from "@/components/threecn/dna-helix"
import type { VortexProps } from "@/components/threecn/vortex"

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
    </div>
  )
}

const ParticleField = dynamic(
  () =>
    import("@/components/threecn/particle-field").then((m) => m.ParticleField),
  { ssr: false, loading: Loading }
)
const ProductViewer = dynamic(
  () =>
    import("@/components/threecn/product-viewer").then((m) => m.ProductViewer),
  { ssr: false, loading: Loading }
)
const FloatingCard3D = dynamic(
  () =>
    import("@/components/threecn/floating-card-3d").then(
      (m) => m.FloatingCard3D
    ),
  { ssr: false, loading: Loading }
)
const Text3D = dynamic(
  () => import("@/components/threecn/text-3d").then((m) => m.Text3D),
  { ssr: false, loading: Loading }
)
const ProductShowcase = dynamic(
  () =>
    import("@/components/threecn/product-showcase").then(
      (m) => m.ProductShowcase
    ),
  { ssr: false, loading: Loading }
)
const SceneContainer = dynamic(
  () =>
    import("@/components/threecn/scene-container").then(
      (m) => m.SceneContainer
    ),
  { ssr: false, loading: Loading }
)
const Globe = dynamic(
  () => import("@/components/threecn/globe").then((m) => m.Globe),
  { ssr: false, loading: Loading }
)
const WaveTerrain = dynamic(
  () => import("@/components/threecn/wave-terrain").then((m) => m.WaveTerrain),
  { ssr: false, loading: Loading }
)
const Crystal = dynamic(
  () => import("@/components/threecn/crystal").then((m) => m.Crystal),
  { ssr: false, loading: Loading }
)
const Halo = dynamic(
  () => import("@/components/threecn/halo").then((m) => m.Halo),
  { ssr: false, loading: Loading }
)
const DnaHelix = dynamic(
  () => import("@/components/threecn/dna-helix").then((m) => m.DnaHelix),
  { ssr: false, loading: Loading }
)
const Vortex = dynamic(
  () => import("@/components/threecn/vortex").then((m) => m.Vortex),
  { ssr: false, loading: Loading }
)
export type SceneSlug =
  | "scene-container"
  | "particle-field"
  | "product-viewer"
  | "floating-card-3d"
  | "text-3d"
  | "product-showcase"
  | "globe"
  | "wave-terrain"
  | "crystal"
  | "halo"
  | "dna-helix"
  | "vortex"

export function SceneBySlug({
  slug,
  theme = "auto",
  className,
  props,
}: {
  slug: SceneSlug
  theme?: ThemeMode
  className?: string
  /** Extra props forwarded to the scene (used by the docs playground). */
  props?: Record<string, unknown>
}) {
  const shared = { className, theme, ...props }
  switch (slug) {
    case "particle-field":
      return <ParticleField {...(shared as ParticleFieldProps)} />
    case "product-viewer":
      return <ProductViewer {...(shared as ProductViewerProps)} />
    case "floating-card-3d":
      return (
        <FloatingCard3D {...(shared as FloatingCard3DProps)}>
          <div className="rounded-lg p-4 text-center">
            <p className="font-mono text-xs text-muted-foreground">--primary</p>
            <p className="mt-1 text-lg font-semibold text-foreground">
              Tilt me
            </p>
          </div>
        </FloatingCard3D>
      )
    case "text-3d":
      return (
        <Text3D
          {...({ text: "threecn", size: 0.9, ...shared } as Text3DProps)}
        />
      )
    case "product-showcase":
      return <ProductShowcase {...(shared as ProductShowcaseProps)} />
    case "scene-container":
      return (
        <SceneContainer environment="dawn" {...(shared as SceneContainerProps)}>
          <mesh rotation={[0.4, 0.4, 0]}>
            <icosahedronGeometry args={[1.6, 0]} />
            <meshStandardMaterial
              color="#7c3aed"
              metalness={0.6}
              roughness={0.25}
            />
          </mesh>
        </SceneContainer>
      )
    case "globe":
      return <Globe {...(shared as GlobeProps)} />
    case "wave-terrain":
      return <WaveTerrain {...(shared as WaveTerrainProps)} />
    case "crystal":
      return <Crystal {...(shared as CrystalProps)} />
    case "halo":
      return <Halo {...(shared as HaloProps)} />
    case "dna-helix":
      return <DnaHelix {...(shared as DnaHelixProps)} />
    case "vortex":
      return <Vortex {...(shared as VortexProps)} />
    default:
      return null
  }
}
