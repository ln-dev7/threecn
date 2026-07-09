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

type Building = { x: number; z: number; h: number; shade: number }

function seedCity(size: number, density: number) {
  const base: Building[] = []
  const glow: Building[] = []
  const half = (size - 1) / 2
  for (let gx = 0; gx < size; gx++) {
    for (let gz = 0; gz < size; gz++) {
      if (Math.random() > density) continue
      const falloff =
        1 - Math.hypot(gx - half, gz - half) / Math.max(half * 1.45, 1)
      const h =
        0.25 + Math.pow(Math.random(), 1.8) * 2.6 * Math.max(0.2, falloff)
      const building: Building = {
        x: (gx - half) * 0.72,
        z: (gz - half) * 0.72,
        h,
        shade: Math.random(),
      }
      // A few towers glow with --primary, like lit offices at night.
      ;(Math.random() < 0.13 ? glow : base).push(building)
    }
  }
  return { base, glow }
}

function placeInstances(
  mesh: THREE.InstancedMesh | null,
  items: Building[],
  colorFor: (b: Building, target: THREE.Color) => THREE.Color
) {
  if (!mesh) return
  const dummy = new THREE.Object3D()
  const color = new THREE.Color()
  items.forEach((b, i) => {
    dummy.position.set(b.x, b.h / 2, b.z)
    dummy.scale.set(1, b.h, 1)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    mesh.setColorAt(i, colorFor(b, color))
  })
  mesh.instanceMatrix.needsUpdate = true
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
}

function City({
  size,
  density,
  speed,
  theme,
}: {
  size: number
  density: number
  speed: number
  theme: ThemeMode
}) {
  const { primaryColor, mutedColor, borderColor } = useShadcnTheme(theme)
  const groupRef = React.useRef<THREE.Group>(null)
  const baseRef = React.useRef<THREE.InstancedMesh>(null)
  const glowRef = React.useRef<THREE.InstancedMesh>(null)
  const glowMatRef = React.useRef<THREE.MeshStandardMaterial>(null)

  const { base, glow } = React.useMemo(
    () => seedCity(size, density),
    [size, density]
  )

  React.useLayoutEffect(() => {
    placeInstances(baseRef.current, base, (b, c) =>
      c.copy(borderColor).lerp(mutedColor, 0.25 + b.shade * 0.5)
    )
    placeInstances(glowRef.current, glow, (_, c) => c.copy(primaryColor))
  }, [base, glow, borderColor, mutedColor, primaryColor])

  useFrame(({ clock }, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.07 * speed
    if (glowMatRef.current) {
      glowMatRef.current.emissiveIntensity =
        1.1 + Math.sin(clock.getElapsedTime() * 1.6 * speed) * 0.45
      glowMatRef.current.emissive.copy(primaryColor)
    }
  })

  const radius = ((size - 1) / 2) * 0.72 + 1

  return (
    <group ref={groupRef}>
      {/* ground disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial
          color={borderColor}
          transparent
          opacity={0.35}
          roughness={0.9}
        />
      </mesh>
      <instancedMesh
        key={`base-${base.length}`}
        ref={baseRef}
        args={[undefined, undefined, Math.max(base.length, 1)]}
      >
        <boxGeometry args={[0.52, 1, 0.52]} />
        <meshStandardMaterial roughness={0.65} metalness={0.15} />
      </instancedMesh>
      <instancedMesh
        key={`glow-${glow.length}`}
        ref={glowRef}
        args={[undefined, undefined, Math.max(glow.length, 1)]}
      >
        <boxGeometry args={[0.52, 1, 0.52]} />
        <meshStandardMaterial
          ref={glowMatRef}
          roughness={0.35}
          metalness={0.2}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  )
}

export type IsoCityProps = {
  /** Blocks per side of the city grid. */
  size?: number
  /** Chance (0–1) that a lot gets a building. */
  density?: number
  /** Rotation and pulse speed multiplier. */
  speed?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A procedural isometric skyline that rotates slowly under fog. Most towers
 * take their tones from `--border` and `--muted-foreground`; a handful pulse
 * with `--primary` like lit offices at night.
 */
export function IsoCity({
  size = 14,
  density = 0.8,
  speed = 1,
  className,
  theme = "auto",
  environment = "night",
}: IsoCityProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[7.5, 5.5, 7.5]}
      fov={34}
      fog
    >
      <City size={size} density={density} speed={speed} theme={theme} />
    </SceneContainer>
  )
}
