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

const NEAR_Z = 5
const FAR_Z = -45

function randomStreak(spread: number, out: Float32Array, offset: number, z?: number) {
  // Bias stars away from the exact center so the camera has a clear "eye".
  const r = 0.4 + Math.sqrt(Math.random()) * spread
  const a = Math.random() * Math.PI * 2
  const x = Math.cos(a) * r
  const y = Math.sin(a) * r * 0.65
  const zz = z ?? FAR_Z + Math.random() * (NEAR_Z - FAR_Z)
  const len = 1 + Math.random() * 1.6
  out[offset] = x
  out[offset + 1] = y
  out[offset + 2] = zz
  out[offset + 3] = x
  out[offset + 4] = y
  out[offset + 5] = zz - len
}

function seedStreaks(count: number, spread: number) {
  const positions = new Float32Array(count * 6)
  for (let i = 0; i < count; i++) randomStreak(spread, positions, i * 6)
  return positions
}

function Streaks({
  count,
  speed,
  spread,
  theme,
}: {
  count: number
  speed: number
  spread: number
  theme: ThemeMode
}) {
  const { primaryColor, foregroundColor, isDark } = useShadcnTheme(theme)
  const geoRef = React.useRef<THREE.BufferGeometry>(null)

  const positions = React.useMemo(
    () => seedStreaks(count, spread),
    [count, spread]
  )
  const colors = React.useMemo(() => new Float32Array(count * 6), [count])

  // Head = bright (foreground tinted with primary), tail = dim primary so
  // additive blending fades the streak out naturally.
  React.useLayoutEffect(() => {
    const geo = geoRef.current
    if (!geo) return
    const colorAttr = geo.getAttribute("color") as THREE.BufferAttribute
    const arr = colorAttr.array as Float32Array
    const head = new THREE.Color()
      .copy(foregroundColor)
      .lerp(primaryColor, 0.4)
    const tail = new THREE.Color()
      .copy(primaryColor)
      .multiplyScalar(isDark ? 0.12 : 0.55)
    for (let i = 0; i * 6 < arr.length; i++) {
      const o = i * 6
      arr[o] = head.r
      arr[o + 1] = head.g
      arr[o + 2] = head.b
      arr[o + 3] = tail.r
      arr[o + 4] = tail.g
      arr[o + 5] = tail.b
    }
    colorAttr.needsUpdate = true
  }, [count, primaryColor, foregroundColor, isDark])

  useFrame((_, delta) => {
    const geo = geoRef.current
    if (!geo) return
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    const dz = Math.min(delta, 0.05) * 24 * speed
    for (let i = 0; i * 6 < arr.length; i++) {
      const o = i * 6
      arr[o + 2] += dz
      arr[o + 5] += dz
      if (arr[o + 5] > NEAR_Z) {
        randomStreak(spread, arr, o, FAR_Z - Math.random() * 6)
      }
    }
    posAttr.needsUpdate = true
  })

  return (
    <lineSegments frustumCulled={false}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </lineSegments>
  )
}

export type WarpTunnelProps = {
  /** Number of star streaks. */
  count?: number
  /** Warp speed multiplier. */
  speed?: number
  /** Tunnel radius. */
  spread?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * Hyperspace. Hundreds of star streaks race past the camera toward a clear
 * vanishing point, colored from `--foreground` heads to `--primary` tails.
 * Great as a full-bleed hero background.
 */
export function WarpTunnel({
  count = 400,
  speed = 1,
  spread = 7,
  className,
  theme = "auto",
  environment = "night",
}: WarpTunnelProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 6]}
      fov={60}
      orbit={false}
    >
      <Streaks count={count} speed={speed} spread={spread} theme={theme} />
    </SceneContainer>
  )
}
