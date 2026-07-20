"use client"

import * as React from "react"
import { useFrame } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import * as THREE from "three"

import {
  SceneContainer,
  type SceneContainerProps,
} from "@/components/threecn/scene-container"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

/* ------------------------------------------------------------------ */
/* Proportions (scene units). The real trophy: a draped column pinched */
/* at the waist, two figures with raised arms, a globe resting in the  */
/* upstretched hands, all on a stepped base with two green bands.      */
/* ------------------------------------------------------------------ */

const GLOBE_R = 0.62
const GLOBE_Y = 2.45 // globe center; its lower third nests into the hands
const BODY_TOP = 2.05
/** Vertical shift so the whole piece sits centered on the origin. */
const CENTER_Y = -1.28

/**
 * Silhouette of the body as (radius, height) control points, bottom to top:
 * a draped skirt narrowing to the waist, then swelling through the figures'
 * chests and opening where the arms rise to meet the globe.
 */
const PROFILE: [number, number][] = [
  [0.45, 0.0],
  [0.36, 0.1],
  [0.29, 0.28],
  [0.24, 0.52],
  [0.215, 0.85], // waist
  [0.24, 1.15],
  [0.3, 1.4],
  [0.38, 1.62],
  [0.45, 1.8],
  [0.49, 1.95],
  [0.45, BODY_TOP], // curls back in right under the globe
]

const BODY_ROWS = 200
const BODY_COLS = 160

/* ----------------------------- noise ------------------------------ */

function hash3(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return s - Math.floor(s)
}

/** Trilinear value noise in [0, 1]. */
function vnoise3(x: number, y: number, z: number) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const iz = Math.floor(z)
  const fx = x - ix
  const fy = y - iy
  const fz = z - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const uz = fz * fz * (3 - 2 * fz)
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const c00 = lerp(hash3(ix, iy, iz), hash3(ix + 1, iy, iz), ux)
  const c10 = lerp(hash3(ix, iy + 1, iz), hash3(ix + 1, iy + 1, iz), ux)
  const c01 = lerp(hash3(ix, iy, iz + 1), hash3(ix + 1, iy, iz + 1), ux)
  const c11 = lerp(hash3(ix, iy + 1, iz + 1), hash3(ix + 1, iy + 1, iz + 1), ux)
  return lerp(lerp(c00, c10, uy), lerp(c01, c11, uy), uz)
}

function fbm3(x: number, y: number, z: number) {
  let sum = 0
  let amp = 0.5
  let freq = 1
  for (let o = 0; o < 4; o++) {
    sum += amp * vnoise3(x * freq + o * 7.3, y * freq + o * 3.1, z * freq)
    amp *= 0.5
    freq *= 2.1
  }
  return sum // ≈ [0, 1]
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

/* --------------------------- geometry ----------------------------- */

/**
 * The draped body. On top of the lathe profile: a front/back swell for the
 * two figures (they stand back to back along ±z), spiraling drapery folds,
 * and fine sculptural noise so the gold reads as cast metal, not plastic.
 */
function buildBody(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3(
    PROFILE.map(([r, y]) => new THREE.Vector3(r, y, 0))
  )
  const positions = new Float32Array(BODY_ROWS * BODY_COLS * 3)

  for (let i = 0; i < BODY_ROWS; i++) {
    const t = i / (BODY_ROWS - 1)
    const p = curve.getPoint(t)
    const r0 = p.x
    const y = p.y

    // Figures' torsos: strongest at chest height, gone at foot and rim.
    const figEnv = Math.exp(-Math.pow((y - 1.35) / 0.5, 2))
    // Drapery folds live on the skirt and waist, fading toward the arms.
    const foldEnv =
      smoothstep(0.02, 0.2, y) * (1 - 0.75 * smoothstep(1.2, 1.9, y))

    for (let j = 0; j < BODY_COLS; j++) {
      const a = (j / BODY_COLS) * Math.PI * 2
      const sa = Math.sin(a)

      // Two-lobed cross-section → the figures' bodies front and back.
      let r = r0 * (1 + 0.18 * figEnv * sa * sa)
      // Spiraling folds (two frequencies, opposite twists) + cast-metal grain.
      r +=
        foldEnv *
        (0.038 * Math.sin(9 * a + y * 1.6 + 0.8) +
          0.022 * Math.sin(15 * a - y * 2.2 + 3.1))
      r +=
        foldEnv *
        0.03 *
        (fbm3(Math.cos(a) * 1.8, y * 1.3, sa * 1.8) - 0.5)

      const k = (i * BODY_COLS + j) * 3
      positions[k] = r * Math.cos(a)
      positions[k + 1] = y
      positions[k + 2] = r * sa
    }
  }

  const index: number[] = []
  for (let i = 0; i < BODY_ROWS - 1; i++) {
    for (let j = 0; j < BODY_COLS; j++) {
      const a = i * BODY_COLS + j
      const b = i * BODY_COLS + ((j + 1) % BODY_COLS)
      const c = (i + 1) * BODY_COLS + j
      const d = (i + 1) * BODY_COLS + ((j + 1) % BODY_COLS)
      index.push(a, c, b, b, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geo.setIndex(index)
  geo.computeVertexNormals()
  return geo
}

/**
 * The globe: continents raised in relief from procedural noise, oceans
 * hatched with fine latitude striations — like the engraved original.
 */
function buildGlobe(): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(GLOBE_R, 144, 104)
  const pos = geo.attributes.position as THREE.BufferAttribute
  const dir = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    dir.fromBufferAttribute(pos, i).normalize()
    const land = fbm3(dir.x * 1.6 + 4.2, dir.y * 1.6, dir.z * 1.6 + 9.7)
    const mask = smoothstep(0.5, 0.57, land)
    const relief =
      mask * (0.035 + 0.04 * fbm3(dir.x * 6, dir.y * 6 + 2.4, dir.z * 6))
    const lat = Math.asin(Math.min(1, Math.max(-1, dir.y)))
    const hatch = (1 - mask) * 0.0045 * Math.sin(lat * 46)
    const r = GLOBE_R + relief + hatch
    pos.setXYZ(i, dir.x * r, dir.y * r, dir.z * r)
  }
  geo.computeVertexNormals()
  return geo
}

/**
 * One raised arm as a curve from shoulder up to the globe's widest flank,
 * so the hands visibly cradle the ball like the original.
 */
function armCurve(sx: number, sz: number): THREE.CatmullRomCurve3 {
  const ex = Math.sign(sx) * 0.585
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(sx, 1.48, sz),
    new THREE.Vector3(sx * 1.8, 1.85, sz * 0.9),
    new THREE.Vector3(ex * 1.02, 2.18, sz * 0.55),
    new THREE.Vector3(ex, 2.42, sz * 0.5),
  ])
}

/** Shoulder anchors: front figure (+z) and back figure (−z), two arms each. */
const ARMS: [number, number][] = [
  [-0.26, 0.2],
  [0.26, 0.2],
  [-0.26, -0.2],
  [0.26, -0.2],
]

/** Stepped base: gold foot, wide green band, gold ring, green band, gold cap. */
const BASE_STEPS: {
  yTop: number
  h: number
  rTop: number
  rBottom: number
  green: boolean
}[] = [
  { yTop: -0.44, h: 0.08, rTop: 0.72, rBottom: 0.82, green: false },
  { yTop: -0.28, h: 0.16, rTop: 0.6, rBottom: 0.72, green: true },
  { yTop: -0.2, h: 0.08, rTop: 0.57, rBottom: 0.6, green: false },
  { yTop: -0.08, h: 0.12, rTop: 0.5, rBottom: 0.57, green: true },
  { yTop: 0.02, h: 0.1, rTop: 0.44, rBottom: 0.5, green: false },
]

/* --------------------------- confetti ----------------------------- */

function Confetti({
  count,
  speed,
  colors,
}: {
  count: number
  speed: number
  colors: THREE.Color[]
}) {
  const ref = React.useRef<THREE.Points>(null)

  const { positions, colorBuf, vy, sway } = React.useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colorBuf = new Float32Array(count * 3)
    const vy = new Float32Array(count)
    const sway = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Deterministic scatter (no Math.random — keeps SSR/replay stable).
      const h = (n: number) => {
        const s = Math.sin(n) * 43758.5453
        return s - Math.floor(s)
      }
      positions[i * 3] = (h(i * 1.7) - 0.5) * 4.2
      positions[i * 3 + 1] = h(i * 2.3) * 5 - 0.5
      positions[i * 3 + 2] = (h(i * 3.1) - 0.5) * 3
      const c = colors[i % colors.length]
      colorBuf[i * 3] = c.r
      colorBuf[i * 3 + 1] = c.g
      colorBuf[i * 3 + 2] = c.b
      vy[i] = 0.35 + h(i * 5.9) * 0.6
      sway[i] = h(i * 7.3) * Math.PI * 2
    }
    return { positions, colorBuf, vy, sway }
  }, [count, colors])

  useFrame(({ clock }, delta) => {
    const pts = ref.current
    if (!pts) return
    const t = clock.getElapsedTime()
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    for (let i = 0; i < count; i++) {
      let y = arr[i * 3 + 1] - vy[i] * speed * delta
      if (y < -2.4) y = 4.6
      arr[i * 3 + 1] = y
      arr[i * 3] += Math.sin(t * 1.5 + sway[i]) * 0.004 * speed
    }
    attr.needsUpdate = true
  })

  return (
    <points key={count} ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorBuf, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors sizeAttenuation transparent opacity={0.9} />
    </points>
  )
}

/* ---------------------------- trophy ------------------------------ */

function Trophy({
  speed,
  gold,
  confetti,
  theme,
}: {
  speed: number
  gold: string
  confetti: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor, foregroundColor, bgColor } =
    useShadcnTheme(theme)
  const groupRef = React.useRef<THREE.Group>(null)

  const bodyGeo = React.useMemo(() => buildBody(), [])
  const globeGeo = React.useMemo(() => buildGlobe(), [])
  const armGeos = React.useMemo(
    () =>
      ARMS.map(
        ([sx, sz]) => new THREE.TubeGeometry(armCurve(sx, sz), 28, 0.065, 10)
      ),
    []
  )
  const hands = React.useMemo(
    () => ARMS.map(([sx, sz]) => armCurve(sx, sz).getPoint(1)),
    []
  )
  React.useEffect(() => {
    return () => {
      bodyGeo.dispose()
      globeGeo.dispose()
      armGeos.forEach((g) => g.dispose())
    }
  }, [bodyGeo, globeGeo, armGeos])

  const goldColor = React.useMemo(() => new THREE.Color(gold), [gold])
  // Emerald bands, nudged toward the theme background so the trophy settles
  // on the page instead of floating.
  const greenColor = React.useMemo(
    () => new THREE.Color("#0e6b3d").lerp(bgColor, 0.08),
    [bgColor]
  )
  const confettiColors = React.useMemo(
    () => [
      goldColor,
      primaryColor.clone(),
      accentColor.clone(),
      foregroundColor.clone(),
    ],
    [goldColor, primaryColor, accentColor, foregroundColor]
  )

  const goldMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        metalness: 1,
        roughness: 0.28,
        envMapIntensity: 1.2,
        emissiveIntensity: 0.05,
        side: THREE.DoubleSide,
      }),
    []
  )
  const greenMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        metalness: 0.25,
        roughness: 0.35,
        envMapIntensity: 0.45,
      }),
    []
  )
  React.useEffect(() => {
    goldMat.color.copy(goldColor)
    goldMat.emissive.copy(goldColor)
    greenMat.color.copy(greenColor)
  }, [goldMat, greenMat, goldColor, greenColor])
  React.useEffect(() => {
    return () => {
      goldMat.dispose()
      greenMat.dispose()
    }
  }, [goldMat, greenMat])

  useFrame(({ clock }) => {
    const g = groupRef.current
    if (!g) return
    const t = clock.getElapsedTime()
    g.rotation.y = t * 0.3 * speed
    g.position.y = CENTER_Y + Math.sin(t * 0.8) * 0.04
  })

  return (
    <>
      {/* Local, CDN-free reflections so the gold reads as metal. */}
      <Environment resolution={128} frames={1}>
        <Lightformer
          intensity={2.4}
          position={[0, 3, 3]}
          scale={[7, 7, 1]}
          color="#fff6e0"
        />
        <Lightformer
          intensity={1.4}
          position={[-4, 1, -2]}
          scale={[5, 5, 1]}
          color="#ffd98a"
        />
        <Lightformer
          intensity={1}
          position={[4, -1, 1]}
          scale={[4, 4, 1]}
          color="#ffffff"
        />
      </Environment>

      <group ref={groupRef} position={[0, CENTER_Y, 0]}>
        {/* Draped body with the two figures. */}
        <mesh geometry={bodyGeo} material={goldMat} />

        {/* Raised arms and hands cradling the globe. */}
        {armGeos.map((geo, i) => (
          <mesh key={i} geometry={geo} material={goldMat} />
        ))}
        {hands.map((p, i) => (
          <mesh key={i} position={p} material={goldMat}>
            <sphereGeometry args={[0.085, 16, 12]} />
          </mesh>
        ))}

        {/* Continent-embossed globe. */}
        <mesh geometry={globeGeo} material={goldMat} position={[0, GLOBE_Y, 0]} />

        {/* Stepped base: gold foot, two green bands, gold ring between. */}
        {BASE_STEPS.map((s, i) => (
          <mesh
            key={i}
            position={[0, s.yTop - s.h / 2, 0]}
            material={s.green ? greenMat : goldMat}
          >
            <cylinderGeometry args={[s.rTop, s.rBottom, s.h, 72]} />
          </mesh>
        ))}
      </group>

      {confetti > 0 ? (
        <Confetti count={confetti} speed={speed} colors={confettiColors} />
      ) : null}
    </>
  )
}

export type WorldCupProps = {
  /** Rotation and confetti speed multiplier. */
  speed?: number
  /** Color of the gold. */
  gold?: string
  /** Number of falling confetti particles (0 disables them). */
  confetti?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * The World Cup trophy, modeled procedurally after the original: two sculpted
 * figures rising back to back from a draped, spiraling column, arms raised to
 * hold a continent-embossed globe, on a stepped base with two green bands.
 * It turns slowly under studio light amid a drift of confetti, the confetti
 * and base tinted from your shadcn theme.
 */
export function WorldCup({
  speed = 1,
  gold = "#e3b23c",
  confetti = 90,
  className,
  theme = "auto",
  environment = "studio",
}: WorldCupProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0.35, 7]}
      fov={40}
    >
      <Trophy speed={speed} gold={gold} confetti={confetti} theme={theme} />
    </SceneContainer>
  )
}
