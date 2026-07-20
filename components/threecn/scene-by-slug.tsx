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
import type { AuroraRibbonsProps } from "@/components/threecn/aurora-ribbons"
import type { NetworkGraphProps } from "@/components/threecn/network-graph"
import type { MetaballsProps } from "@/components/threecn/metaballs"
import type { CubeWaveProps } from "@/components/threecn/cube-wave"
import type { IsoCityProps } from "@/components/threecn/iso-city"
import type { WarpTunnelProps } from "@/components/threecn/warp-tunnel"
import type { PhyllotaxisProps } from "@/components/threecn/phyllotaxis"
import type { StrangeAttractorProps } from "@/components/threecn/strange-attractor"
import type { CurlFlowProps } from "@/components/threecn/curl-flow"
import type { ClothProps } from "@/components/threecn/cloth"
import type { BoidsProps } from "@/components/threecn/boids"
import type { VoronoiShatterProps } from "@/components/threecn/voronoi-shatter"
import type { TesseractProps } from "@/components/threecn/tesseract"
import type { PendulumWaveProps } from "@/components/threecn/pendulum-wave"
import type { PitchMomentumProps } from "@/components/threecn/pitch-momentum"
import type { WorldCupProps } from "@/components/threecn/world-cup"

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
const AuroraRibbons = dynamic(
  () =>
    import("@/components/threecn/aurora-ribbons").then((m) => m.AuroraRibbons),
  { ssr: false, loading: Loading }
)
const NetworkGraph = dynamic(
  () =>
    import("@/components/threecn/network-graph").then((m) => m.NetworkGraph),
  { ssr: false, loading: Loading }
)
const Metaballs = dynamic(
  () => import("@/components/threecn/metaballs").then((m) => m.Metaballs),
  { ssr: false, loading: Loading }
)
const CubeWave = dynamic(
  () => import("@/components/threecn/cube-wave").then((m) => m.CubeWave),
  { ssr: false, loading: Loading }
)
const IsoCity = dynamic(
  () => import("@/components/threecn/iso-city").then((m) => m.IsoCity),
  { ssr: false, loading: Loading }
)
const WarpTunnel = dynamic(
  () => import("@/components/threecn/warp-tunnel").then((m) => m.WarpTunnel),
  { ssr: false, loading: Loading }
)
const Phyllotaxis = dynamic(
  () => import("@/components/threecn/phyllotaxis").then((m) => m.Phyllotaxis),
  { ssr: false, loading: Loading }
)
const StrangeAttractor = dynamic(
  () =>
    import("@/components/threecn/strange-attractor").then(
      (m) => m.StrangeAttractor
    ),
  { ssr: false, loading: Loading }
)
const CurlFlow = dynamic(
  () => import("@/components/threecn/curl-flow").then((m) => m.CurlFlow),
  { ssr: false, loading: Loading }
)
const Cloth = dynamic(
  () => import("@/components/threecn/cloth").then((m) => m.Cloth),
  { ssr: false, loading: Loading }
)
const Boids = dynamic(
  () => import("@/components/threecn/boids").then((m) => m.Boids),
  { ssr: false, loading: Loading }
)
const VoronoiShatter = dynamic(
  () =>
    import("@/components/threecn/voronoi-shatter").then(
      (m) => m.VoronoiShatter
    ),
  { ssr: false, loading: Loading }
)
const Tesseract = dynamic(
  () => import("@/components/threecn/tesseract").then((m) => m.Tesseract),
  { ssr: false, loading: Loading }
)
const PendulumWave = dynamic(
  () =>
    import("@/components/threecn/pendulum-wave").then((m) => m.PendulumWave),
  { ssr: false, loading: Loading }
)
const PitchMomentum = dynamic(
  () =>
    import("@/components/threecn/pitch-momentum").then((m) => m.PitchMomentum),
  { ssr: false, loading: Loading }
)
const WorldCup = dynamic(
  () => import("@/components/threecn/world-cup").then((m) => m.WorldCup),
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
  | "aurora-ribbons"
  | "network-graph"
  | "metaballs"
  | "cube-wave"
  | "iso-city"
  | "warp-tunnel"
  | "phyllotaxis"
  | "strange-attractor"
  | "curl-flow"
  | "cloth"
  | "boids"
  | "voronoi-shatter"
  | "tesseract"
  | "pendulum-wave"
  | "pitch-momentum"
  | "world-cup"

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
    case "aurora-ribbons":
      return <AuroraRibbons {...(shared as AuroraRibbonsProps)} />
    case "network-graph":
      return <NetworkGraph {...(shared as NetworkGraphProps)} />
    case "metaballs":
      return <Metaballs {...(shared as MetaballsProps)} />
    case "cube-wave":
      return <CubeWave {...(shared as CubeWaveProps)} />
    case "iso-city":
      return <IsoCity {...(shared as IsoCityProps)} />
    case "warp-tunnel":
      return <WarpTunnel {...(shared as WarpTunnelProps)} />
    case "phyllotaxis":
      return <Phyllotaxis {...(shared as PhyllotaxisProps)} />
    case "strange-attractor":
      return <StrangeAttractor {...(shared as StrangeAttractorProps)} />
    case "curl-flow":
      return <CurlFlow {...(shared as CurlFlowProps)} />
    case "cloth":
      return <Cloth {...(shared as ClothProps)} />
    case "boids":
      return <Boids {...(shared as BoidsProps)} />
    case "voronoi-shatter":
      return <VoronoiShatter {...(shared as VoronoiShatterProps)} />
    case "tesseract":
      return <Tesseract {...(shared as TesseractProps)} />
    case "pendulum-wave":
      return <PendulumWave {...(shared as PendulumWaveProps)} />
    case "pitch-momentum":
      return <PitchMomentum {...(shared as PitchMomentumProps)} />
    case "world-cup":
      return <WorldCup {...(shared as WorldCupProps)} />
    default:
      return null
  }
}
