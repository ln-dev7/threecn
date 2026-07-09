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

// The golden angle (137.5°) — the divergence angle sunflowers, pinecones and
// succulents use to pack seeds without gaps.
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

function Bloom({
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
  const { primaryColor, accentColor } = useShadcnTheme(theme)
  const meshRef = React.useRef<THREE.InstancedMesh>(null)
  const groupRef = React.useRef<THREE.Group>(null)
  const dummy = React.useMemo(() => new THREE.Object3D(), [])
  const tmpColor = React.useMemo(() => new THREE.Color(), [])

  // Fixed polar layout per seed (angle + normalized radius), computed once.
  const seeds = React.useMemo(() => {
    const arr = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      arr[i * 2] = i * GOLDEN_ANGLE
      arr[i * 2 + 1] = Math.sqrt(i / count) // 0 at center → 1 at rim
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = clock.getElapsedTime() * speed

    for (let i = 0; i < count; i++) {
      const angle = seeds[i * 2]
      const rN = seeds[i * 2 + 1]
      const radius = rN * spread
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      // The whole disc breathes; outer petals lift a touch more.
      const y = Math.sin(t * 1.4 - rN * 6) * 0.25 * (0.4 + rN)

      dummy.position.set(x, y, z)
      // Petals tilt outward and face the sky, scaling down toward the rim.
      dummy.rotation.set(Math.PI / 2 - rN * 0.9, -angle, 0)
      const s = 0.12 + (1 - rN) * 0.16
      dummy.scale.set(s, s * 2.2, s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      // Center → --primary, rim → --accent.
      tmpColor.copy(primaryColor).lerp(accentColor, rN)
      mesh.setColorAt(i, tmpColor)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

    if (groupRef.current) groupRef.current.rotation.y = t * 0.15
  })

  return (
    <group ref={groupRef}>
      <instancedMesh
        key={count}
        ref={meshRef}
        args={[undefined, undefined, count]}
      >
        {/* A slim cone reads as a petal. */}
        <coneGeometry args={[0.5, 1, 5]} />
        <meshStandardMaterial roughness={0.35} metalness={0.2} />
      </instancedMesh>
    </group>
  )
}

export type PhyllotaxisProps = {
  /** Number of petals laid out on the spiral. */
  count?: number
  /** Breathing and rotation speed multiplier. */
  speed?: number
  /** Radius of the bloom. */
  spread?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A phyllotactic bloom: hundreds of instanced petals placed by the golden angle,
 * the way a sunflower packs its seeds. The disc breathes and slowly turns,
 * shading from `--primary` at the core to `--accent` at the rim — one draw call.
 */
export function Phyllotaxis({
  count = 520,
  speed = 1,
  spread = 3.2,
  className,
  theme = "auto",
  environment = "dawn",
}: PhyllotaxisProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 4.2, 5.5]}
      fov={38}
    >
      <Bloom count={count} speed={speed} spread={spread} theme={theme} />
    </SceneContainer>
  )
}
