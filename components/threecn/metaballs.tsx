"use client"

import * as React from "react"
import { useFrame } from "@react-three/fiber"
import { MarchingCube, MarchingCubes } from "@react-three/drei"
import * as THREE from "three"

import {
  SceneContainer,
  type SceneContainerProps,
} from "@/components/threecn/scene-container"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

type BlobSeed = {
  ax: number
  ay: number
  az: number
  px: number
  py: number
  pz: number
}

function seedBlobs(count: number): BlobSeed[] {
  return Array.from({ length: count }, () => ({
    ax: 0.7 + Math.random() * 0.7,
    ay: 0.7 + Math.random() * 0.7,
    az: 0.7 + Math.random() * 0.7,
    px: Math.random() * Math.PI * 2,
    py: Math.random() * Math.PI * 2,
    pz: Math.random() * Math.PI * 2,
  }))
}

function Blobs({
  blobs,
  speed,
  resolution,
  roughness,
  theme,
}: {
  blobs: number
  speed: number
  resolution: number
  roughness: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor } = useShadcnTheme(theme)
  const refs = React.useRef<(THREE.Object3D | null)[]>([])
  const seeds = React.useMemo(() => seedBlobs(blobs), [blobs])

  // drei feeds each ball's WORLD position into the field as
  // `0.5 + worldPos * 0.5`, and the balls are children of the scaled
  // MarchingCubes mesh. So local position × SCALE must stay well inside
  // [-1, 1] (≈ [0, 1] in field space) or the blobs clip flat against the cube.
  const AMP = 0.2

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    for (let i = 0; i < seeds.length; i++) {
      const o = refs.current[i]
      if (!o) continue
      const s = seeds[i]
      o.position.set(
        Math.sin(t * s.ax + s.px) * AMP,
        Math.cos(t * s.ay + s.py) * AMP,
        Math.sin(t * s.az + s.pz) * AMP
      )
    }
  })

  return (
    <MarchingCubes
      resolution={resolution}
      maxPolyCount={60000}
      enableUvs={false}
      enableColors={false}
      scale={2.6}
    >
      {seeds.map((_, i) => (
        <MarchingCube
          key={i}
          ref={(el: THREE.Object3D | null) => {
            refs.current[i] = el
          }}
          strength={0.5}
          subtract={12}
        />
      ))}
      <meshStandardMaterial
        color={primaryColor}
        emissive={accentColor}
        emissiveIntensity={0.25}
        roughness={roughness}
        metalness={0.25}
      />
    </MarchingCubes>
  )
}

export type MetaballsProps = {
  /** Number of blobs. */
  blobs?: number
  /** Animation speed multiplier. */
  speed?: number
  /** Marching-cubes grid resolution (higher = smoother, heavier). */
  resolution?: number
  /** Surface roughness (0–1). */
  roughness?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A lava-lamp of liquid metaballs that merge and split as they orbit each
 * other, surfaced with marching cubes and tinted with `--primary`.
 */
export function Metaballs({
  blobs = 6,
  speed = 1,
  resolution = 44,
  roughness = 0.18,
  className,
  theme = "auto",
  environment = "studio",
}: MetaballsProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 5.5]}
      fov={40}
    >
      <Blobs
        blobs={blobs}
        speed={speed}
        resolution={resolution}
        roughness={roughness}
        theme={theme}
      />
    </SceneContainer>
  )
}
