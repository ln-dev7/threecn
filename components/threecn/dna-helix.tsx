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

type Node = {
  y: number
  angle: number
  a: [number, number, number]
  b: [number, number, number]
}

function buildHelix(count: number, radius: number, height: number): Node[] {
  const nodes: Node[] = []
  const turns = 2.2
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1)
    const angle = t * Math.PI * 2 * turns
    const y = (t - 0.5) * height
    nodes.push({
      y,
      angle,
      a: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
      b: [Math.cos(angle + Math.PI) * radius, y, Math.sin(angle + Math.PI) * radius],
    })
  }
  return nodes
}

function Helix({
  count,
  speed,
  radius,
  theme,
}: {
  count: number
  speed: number
  radius: number
  theme: ThemeMode
}) {
  const groupRef = React.useRef<THREE.Group>(null)
  const { primaryColor, accentColor, mutedColor } = useShadcnTheme(theme)
  const nodes = React.useMemo(
    () => buildHelix(count, radius, 6),
    [count, radius]
  )

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.5 * speed
  })

  return (
    <group ref={groupRef}>
      {nodes.map((n, i) => (
        <group key={i}>
          <mesh position={n.a}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={0.25}
              metalness={0.5}
              roughness={0.25}
            />
          </mesh>
          <mesh position={n.b}>
            <sphereGeometry args={[0.13, 20, 20]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={0.15}
              metalness={0.5}
              roughness={0.25}
            />
          </mesh>
          {i % 2 === 0 ? (
            <mesh position={[0, n.y, 0]} rotation={[0, -n.angle, 0]}>
              <boxGeometry args={[radius * 2, 0.05, 0.05]} />
              <meshStandardMaterial
                color={mutedColor}
                transparent
                opacity={0.6}
              />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  )
}

export type DnaHelixProps = {
  /** Number of base pairs (nodes per strand). */
  count?: number
  /** Rotation speed multiplier. */
  speed?: number
  /** Helix radius. */
  radius?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A rotating DNA-style double helix: two strands of spheres (`--primary` and
 * `--accent`) joined by `--muted-foreground` rungs. Self-contained, theme-aware.
 */
export function DnaHelix({
  count = 24,
  speed = 1,
  radius = 1.1,
  className,
  theme = "auto",
  environment = "city",
}: DnaHelixProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 7]}
      fov={42}
    >
      <Helix count={count} speed={speed} radius={radius} theme={theme} />
    </SceneContainer>
  )
}
