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

const BOUND = 3.4

/** A smooth scalar potential; three seeded copies form a vector potential. */
function potential(x: number, y: number, z: number, t: number, seed: number) {
  return (
    Math.sin(x * 0.7 + seed + t * 0.3) +
    Math.cos(y * 0.9 - seed * 1.3 + t * 0.2) +
    Math.sin(z * 0.8 + seed * 0.7 - t * 0.25)
  )
}

function seedSphere(count: number, radius: number) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = Math.cbrt(Math.random()) * radius
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi)
  }
  return arr
}

function Filaments({
  count,
  speed,
  size,
  theme,
}: {
  count: number
  speed: number
  size: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor, isDark } = useShadcnTheme(theme)
  const geoRef = React.useRef<THREE.BufferGeometry>(null)

  const positions = React.useMemo(
    () => seedSphere(count, BOUND * 0.9),
    [count]
  )
  const colors = React.useMemo(() => new Float32Array(count * 3), [count])

  useFrame((state, delta) => {
    const geo = geoRef.current
    if (!geo) return
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute
    const colAttr = geo.getAttribute("color") as THREE.BufferAttribute
    const pos = posAttr.array as Float32Array
    const cols = colAttr.array as Float32Array
    const t = state.clock.getElapsedTime()
    const dt = Math.min(delta, 0.05) * speed
    const e = 0.1
    const inv2e = 1 / (2 * e)
    const col = new THREE.Color()

    for (let i = 0; i < count; i++) {
      const o = i * 3
      const x = pos[o]
      const y = pos[o + 1]
      const z = pos[o + 2]

      // curl of the vector potential (pa, pb, pc) → divergence-free flow.
      const dPc_dy =
        (potential(x, y + e, z, t, 9.7) - potential(x, y - e, z, t, 9.7)) * inv2e
      const dPb_dz =
        (potential(x, y, z + e, t, 5.2) - potential(x, y, z - e, t, 5.2)) * inv2e
      const dPa_dz =
        (potential(x, y, z + e, t, 0) - potential(x, y, z - e, t, 0)) * inv2e
      const dPc_dx =
        (potential(x + e, y, z, t, 9.7) - potential(x - e, y, z, t, 9.7)) * inv2e
      const dPb_dx =
        (potential(x + e, y, z, t, 5.2) - potential(x - e, y, z, t, 5.2)) * inv2e
      const dPa_dy =
        (potential(x, y + e, z, t, 0) - potential(x, y - e, z, t, 0)) * inv2e

      const vx = dPc_dy - dPb_dz
      const vy = dPa_dz - dPc_dx
      const vz = dPb_dx - dPa_dy

      let nx = x + vx * dt
      let ny = y + vy * dt
      let nz = z + vz * dt

      // Respawn particles that drift out of the volume.
      if (nx * nx + ny * ny + nz * nz > BOUND * BOUND) {
        const r = Math.cbrt(Math.random()) * BOUND * 0.6
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        nx = r * Math.sin(phi) * Math.cos(theta)
        ny = r * Math.sin(phi) * Math.sin(theta)
        nz = r * Math.cos(phi)
      }

      pos[o] = nx
      pos[o + 1] = ny
      pos[o + 2] = nz

      // Tint by height: --accent low → --primary high.
      const k = THREE.MathUtils.clamp(ny / BOUND + 0.5, 0, 1)
      col.copy(accentColor).lerp(primaryColor, k)
      cols[o] = col.r
      cols[o + 1] = col.g
      cols[o + 2] = col.b
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={size}
        sizeAttenuation
        transparent
        opacity={isDark ? 0.9 : 0.8}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  )
}

export type CurlFlowProps = {
  /** Number of flowing particles. */
  count?: number
  /** Flow speed multiplier. */
  speed?: number
  /** Particle size. */
  size?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * Thousands of particles advected through a divergence-free curl-noise field,
 * organizing themselves into drifting silky filaments. Height tints them
 * `--accent` → `--primary`; additive glow in dark mode. A flow, not a drizzle.
 */
export function CurlFlow({
  count = 2400,
  speed = 1,
  size = 0.04,
  className,
  theme = "auto",
  environment = "night",
}: CurlFlowProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 8]}
      fov={45}
    >
      <Filaments count={count} speed={speed} size={size} theme={theme} />
    </SceneContainer>
  )
}
