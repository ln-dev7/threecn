"use client"

import * as React from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

import {
  SceneContainer,
  type SceneContainerProps,
} from "@/components/threecn/scene-container"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

function Cubes({
  grid,
  gap,
  speed,
  theme,
}: {
  grid: number
  gap: number
  speed: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor } = useShadcnTheme(theme)
  const meshRef = React.useRef<THREE.InstancedMesh>(null)
  const dummy = React.useMemo(() => new THREE.Object3D(), [])
  const tmpColor = React.useMemo(() => new THREE.Color(), [])
  const count = grid * grid

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.getElapsedTime() * speed
    const half = (grid - 1) / 2
    let i = 0
    for (let x = 0; x < grid; x++) {
      for (let z = 0; z < grid; z++) {
        const dx = x - half
        const dz = z - half
        const d = Math.sqrt(dx * dx + dz * dz)
        const y = Math.sin(d * 0.9 - t * 2.1) * 0.45
        dummy.position.set(dx * gap, y, dz * gap)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        // Crest → --primary, trough → --accent.
        const k = (y + 0.45) / 0.9
        tmpColor.copy(accentColor).lerp(primaryColor, k)
        mesh.setColorAt(i, tmpColor)
        i++
      }
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh key={count} ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.62, 0.62, 0.62]} />
      <meshStandardMaterial roughness={0.3} metalness={0.35} />
    </instancedMesh>
  )
}

export type CubeWaveProps = {
  /** Cubes per side (total = grid²). */
  grid?: number
  /** Spacing between cube centers. */
  gap?: number
  /** Wave speed multiplier. */
  speed?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A grid of instanced cubes riding a radial wave from the center outward.
 * Each cube blends from `--accent` in the troughs to `--primary` on the
 * crests. One draw call, hundreds of cubes.
 */
export function CubeWave({
  grid = 16,
  gap = 0.75,
  speed = 1,
  className,
  theme = "auto",
  environment = "studio",
}: CubeWaveProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[8, 7, 8]}
      fov={32}
    >
      <Cubes grid={grid} gap={gap} speed={speed} theme={theme} />
    </SceneContainer>
  )
}
