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
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = golden * i
    sites.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r))
  }
  return sites
}

/** Break an icosphere into Voronoi shards by assigning faces to nearest site. */
function buildShards(count: number): Shard[] {
  const base = new THREE.IcosahedronGeometry(RADIUS, 4)
  const nonIndexed = base.toNonIndexed()
  base.dispose()
  const pos = nonIndexed.getAttribute("position") as THREE.BufferAttribute
  const arr = pos.array as Float32Array
  const sites = fibonacciSites(count)
  const buckets: number[][] = Array.from({ length: count }, () => [])

  // Triangle = 3 vertices = 9 floats. Assign each to its nearest site.
  const c = new THREE.Vector3()
  for (let f = 0; f < arr.length; f += 9) {
    c.set(
      (arr[f] + arr[f + 3] + arr[f + 6]) / 3,
      (arr[f + 1] + arr[f + 4] + arr[f + 7]) / 3,
      (arr[f + 2] + arr[f + 5] + arr[f + 8]) / 3
    )
    c.normalize()
    let best = 0
    let bestDot = -Infinity
    for (let s = 0; s < sites.length; s++) {
      const d = c.dot(sites[s])
      if (d > bestDot) {
        bestDot = d
        best = s
      }
    }
    for (let k = 0; k < 9; k++) buckets[best].push(arr[f + k])
  }
  nonIndexed.dispose()

  const shards: Shard[] = []
  for (const verts of buckets) {
    if (verts.length === 0) continue
    const data = Float32Array.from(verts)
    // Centroid of this shard.
    const centroid = new THREE.Vector3()
    for (let i = 0; i < data.length; i += 3) {
      centroid.x += data[i]
      centroid.y += data[i + 1]
      centroid.z += data[i + 2]
    }
    centroid.multiplyScalar(3 / data.length)
    // Recenter geometry on its own centroid so it tumbles in place.
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
      spin: 0.4 + Math.random() * 0.8,
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
    return () => shards.forEach((s) => s.geometry.dispose())
  }, [shards])

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return
    const t = clock.getElapsedTime() * speed
    // Breathe from assembled (0) to exploded (1) and back.
    const e = (Math.sin(t * 0.9) * 0.5 + 0.5) ** 1.5
    group.rotation.y = t * 0.15

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
      child.rotateOnAxis(s.axis, s.spin * e * 0.05)
      const mat = child.material as THREE.MeshStandardMaterial
      mat.color
        .copy(accentColor)
        .lerp(primaryColor, s.centroid.y / RADIUS / 2 + 0.5)
    }
  })

  return (
    <group ref={groupRef}>
      {shards.map((s, i) => (
        <mesh key={i} geometry={s.geometry}>
          <meshStandardMaterial roughness={0.3} metalness={0.35} flatShading />
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
 * A sphere fractured into Voronoi shards that drift apart and snap back
 * together in a slow breath, each facet catching the light and shading from
 * `--accent` to `--primary` by height.
 */
export function VoronoiShatter({
  shards = 26,
  speed = 1,
  spread = 0.6,
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
