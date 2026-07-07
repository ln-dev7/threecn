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

function seedVortex(count: number, arms: number) {
  const positions = new Float32Array(count * 3)
  const radii = new Float32Array(count)
  const radius = 6
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 0.6) * radius
    const arm = i % arms
    const branch = (arm / arms) * Math.PI * 2
    const spin = r * 0.5
    const scatter = (Math.random() - 0.5) * (0.6 + r * 0.08)
    const angle = branch + spin
    positions[i * 3] = Math.cos(angle) * r + scatter
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6
    positions[i * 3 + 2] = Math.sin(angle) * r + scatter
    radii[i] = r / radius
  }
  return { positions, radii }
}

function Spiral({
  count,
  speed,
  arms,
  theme,
}: {
  count: number
  speed: number
  arms: number
  theme: ThemeMode
}) {
  const pointsRef = React.useRef<THREE.Points>(null)
  const { primaryColor, mutedColor } = useShadcnTheme(theme)

  const { positions, radii } = React.useMemo(
    () => seedVortex(count, arms),
    [count, arms]
  )

  const colors = React.useMemo(() => {
    const arr = new Float32Array(count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      c.copy(primaryColor).lerp(mutedColor, radii[i])
      arr[i * 3] = c.r
      arr[i * 3 + 1] = c.g
      arr[i * 3 + 2] = c.b
    }
    return arr
  }, [count, radii, primaryColor, mutedColor])

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.12 * speed
  })

  return (
    <points ref={pointsRef} rotation={[0.5, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export type VortexProps = {
  /** Number of points. */
  count?: number
  /** Rotation speed multiplier. */
  speed?: number
  /** Number of spiral arms. */
  arms?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A spiral galaxy of points: arms swirl outward, fading from `--primary` at the
 * core to `--muted-foreground` at the rim. Self-contained and theme-aware.
 */
export function Vortex({
  count = 2200,
  speed = 1,
  arms = 3,
  className,
  theme = "auto",
  environment = "night",
}: VortexProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 3, 8]}
      fov={45}
    >
      <Spiral count={count} speed={speed} arms={arms} theme={theme} />
    </SceneContainer>
  )
}
