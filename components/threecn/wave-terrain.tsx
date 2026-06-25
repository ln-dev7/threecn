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

function Terrain({
  amplitude,
  speed,
  density,
  theme,
}: {
  amplitude: number
  speed: number
  density: number
  theme: ThemeMode
}) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  const { primaryColor, mutedColor } = useShadcnTheme(theme)

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.elapsedTime * speed
    const pos = mesh.geometry.getAttribute("position") as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i]
      const y = arr[i + 1]
      arr[i + 2] =
        Math.sin(x * 0.6 + t) * amplitude +
        Math.cos(y * 0.5 + t * 0.8) * amplitude * 0.6
    }
    pos.needsUpdate = true
    mesh.geometry.computeVertexNormals()
  })

  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -0.6, 0]}>
      {/* wireframe surface */}
      <mesh ref={meshRef}>
        <planeGeometry args={[16, 16, density, density]} />
        <meshBasicMaterial
          color={primaryColor}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
      {/* faint filled copy for body */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[16, 16, density, density]} />
        <meshBasicMaterial color={mutedColor} transparent opacity={0.04} />
      </mesh>
    </group>
  )
}

export type WaveTerrainProps = {
  /** Peak height of the waves. */
  amplitude?: number
  /** Animation speed multiplier. */
  speed?: number
  /** Grid resolution (segments per side). */
  density?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * An undulating wireframe terrain seen in perspective. The grid uses `--primary`
 * over a faint `--muted-foreground` body. Vertices are displaced every frame.
 */
export function WaveTerrain({
  amplitude = 0.6,
  speed = 0.6,
  density = 48,
  className,
  theme = "auto",
  environment = "night",
}: WaveTerrainProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 1.2, 6]}
      fov={45}
    >
      <Terrain
        amplitude={amplitude}
        speed={speed}
        density={density}
        theme={theme}
      />
    </SceneContainer>
  )
}
