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

const RADIUS = 2.7

function seedPositions(count: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // Uniform-ish distribution inside a sphere.
    const r = Math.cbrt(Math.random()) * RADIUS * 0.92
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

function seedVelocities(count: number) {
  const velocities = new Float32Array(count * 3)
  for (let i = 0; i < velocities.length; i++) {
    velocities[i] = (Math.random() - 0.5) * 0.35
  }
  return velocities
}

function Graph({
  nodes,
  linkDistance,
  speed,
  theme,
}: {
  nodes: number
  linkDistance: number
  speed: number
  theme: ThemeMode
}) {
  const { primaryColor, mutedColor } = useShadcnTheme(theme)
  const groupRef = React.useRef<THREE.Group>(null)
  const pointGeoRef = React.useRef<THREE.BufferGeometry>(null)
  const lineGeoRef = React.useRef<THREE.BufferGeometry>(null)
  /** Node velocities, re-seeded whenever the position buffer is replaced. */
  const velocitiesRef = React.useRef<{
    key: THREE.BufferAttribute
    values: Float32Array
  } | null>(null)
  const tmpColor = React.useMemo(() => new THREE.Color(), [])

  const maxEdges = nodes * 8
  const positions = React.useMemo(() => seedPositions(nodes), [nodes])
  const linePositions = React.useMemo(
    () => new Float32Array(maxEdges * 6),
    [maxEdges]
  )
  const lineColors = React.useMemo(
    () => new Float32Array(maxEdges * 6),
    [maxEdges]
  )

  useFrame((_, delta) => {
    const pointGeo = pointGeoRef.current
    const lineGeo = lineGeoRef.current
    if (!pointGeo || !lineGeo) return

    const posAttr = pointGeo.getAttribute("position") as THREE.BufferAttribute
    const pos = posAttr.array as Float32Array
    if (!velocitiesRef.current || velocitiesRef.current.key !== posAttr) {
      velocitiesRef.current = { key: posAttr, values: seedVelocities(nodes) }
    }
    const vel = velocitiesRef.current.values

    const dt = Math.min(delta, 0.05) * speed
    const maxDist2 = linkDistance * linkDistance

    // Drift nodes, bounce softly on the sphere boundary.
    for (let i = 0; i < nodes; i++) {
      const ix = i * 3
      pos[ix] += vel[ix] * dt
      pos[ix + 1] += vel[ix + 1] * dt
      pos[ix + 2] += vel[ix + 2] * dt
      const len2 = pos[ix] ** 2 + pos[ix + 1] ** 2 + pos[ix + 2] ** 2
      if (len2 > RADIUS * RADIUS) {
        const len = Math.sqrt(len2)
        const nx = pos[ix] / len
        const ny = pos[ix + 1] / len
        const nz = pos[ix + 2] / len
        const dot = vel[ix] * nx + vel[ix + 1] * ny + vel[ix + 2] * nz
        vel[ix] -= 2 * dot * nx
        vel[ix + 1] -= 2 * dot * ny
        vel[ix + 2] -= 2 * dot * nz
      }
    }

    // Rebuild the edge list from scratch each frame.
    const linePos = lineGeo.getAttribute("position")
      .array as Float32Array
    const lineCol = lineGeo.getAttribute("color").array as Float32Array
    const capacity = linePos.length / 6
    let edge = 0
    for (let i = 0; i < nodes && edge < capacity; i++) {
      for (let j = i + 1; j < nodes && edge < capacity; j++) {
        const dx = pos[i * 3] - pos[j * 3]
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
        const d2 = dx * dx + dy * dy + dz * dz
        if (d2 > maxDist2) continue
        const strength = 1 - Math.sqrt(d2) / linkDistance
        tmpColor.copy(mutedColor).lerp(primaryColor, strength)
        const o = edge * 6
        linePos[o] = pos[i * 3]
        linePos[o + 1] = pos[i * 3 + 1]
        linePos[o + 2] = pos[i * 3 + 2]
        linePos[o + 3] = pos[j * 3]
        linePos[o + 4] = pos[j * 3 + 1]
        linePos[o + 5] = pos[j * 3 + 2]
        for (let k = 0; k < 2; k++) {
          lineCol[o + k * 3] = tmpColor.r
          lineCol[o + k * 3 + 1] = tmpColor.g
          lineCol[o + k * 3 + 2] = tmpColor.b
        }
        edge++
      }
    }

    posAttr.needsUpdate = true
    lineGeo.setDrawRange(0, edge * 2)
    lineGeo.getAttribute("position").needsUpdate = true
    lineGeo.getAttribute("color").needsUpdate = true
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.06 * speed
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={pointGeoRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={primaryColor}
          size={0.09}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={lineGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

export type NetworkGraphProps = {
  /** Number of nodes. */
  nodes?: number
  /** Max distance at which two nodes get linked. */
  linkDistance?: number
  /** Drift and rotation speed multiplier. */
  speed?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A living plexus: drifting nodes connect when they come close, and each link
 * fades from `--primary` (near) to `--muted-foreground` (far). Perfect for
 * AI, data and infrastructure heroes.
 */
export function NetworkGraph({
  nodes = 60,
  linkDistance = 1.4,
  speed = 1,
  className,
  theme = "auto",
  environment = "night",
}: NetworkGraphProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 7]}
      fov={45}
    >
      <Graph
        nodes={nodes}
        linkDistance={linkDistance}
        speed={speed}
        theme={theme}
      />
    </SceneContainer>
  )
}
