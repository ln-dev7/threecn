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

/** Rounded platform the pitch sits on. */
const SLAB_W = 7.8
const SLAB_H = 5.2
const SLAB_R = 0.55
const SLAB_DEPTH = 0.16

/** Playing field (105m × 68m scaled down), markings derive from FIFA metrics. */
const PITCH_W = 6.8
const PITCH_H = PITCH_W * (68 / 105)
const M = PITCH_W / 105 // meters → scene units
const PEN_DEPTH = 16.5 * M
const PEN_WIDTH = 40.32 * M
const GOAL_AREA_DEPTH = 5.5 * M
const GOAL_AREA_WIDTH = 18.32 * M
const SPOT_DIST = 11 * M
const CIRCLE_R = 9.15 * M
const GOAL_W = 7.32 * M
const GOAL_H = 2.44 * M
const GOAL_D = 0.18

/** How far mountains spread and how strongly detail noise crags them. */
const SIGMA = 1.6
const INV_2S2 = 1 / (2 * SIGMA * SIGMA)
/** Squashes the across-pitch axis so mountains stretch over the full width. */
const Z_WEIGHT = 0.45

const LINE_Y = 0.012

function hash2(ix: number, iz: number) {
  const s = Math.sin(ix * 127.1 + iz * 311.7) * 43758.5453
  return s - Math.floor(s)
}

/** Bilinear value noise in [0, 1]. */
function vnoise(x: number, z: number) {
  const ix = Math.floor(x)
  const iz = Math.floor(z)
  const fx = x - ix
  const fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uz = fz * fz * (3 - 2 * fz)
  const a = hash2(ix, iz)
  const b = hash2(ix + 1, iz)
  const c = hash2(ix, iz + 1)
  const d = hash2(ix + 1, iz + 1)
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz
}

/** Ridged fractal noise — sharp crests, craggy slopes. */
function ridgedFbm(x: number, z: number) {
  let sum = 0
  let amp = 0.5
  let freq = 1
  let px = x
  let pz = z
  for (let o = 0; o < 4; o++) {
    const n = 1 - Math.abs(2 * vnoise(px * freq, pz * freq) - 1)
    sum += n * n * amp
    amp *= 0.5
    freq *= 2.1
    // Rotate each octave so the lattice never lines up into visible bands.
    const rx = px * 0.7648 - pz * 0.6442
    pz = px * 0.6442 + pz * 0.7648 + 13.7
    px = rx + 7.3
  }
  return sum // ≈ [0, 1]
}

function insideSlab(x: number, z: number) {
  const dx = Math.abs(x) - (SLAB_W / 2 - SLAB_R)
  const dz = Math.abs(z) - (SLAB_H / 2 - SLAB_R)
  if (dx <= 0 || dz <= 0) {
    return Math.abs(x) <= SLAB_W / 2 && Math.abs(z) <= SLAB_H / 2
  }
  return dx * dx + dz * dz <= SLAB_R * SLAB_R
}

/** All field markings + both goals as one LineSegments position buffer. */
function buildMarkings(): Float32Array {
  const out: number[] = []
  const seg = (x1: number, z1: number, x2: number, z2: number) => {
    out.push(x1, LINE_Y, z1, x2, LINE_Y, z2)
  }
  const rect = (cx: number, hw: number, hh: number) => {
    seg(cx - hw, -hh, cx + hw, -hh)
    seg(cx + hw, -hh, cx + hw, hh)
    seg(cx + hw, hh, cx - hw, hh)
    seg(cx - hw, hh, cx - hw, -hh)
  }
  const arc = (
    cx: number,
    cz: number,
    r: number,
    a0: number,
    a1: number,
    n: number
  ) => {
    for (let i = 0; i < n; i++) {
      const t0 = a0 + ((a1 - a0) * i) / n
      const t1 = a0 + ((a1 - a0) * (i + 1)) / n
      seg(
        cx + r * Math.cos(t0),
        cz + r * Math.sin(t0),
        cx + r * Math.cos(t1),
        cz + r * Math.sin(t1)
      )
    }
  }

  // Touchlines, halfway line, center circle and spot.
  rect(0, PITCH_W / 2, PITCH_H / 2)
  seg(0, -PITCH_H / 2, 0, PITCH_H / 2)
  arc(0, 0, CIRCLE_R, 0, Math.PI * 2, 64)
  arc(0, 0, 0.025, 0, Math.PI * 2, 8)

  for (const side of [-1, 1]) {
    const goalLine = (side * PITCH_W) / 2
    // Penalty and goal areas (rectangles opening into the field).
    const penX = goalLine - (side * PEN_DEPTH) / 2
    rect(penX, PEN_DEPTH / 2, PEN_WIDTH / 2)
    const gaX = goalLine - (side * GOAL_AREA_DEPTH) / 2
    rect(gaX, GOAL_AREA_DEPTH / 2, GOAL_AREA_WIDTH / 2)
    // Penalty spot + arc ("the D") bulging toward midfield.
    const spotX = goalLine - side * SPOT_DIST
    arc(spotX, 0, 0.025, 0, Math.PI * 2, 8)
    const phi = Math.acos((PEN_DEPTH - SPOT_DIST) / CIRCLE_R)
    const mid = side > 0 ? Math.PI : 0
    arc(spotX, 0, CIRCLE_R, mid - phi, mid + phi, 20)

    // Goal: a wireframe box sitting behind the goal line.
    const x0 = goalLine
    const x1 = goalLine + side * GOAL_D
    const w = GOAL_W / 2
    const box = (x: number) => {
      out.push(x, 0, -w, x, GOAL_H, -w)
      out.push(x, 0, w, x, GOAL_H, w)
      out.push(x, GOAL_H, -w, x, GOAL_H, w)
      out.push(x, 0, -w, x, 0, w)
    }
    box(x0)
    box(x1)
    for (const zc of [-w, w]) {
      out.push(x0, 0, zc, x1, 0, zc)
      out.push(x0, GOAL_H, zc, x1, GOAL_H, zc)
    }
  }
  return Float32Array.from(out)
}

type Grid = {
  positions: Float32Array
  colors: Float32Array
  /** Static craggy detail per point. */
  crag: Float32Array
  /** Falloff to zero outside the touchlines, so mountains stay on the field. */
  envelope: Float32Array
  count: number
}

function buildGrid(density: number): Grid {
  const nx = density
  const nz = Math.round((density * SLAB_H) / SLAB_W)
  const positions: number[] = []
  const crag: number[] = []
  const envelope: number[] = []
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) {
      const x = (i / (nx - 1) - 0.5) * SLAB_W
      const z = (j / (nz - 1) - 0.5) * SLAB_H
      if (!insideSlab(x, z)) continue
      positions.push(x, 0, z)
      crag.push(ridgedFbm(x * 1.7 + 31.4, z * 1.7 + 17.9))
      const inX = PITCH_W / 2 - Math.abs(x)
      const inZ = PITCH_H / 2 - Math.abs(z)
      const m = Math.min(inX, inZ) / 0.55
      const c = Math.min(1, Math.max(0, m))
      envelope.push(c * c * (3 - 2 * c))
    }
  }
  const count = positions.length / 3
  return {
    positions: Float32Array.from(positions),
    colors: new Float32Array(count * 3),
    crag: Float32Array.from(crag),
    envelope: Float32Array.from(envelope),
    count,
  }
}

function Pitch({
  speed,
  height,
  density,
  colorA,
  colorB,
  theme,
}: {
  speed: number
  height: number
  density: number
  colorA: string
  colorB: string
  theme: ThemeMode
}) {
  const { bgColor, foregroundColor, borderColor, mutedColor, isDark } =
    useShadcnTheme(theme)
  const pointsRef = React.useRef<THREE.Points>(null)
  const tmpColor = React.useMemo(() => new THREE.Color(), [])
  const teamA = React.useMemo(() => new THREE.Color(colorA), [colorA])
  const teamB = React.useMemo(() => new THREE.Color(colorB), [colorB])
  const white = React.useMemo(() => new THREE.Color("#ffffff"), [])

  const grid = React.useMemo(() => buildGrid(density), [density])
  const markings = React.useMemo(() => buildMarkings(), [])

  const slabGeometry = React.useMemo(() => {
    const s = new THREE.Shape()
    const w = SLAB_W / 2
    const h = SLAB_H / 2
    const r = SLAB_R
    s.moveTo(-w + r, -h)
    s.lineTo(w - r, -h)
    s.absarc(w - r, -h + r, r, -Math.PI / 2, 0, false)
    s.lineTo(w, h - r)
    s.absarc(w - r, h - r, r, 0, Math.PI / 2, false)
    s.lineTo(-w + r, h)
    s.absarc(-w + r, h - r, r, Math.PI / 2, Math.PI, false)
    s.lineTo(-w, -h + r)
    s.absarc(-w + r, -h + r, r, Math.PI, Math.PI * 1.5, false)
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: SLAB_DEPTH,
      bevelEnabled: false,
    })
    geo.rotateX(-Math.PI / 2)
    geo.translate(0, -0.002, 0)
    return geo
  }, [])

  React.useEffect(() => {
    const current = slabGeometry
    return () => current.dispose()
  }, [slabGeometry])

  // The platform stays dark in both modes (a dark stage suits the momentum
  // mountains); in light mode it reads as a dark card on a light page, so the
  // lines/dots swap to the light end of the palette for contrast.
  const slabColor = React.useMemo(
    () =>
      isDark
        ? bgColor.clone().lerp(foregroundColor, 0.06)
        : foregroundColor.clone().lerp(bgColor, 0.12),
    [bgColor, foregroundColor, isDark]
  )
  const lineColor = isDark ? foregroundColor : bgColor
  const baseDotColor = isDark ? borderColor : mutedColor

  useFrame(({ clock }) => {
    const points = pointsRef.current
    if (!points) return
    const t = clock.getElapsedTime() * speed

    // Each team's momentum breathes on its own rhythm, and its mountain
    // wanders around its half — the front line between them keeps shifting.
    const sA = 0.675 + 0.325 * Math.sin(t * 0.29 + 1.3)
    const sB = 0.675 + 0.325 * Math.sin(t * 0.37 + 4.1)
    const cxA = -0.95 + 0.5 * Math.sin(t * 0.13)
    const czA = 0.5 * Math.sin(t * 0.21 + 2)
    const cxB = 0.95 + 0.5 * Math.sin(t * 0.17 + 0.7)
    const czB = 0.5 * Math.sin(t * 0.11 + 5)

    // Write through the live geometry attributes (they wrap grid's buffers).
    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute
    const colAttr = points.geometry.attributes.color as THREE.BufferAttribute
    const positions = posAttr.array as Float32Array
    const colors = colAttr.array as Float32Array
    const { crag, envelope, count } = grid
    for (let i = 0; i < count; i++) {
      const x = positions[i * 3]
      const z = positions[i * 3 + 2]
      const dA = (x - cxA) * (x - cxA) + (z - czA) * (z - czA) * Z_WEIGHT
      const dB = (x - cxB) * (x - cxB) + (z - czB) * (z - czB) * Z_WEIGHT
      const gA = sA * Math.exp(-dA * INV_2S2)
      const gB = sB * Math.exp(-dB * INV_2S2)

      const detail = 0.35 + 0.65 * crag[i]
      const shimmer = 1 + 0.04 * Math.sin(t * 1.3 + x * 1.9 + z * 2.4)
      const h = Math.max(gA, gB) * detail * envelope[i] * height * shimmer
      positions[i * 3 + 1] = h + 0.015

      // Blue where team A dominates, red where team B does; crests whiten.
      const total = gA + gB
      const mix = total > 1e-5 ? gB / total : 0.5
      const k = Math.min(1, Math.max(0, (mix - 0.5) * 3 + 0.5))
      tmpColor.copy(teamA).lerp(teamB, k)
      const lift = Math.min(1, h / (Math.max(height, 1e-5) * 0.75))
      tmpColor.lerpColors(
        baseDotColor,
        tmpColor,
        Math.min(1, 0.15 + 0.85 * Math.min(1, lift * 1.4))
      )
      const crest = Math.max(0, lift - 0.55) / 0.45
      tmpColor.lerp(white, Math.min(0.85, crest * crest * 0.85))
      colors[i * 3] = tmpColor.r
      colors[i * 3 + 1] = tmpColor.g
      colors[i * 3 + 2] = tmpColor.b
    }
    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
  })

  return (
    <group>
      <mesh geometry={slabGeometry} position={[0, -SLAB_DEPTH, 0]}>
        <meshStandardMaterial
          color={slabColor}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[markings, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={lineColor} transparent opacity={0.7} />
      </lineSegments>
      <points key={density} ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[grid.positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[grid.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.02} vertexColors sizeAttenuation />
      </points>
    </group>
  )
}

export type PitchMomentumProps = {
  /** Animation speed multiplier. */
  speed?: number
  /** Peak height of the momentum mountains. */
  height?: number
  /** Points across the platform's length (grid resolution). */
  density?: number
  /** Color of the first team's mountain. */
  colorA?: string
  /** Color of the second team's mountain. */
  colorB?: string
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A soccer pitch rendered as a dense field of dots, where two rival particle
 * mountains — one per team — surge, wander and clash as momentum swings.
 * Crests whiten where the fronts collide; the field markings and platform
 * follow your theme tokens.
 */
export function PitchMomentum({
  speed = 1,
  height = 1.7,
  density = 230,
  colorA = "#60a5fa",
  colorB = "#dc2626",
  className,
  theme = "auto",
  environment = "night",
}: PitchMomentumProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 3.9, 6]}
      fov={40}
    >
      <Pitch
        speed={speed}
        height={height}
        density={density}
        colorA={colorA}
        colorB={colorB}
        theme={theme}
      />
    </SceneContainer>
  )
}
