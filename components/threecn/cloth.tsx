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

const WIDTH = 4.2
const HEIGHT = 3
const DAMPING = 0.97
const ITERATIONS = 4

type ClothSim = {
  positions: Float32Array
  colors: Float32Array
  indices: Uint32Array
  pinned: Uint8Array
  homeX: Float32Array
  homeY: Float32Array
  cA: Uint32Array
  cB: Uint32Array
  cRest: Float32Array
  cols: number
  rows: number
}

function buildCloth(segments: number): ClothSim {
  const cols = segments + 1
  const rows = segments + 1
  const n = cols * rows
  const positions = new Float32Array(n * 3)
  const colors = new Float32Array(n * 3)
  const pinned = new Uint8Array(n)
  const homeX = new Float32Array(n)
  const homeY = new Float32Array(n)

  for (let v = 0; v < rows; v++) {
    for (let u = 0; u < cols; u++) {
      const i = v * cols + u
      const x = (u / segments - 0.5) * WIDTH
      const y = (0.5 - v / segments) * HEIGHT
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = 0
      homeX[i] = x
      homeY[i] = y
      if (v === 0) pinned[i] = 1 // top row hangs the cloth
    }
  }

  // Structural constraints: each particle links to its right and lower neighbor.
  const restX = WIDTH / segments
  const restY = HEIGHT / segments
  const cA: number[] = []
  const cB: number[] = []
  const cRest: number[] = []
  for (let v = 0; v < rows; v++) {
    for (let u = 0; u < cols; u++) {
      const i = v * cols + u
      if (u < cols - 1) {
        cA.push(i)
        cB.push(i + 1)
        cRest.push(restX)
      }
      if (v < rows - 1) {
        cA.push(i)
        cB.push(i + cols)
        cRest.push(restY)
      }
    }
  }

  // Two triangles per cell.
  const indices = new Uint32Array(segments * segments * 6)
  let o = 0
  for (let v = 0; v < segments; v++) {
    for (let u = 0; u < segments; u++) {
      const a = v * cols + u
      const b = a + 1
      const c = a + cols
      const d = c + 1
      indices[o++] = a
      indices[o++] = c
      indices[o++] = b
      indices[o++] = b
      indices[o++] = c
      indices[o++] = d
    }
  }

  return {
    positions,
    colors,
    indices,
    pinned,
    homeX,
    homeY,
    cA: Uint32Array.from(cA),
    cB: Uint32Array.from(cB),
    cRest: Float32Array.from(cRest),
    cols,
    rows,
  }
}

function Drape({
  segments,
  speed,
  wind,
  theme,
}: {
  segments: number
  speed: number
  wind: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor } = useShadcnTheme(theme)
  const geoRef = React.useRef<THREE.BufferGeometry>(null)

  const sim = React.useMemo(() => buildCloth(segments), [segments])

  // Verlet needs each particle's previous position. It's mutated every frame,
  // so it lives in a ref (never read during render) rather than in the memo.
  const prevRef = React.useRef<Float32Array | null>(null)
  React.useLayoutEffect(() => {
    prevRef.current = sim.positions.slice()
  }, [sim])

  // Weave the theme gradient into the fabric, top → bottom.
  React.useLayoutEffect(() => {
    const attr = geoRef.current?.getAttribute("color") as
      | THREE.BufferAttribute
      | undefined
    if (!attr) return
    const arr = attr.array as Float32Array
    const { cols, rows } = sim
    const c = new THREE.Color()
    for (let v = 0; v < rows; v++) {
      c.copy(primaryColor).lerp(accentColor, v / (rows - 1))
      for (let u = 0; u < cols; u++) {
        const i = (v * cols + u) * 3
        arr[i] = c.r
        arr[i + 1] = c.g
        arr[i + 2] = c.b
      }
    }
    attr.needsUpdate = true
  }, [sim, primaryColor, accentColor])

  useFrame((state, delta) => {
    const geo = geoRef.current
    if (!geo) return
    const prev = prevRef.current
    if (!prev) return
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute
    const positions = posAttr.array as Float32Array
    const t = state.clock.getElapsedTime()
    const dt = Math.min(delta, 0.033)
    const dt2 = dt * dt
    const { pinned, homeX, homeY, cA, cB, cRest, cols } = sim

    // Wind gusts, stronger toward the free bottom edge.
    const windZ = (Math.sin(t * 1.3) * 0.5 + 0.6) * 9 * wind * speed
    const windX = Math.sin(t * 0.7) * 2 * wind * speed
    const gravity = -3.2

    // Pin the top row, letting it sway so the whole sheet ripples.
    for (let u = 0; u < cols; u++) {
      const i = u
      const io = i * 3
      positions[io] = homeX[i] + Math.sin(t * 0.6 + u * 0.35) * 0.12
      positions[io + 1] = homeY[i]
      positions[io + 2] = Math.sin(t * 0.9 + u * 0.5) * 0.35
    }

    // Verlet integrate the free particles.
    for (let i = cols; i < pinned.length; i++) {
      if (pinned[i]) continue
      const io = i * 3
      const gust = Math.sin(t * 2 + positions[io + 1] * 0.8)
      const ax = windX * (0.6 + 0.4 * gust)
      const ay = gravity
      const az = windZ * (0.5 + 0.5 * gust)

      const px = positions[io]
      const py = positions[io + 1]
      const pz = positions[io + 2]
      positions[io] = px + (px - prev[io]) * DAMPING + ax * dt2
      positions[io + 1] = py + (py - prev[io + 1]) * DAMPING + ay * dt2
      positions[io + 2] = pz + (pz - prev[io + 2]) * DAMPING + az * dt2
      prev[io] = px
      prev[io + 1] = py
      prev[io + 2] = pz
    }

    // Relax the distance constraints a few times per frame.
    for (let iter = 0; iter < ITERATIONS; iter++) {
      for (let k = 0; k < cRest.length; k++) {
        const a = cA[k]
        const b = cB[k]
        const ao = a * 3
        const bo = b * 3
        const dx = positions[bo] - positions[ao]
        const dy = positions[bo + 1] - positions[ao + 1]
        const dz = positions[bo + 2] - positions[ao + 2]
        const dist = Math.hypot(dx, dy, dz) || 1e-6
        const diff = (dist - cRest[k]) / dist
        const pa = pinned[a]
        const pb = pinned[b]
        if (pa && pb) continue
        const w = pa || pb ? 1 : 0.5
        const mx = dx * diff * w
        const my = dy * diff * w
        const mz = dz * diff * w
        if (!pa) {
          positions[ao] += mx
          positions[ao + 1] += my
          positions[ao + 2] += mz
        }
        if (!pb) {
          positions[bo] -= mx
          positions[bo + 1] -= my
          positions[bo + 2] -= mz
        }
      }
    }

    ;(geo.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh key={segments}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[sim.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[sim.colors, 3]} />
        <bufferAttribute attach="index" args={[sim.indices, 1]} />
      </bufferGeometry>
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        roughness={0.42}
        metalness={0.16}
      />
    </mesh>
  )
}

export type ClothProps = {
  /** Grid resolution per side (more = finer fabric, heavier sim). */
  segments?: number
  /** Overall motion speed multiplier. */
  speed?: number
  /** Wind strength. */
  wind?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A real spring-mass cloth (Verlet integration) hanging from its top edge and
 * rippling under procedural wind. The theme gradient is woven top-to-bottom,
 * `--primary` → `--accent`, and the surface catches the scene lighting.
 */
export function Cloth({
  segments = 26,
  speed = 1,
  wind = 1,
  className,
  theme = "auto",
  environment = "studio",
}: ClothProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 6.5]}
      fov={42}
    >
      <Drape segments={segments} speed={speed} wind={wind} theme={theme} />
    </SceneContainer>
  )
}
