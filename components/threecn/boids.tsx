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

const BOUND = 4.2
const PERCEPTION = 1.4
const SEPARATION = 0.7
const MAX_SPEED = 2.2

type Swarm = { pos: Float32Array; vel: Float32Array }

function seedSwarm(count: number): Swarm {
  const pos = new Float32Array(count * 3)
  const vel = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = Math.cbrt(Math.random()) * BOUND * 0.7
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    pos[i * 3 + 2] = r * Math.cos(phi)
    vel[i * 3] = (Math.random() - 0.5) * 2
    vel[i * 3 + 1] = (Math.random() - 0.5) * 2
    vel[i * 3 + 2] = (Math.random() - 0.5) * 2
  }
  return { pos, vel }
}

function Flock({
  count,
  speed,
  theme,
}: {
  count: number
  speed: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor } = useShadcnTheme(theme)
  const meshRef = React.useRef<THREE.InstancedMesh>(null)
  const swarmRef = React.useRef<Swarm | null>(null)

  // The swarm is mutated every frame, so it lives in a ref (never read during
  // render). Seed it whenever the agent count changes.
  React.useLayoutEffect(() => {
    swarmRef.current = seedSwarm(count)
  }, [count])

  const dummy = React.useMemo(() => new THREE.Object3D(), [])
  const tmpColor = React.useMemo(() => new THREE.Color(), [])
  const up = React.useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const dir = React.useMemo(() => new THREE.Vector3(), [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    const swarm = swarmRef.current
    if (!mesh || !swarm) return
    const dt = Math.min(delta, 0.05) * speed
    const { pos, vel } = swarm

    for (let i = 0; i < count; i++) {
      const io = i * 3
      const px = pos[io]
      const py = pos[io + 1]
      const pz = pos[io + 2]

      let ax = 0
      let ay = 0
      let az = 0 // alignment
      let cx = 0
      let cy = 0
      let cz = 0 // cohesion
      let sx = 0
      let sy = 0
      let sz = 0 // separation
      let n = 0

      for (let j = 0; j < count; j++) {
        if (j === i) continue
        const jo = j * 3
        const dx = pos[jo] - px
        const dy = pos[jo + 1] - py
        const dz = pos[jo + 2] - pz
        const dist2 = dx * dx + dy * dy + dz * dz
        if (dist2 > PERCEPTION * PERCEPTION) continue
        n++
        ax += vel[jo]
        ay += vel[jo + 1]
        az += vel[jo + 2]
        cx += pos[jo]
        cy += pos[jo + 1]
        cz += pos[jo + 2]
        if (dist2 < SEPARATION * SEPARATION) {
          const inv = 1 / (Math.sqrt(dist2) + 1e-5)
          sx -= dx * inv
          sy -= dy * inv
          sz -= dz * inv
        }
      }

      let vx = vel[io]
      let vy = vel[io + 1]
      let vz = vel[io + 2]

      if (n > 0) {
        // Alignment + cohesion + separation, gently weighted.
        vx += (ax / n - vx) * 0.04 + (cx / n - px) * 0.012 + sx * 0.9
        vy += (ay / n - vy) * 0.04 + (cy / n - py) * 0.012 + sy * 0.9
        vz += (az / n - vz) * 0.04 + (cz / n - pz) * 0.012 + sz * 0.9
      }

      // Steer back toward the center when leaving the sphere.
      const rad = Math.sqrt(px * px + py * py + pz * pz)
      if (rad > BOUND) {
        const k = (rad - BOUND) * 0.05
        vx -= (px / rad) * k
        vy -= (py / rad) * k
        vz -= (pz / rad) * k
      }

      // Clamp speed.
      const sp = Math.sqrt(vx * vx + vy * vy + vz * vz) || 1e-5
      if (sp > MAX_SPEED) {
        const s = MAX_SPEED / sp
        vx *= s
        vy *= s
        vz *= s
      }

      vel[io] = vx
      vel[io + 1] = vy
      vel[io + 2] = vz
      pos[io] = px + vx * dt
      pos[io + 1] = py + vy * dt
      pos[io + 2] = pz + vz * dt

      // Orient the cone along the velocity and place it.
      dir.set(vx, vy, vz).normalize()
      dummy.position.set(pos[io], pos[io + 1], pos[io + 2])
      dummy.quaternion.setFromUnitVectors(up, dir)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      // Slow = --accent, fast = --primary.
      tmpColor.copy(accentColor).lerp(primaryColor, sp / MAX_SPEED)
      mesh.setColorAt(i, tmpColor)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh
      key={count}
      ref={meshRef}
      args={[undefined, undefined, count]}
    >
      <coneGeometry args={[0.09, 0.34, 6]} />
      <meshStandardMaterial roughness={0.35} metalness={0.3} />
    </instancedMesh>
  )
}

export type BoidsProps = {
  /** Number of agents in the flock. */
  count?: number
  /** Flight speed multiplier. */
  speed?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A living flock: hundreds of instanced agents steering by Reynolds's three
 * rules — separation, alignment, cohesion — with a soft pull back to center.
 * Each boid tints from `--accent` when slow to `--primary` at full speed.
 * One draw call.
 */
export function Boids({
  count = 170,
  speed = 1,
  className,
  theme = "auto",
  environment = "night",
}: BoidsProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 9]}
      fov={45}
    >
      <Flock count={count} speed={speed} theme={theme} />
    </SceneContainer>
  )
}
