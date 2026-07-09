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

const RADIUS = 1.6
const THICKNESS = 0.34

type Vec = [number, number, number]

type Shard = {
  geometry: THREE.BufferGeometry
  centroid: THREE.Vector3
  axis: THREE.Vector3
  spin: number
}

/** Evenly spread N points on a sphere (Fibonacci lattice) as fracture sites. */
function fibonacciSites(n: number) {
  const sites: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const t = golden * i
    sites.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r))
  }
  return sites
}

function pushTri(out: number[], a: Vec, b: Vec, c: Vec) {
  out.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2])
}

/**
 * Break an icosphere into Voronoi shards (faces assigned to their nearest
 * site), then give every shard real thickness by extruding it toward the
 * center — so each fragment reads as a solid chunk, not a paper-thin shell.
 */
function buildShards(count: number): Shard[] {
  const base = new THREE.IcosahedronGeometry(RADIUS, 3)
  const nonIndexed = base.toNonIndexed()
  base.dispose()
  const arr = (nonIndexed.getAttribute("position") as THREE.BufferAttribute)
    .array as Float32Array
  const sites = fibonacciSites(count)
  const buckets: number[][] = Array.from({ length: count }, () => [])
  const f = (RADIUS - THICKNESS) / RADIUS
  const c = new THREE.Vector3()

  for (let i = 0; i < arr.length; i += 9) {
    // Nearest fracture site for this face (by its normalized centroid).
    c.set(
      (arr[i] + arr[i + 3] + arr[i + 6]) / 3,
      (arr[i + 1] + arr[i + 4] + arr[i + 7]) / 3,
      (arr[i + 2] + arr[i + 5] + arr[i + 8]) / 3
    ).normalize()
    let best = 0
    let bestDot = -Infinity
    for (let s = 0; s < sites.length; s++) {
      const d = c.dot(sites[s])
      if (d > bestDot) {
        bestDot = d
        best = s
      }
    }
    const out = buckets[best]

    // Outer triangle (on the sphere) and its inward-extruded copy.
    const p: Vec[] = [
      [arr[i], arr[i + 1], arr[i + 2]],
      [arr[i + 3], arr[i + 4], arr[i + 5]],
      [arr[i + 6], arr[i + 7], arr[i + 8]],
    ]
    const q: Vec[] = p.map((v) => [v[0] * f, v[1] * f, v[2] * f])

    pushTri(out, p[0], p[1], p[2]) // outer face
    pushTri(out, q[0], q[2], q[1]) // inner face (reversed winding)
    // Side walls around the three edges.
    const edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 0],
    ]
    for (const [a, b] of edges) {
      pushTri(out, p[a], p[b], q[b])
      pushTri(out, p[a], q[b], q[a])
    }
  }
  nonIndexed.dispose()

  const shards: Shard[] = []
  for (const verts of buckets) {
    if (verts.length === 0) continue
    const data = Float32Array.from(verts)
    const centroid = new THREE.Vector3()
    for (let i = 0; i < data.length; i += 3) {
      centroid.x += data[i]
      centroid.y += data[i + 1]
      centroid.z += data[i + 2]
    }
    centroid.multiplyScalar(3 / data.length)
    // Recenter geometry on its centroid so the mesh can be positioned and
    // rotated about its own middle.
    for (let i = 0; i < data.length; i += 3) {
      data[i] -= centroid.x
      data[i + 1] -= centroid.y
      data[i + 2] -= centroid.z
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(data, 3))
    geometry.computeVertexNormals()
    shards.push({
      geometry,
      centroid,
      axis: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize(),
      spin: 0.5 + Math.random() * 1.1,
    })
  }
  return shards
}

function Shatter({
  shards: shardCount,
  speed,
  spread,
  theme,
}: {
  shards: number
  speed: number
  spread: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor } = useShadcnTheme(theme)
  const groupRef = React.useRef<THREE.Group>(null)

  const shards = React.useMemo(() => buildShards(shardCount), [shardCount])

  React.useEffect(() => {
    // Free GPU geometry when the shard set is rebuilt or unmounted.
    const current = shards
    return () => current.forEach((s) => s.geometry.dispose())
  }, [shards])

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return
    const t = clock.getElapsedTime() * speed
    // Breathe from fully assembled (0) to exploded (1) and back. The easing
    // lingers on the assembled sphere so the shatter reads clearly.
    const e = (Math.sin(t * 0.8) * 0.5 + 0.5) ** 1.6
    group.rotation.y = t * 0.12

    for (let i = 0; i < shards.length; i++) {
      const child = group.children[i] as THREE.Mesh | undefined
      if (!child) continue
      const s = shards[i]
      const grow = 1 + e * spread
      child.position.set(
        s.centroid.x * grow,
        s.centroid.y * grow,
        s.centroid.z * grow
      )
      // Absolute (not accumulated) rotation → identity when assembled.
      child.quaternion.setFromAxisAngle(s.axis, e * s.spin)
      const mat = child.material as THREE.MeshStandardMaterial
      mat.color
        .copy(accentColor)
        .lerp(primaryColor, s.centroid.y / (RADIUS * 2) + 0.5)
    }
  })

  return (
    <group ref={groupRef}>
      {shards.map((s, i) => (
        <mesh
          key={i}
          geometry={s.geometry}
          position={[s.centroid.x, s.centroid.y, s.centroid.z]}
        >
          <meshStandardMaterial
            roughness={0.32}
            metalness={0.3}
            side={THREE.DoubleSide}
            flatShading
          />
        </mesh>
      ))}
    </group>
  )
}

export type VoronoiShatterProps = {
  /** Number of Voronoi fragments. */
  shards?: number
  /** Explode/reassemble speed multiplier. */
  speed?: number
  /** How far the shards fly apart. */
  spread?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A solid sphere fractured into Voronoi shards that drift apart and snap back
 * together in a slow breath. Each fragment has real thickness, tumbles in
 * place, and shades from `--accent` to `--primary` by height.
 */
export function VoronoiShatter({
  shards = 24,
  speed = 1,
  spread = 0.7,
  className,
  theme = "auto",
  environment = "studio",
}: VoronoiShatterProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 6]}
      fov={42}
    >
      <Shatter shards={shards} speed={speed} spread={spread} theme={theme} />
    </SceneContainer>
  )
}
