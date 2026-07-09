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

// Aizawa attractor coefficients — a classic set that traces a spindle wrapped
// in orbiting loops.
const A = 0.95
const B = 0.7
const C = 0.6
const D = 3.5
const E = 0.25
const F = 0.1

/** Integrate the attractor into a centered, ~4-unit point path (run once). */
function traceAttractor(points: number) {
  const path = new Float32Array(points * 3)
  let x = 0.1
  let y = 0
  let z = 0
  const dt = 0.006
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  let minZ = Infinity
  let maxZ = -Infinity

  for (let i = 0; i < points; i++) {
    const dx = (z - B) * x - D * y
    const dy = D * x + (z - B) * y
    const dz =
      C + A * z - (z * z * z) / 3 - (x * x + y * y) * (1 + E * z) + F * z * x * x * x
    x += dx * dt
    y += dy * dt
    z += dz * dt
    path[i * 3] = x
    path[i * 3 + 1] = y
    path[i * 3 + 2] = z
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
    if (z < minZ) minZ = z
    if (z > maxZ) maxZ = z
  }

  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const cz = (minZ + maxZ) / 2
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1
  const scale = 4 / span
  for (let i = 0; i < points; i++) {
    path[i * 3] = (path[i * 3] - cx) * scale
    path[i * 3 + 1] = (path[i * 3 + 1] - cy) * scale
    path[i * 3 + 2] = (path[i * 3 + 2] - cz) * scale
  }
  return path
}

/** Expand the point path into consecutive line segments for <lineSegments>. */
function toSegments(path: Float32Array) {
  const n = path.length / 3
  const seg = new Float32Array((n - 1) * 2 * 3)
  let o = 0
  for (let i = 0; i < n - 1; i++) {
    seg[o++] = path[i * 3]
    seg[o++] = path[i * 3 + 1]
    seg[o++] = path[i * 3 + 2]
    seg[o++] = path[(i + 1) * 3]
    seg[o++] = path[(i + 1) * 3 + 1]
    seg[o++] = path[(i + 1) * 3 + 2]
  }
  return seg
}

function Attractor({
  points,
  speed,
  theme,
}: {
  points: number
  speed: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor, isDark } = useShadcnTheme(theme)
  const geoRef = React.useRef<THREE.BufferGeometry>(null)
  const groupRef = React.useRef<THREE.Group>(null)
  const headRef = React.useRef<THREE.Mesh>(null)
  const head = React.useRef(0)

  const path = React.useMemo(() => traceAttractor(points), [points])
  const segPositions = React.useMemo(() => toSegments(path), [path])
  const segColors = React.useMemo(
    () => new Float32Array(segPositions.length),
    [segPositions]
  )

  // Gradient --primary → --accent along the orbit; re-run on theme change.
  React.useLayoutEffect(() => {
    const attr = geoRef.current?.getAttribute("color") as
      | THREE.BufferAttribute
      | undefined
    if (!attr) return
    const arr = attr.array as Float32Array
    const segCount = arr.length / 6
    const c = new THREE.Color()
    for (let i = 0; i < segCount; i++) {
      c.copy(primaryColor).lerp(accentColor, i / segCount)
      const o = i * 6
      arr[o] = c.r
      arr[o + 1] = c.g
      arr[o + 2] = c.b
      arr[o + 3] = c.r
      arr[o + 4] = c.g
      arr[o + 5] = c.b
    }
    attr.needsUpdate = true
  }, [segPositions, primaryColor, accentColor])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25 * speed
    // A glowing head sweeps continuously along the traced path.
    const n = path.length / 3
    head.current = (head.current + delta * 120 * speed) % n
    const idx = Math.floor(head.current) * 3
    if (headRef.current) {
      headRef.current.position.set(path[idx], path[idx + 1], path[idx + 2])
    }
  })

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.2]}>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[segPositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[segColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={isDark ? 0.85 : 0.95}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </lineSegments>
      <mesh ref={headRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={accentColor} toneMapped={false} />
      </mesh>
    </group>
  )
}

export type StrangeAttractorProps = {
  /** Number of integration steps traced (path detail). */
  points?: number
  /** Rotation and head speed multiplier. */
  speed?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * The Aizawa strange attractor, integrated live and drawn as a single glowing
 * orbit that never quite repeats. A bright head sweeps the path while the whole
 * form turns. Colored `--primary` → `--accent`; additive glow in dark mode.
 */
export function StrangeAttractor({
  points = 6000,
  speed = 1,
  className,
  theme = "auto",
  environment = "night",
}: StrangeAttractorProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 7]}
      fov={45}
    >
      <Attractor points={points} speed={speed} theme={theme} />
    </SceneContainer>
  )
}
