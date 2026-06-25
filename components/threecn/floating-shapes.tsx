"use client"

import * as React from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

import {
  SceneContainer,
  type SceneContainerProps,
} from "@/components/threecn/scene-container"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

type Shape = {
  position: [number, number, number]
  scale: number
  kind: number
  colorKey: number
  speed: number
}

function seedShapes(count: number, spread: number): Shape[] {
  const shapes: Shape[] = []
  for (let i = 0; i < count; i++) {
    shapes.push({
      position: [
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
      ],
      scale: 0.35 + Math.random() * 0.55,
      kind: i % 4,
      colorKey: i % 3,
      speed: 0.6 + Math.random() * 1.2,
    })
  }
  return shapes
}

function Geometry({ kind }: { kind: number }) {
  switch (kind) {
    case 0:
      return <icosahedronGeometry args={[1, 0]} />
    case 1:
      return <octahedronGeometry args={[1, 0]} />
    case 2:
      return <dodecahedronGeometry args={[1, 0]} />
    default:
      return <tetrahedronGeometry args={[1, 0]} />
  }
}

function Shapes({
  count,
  spread,
  speed,
  theme,
}: {
  count: number
  spread: number
  speed: number
  theme: ThemeMode
}) {
  const groupRef = React.useRef<THREE.Group>(null)
  const { primaryColor, accentColor, foregroundColor } = useShadcnTheme(theme)
  const shapes = React.useMemo(() => seedShapes(count, spread), [count, spread])
  const palette = [primaryColor, accentColor, foregroundColor]

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    // subtle parallax toward the pointer
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.2,
      0.05
    )
  })

  return (
    <group ref={groupRef}>
      {shapes.map((s, i) => (
        <Float
          key={i}
          speed={s.speed * speed}
          rotationIntensity={1.2}
          floatIntensity={1.4}
        >
          <mesh position={s.position} scale={s.scale}>
            <Geometry kind={s.kind} />
            <meshStandardMaterial
              color={palette[s.colorKey]}
              emissive={primaryColor}
              emissiveIntensity={s.colorKey === 0 ? 0.25 : 0.05}
              metalness={0.55}
              roughness={0.25}
              flatShading
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

export type FloatingShapesProps = {
  /** Number of shapes. */
  count?: number
  /** How far the shapes spread from the center. */
  spread?: number
  /** Float animation speed multiplier. */
  speed?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A drifting cluster of low-poly shapes (icosa/octa/dodeca/tetra) that float,
 * rotate and react slightly to the pointer. Colors mix `--primary`, `--accent`
 * and `--foreground`. Self-contained and theme-aware.
 */
export function FloatingShapes({
  count = 12,
  spread = 5,
  speed = 1,
  className,
  theme = "auto",
  environment = "city",
}: FloatingShapesProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 9]}
      fov={45}
    >
      <Shapes count={count} spread={spread} speed={speed} theme={theme} />
    </SceneContainer>
  )
}
