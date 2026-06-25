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

type ParticlesProps = {
  count: number
  speed: number
  theme: ThemeMode
}

type ParticleData = {
  positions: Float32Array
  speeds: Float32Array
  isPrimary: Uint8Array
}

function seedParticles(count: number): ParticleData {
  const positions = new Float32Array(count * 3)
  const speeds = new Float32Array(count)
  const isPrimary = new Uint8Array(count)
  const radius = 9
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const r = radius * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6
    positions[i3 + 2] = r * Math.cos(phi)
    speeds[i] = 0.5 + Math.random()
    // 35% of points are "primary" (foreground), the rest muted.
    isPrimary[i] = Math.random() < 0.35 ? 1 : 0
  }
  return { positions, speeds, isPrimary }
}

function Particles({ count, speed, theme }: ParticlesProps) {
  const pointsRef = React.useRef<THREE.Points>(null)
  const materialRef = React.useRef<THREE.PointsMaterial>(null)
  const { primaryColor, mutedColor } = useShadcnTheme(theme)

  // Stable distribution; only regenerated when the count changes.
  const { positions, speeds, isPrimary } = React.useMemo(
    () => seedParticles(count),
    [count]
  )

  // A fresh color buffer is built whenever the theme changes.
  const colors = React.useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const c = isPrimary[i] ? primaryColor : mutedColor
      arr[i3] = c.r
      arr[i3 + 1] = c.g
      arr[i3 + 2] = c.b
    }
    return arr
  }, [count, isPrimary, primaryColor, mutedColor])

  useFrame((state, delta) => {
    const points = pointsRef.current
    if (!points) return
    const t = state.clock.elapsedTime
    points.rotation.y += delta * 0.05 * speed

    const pos = points.geometry.getAttribute("position") as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    for (let i = 0; i < speeds.length; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.4 * speed + i) * 0.0008 * speeds[i]
    }
    pos.needsUpdate = true

    if (materialRef.current) {
      materialRef.current.opacity = 0.55 + Math.sin(t * 0.6) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        vertexColors
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export type ParticleFieldProps = {
  count?: number
  speed?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A slowly drifting cloud of 1,500 particles. Foreground particles use your
 * `--primary` color, the rest use `--muted-foreground`. Fully theme-aware.
 */
export function ParticleField({
  count = 1500,
  speed = 0.3,
  className,
  theme = "auto",
  environment = "night",
}: ParticleFieldProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 12]}
    >
      <Particles count={count} speed={speed} theme={theme} />
    </SceneContainer>
  )
}
