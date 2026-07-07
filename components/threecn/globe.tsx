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

/** Evenly distribute `count` points on a unit sphere (Fibonacci sphere). */
function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    positions[i * 3] = Math.cos(theta) * r * radius
    positions[i * 3 + 1] = y * radius
    positions[i * 3 + 2] = Math.sin(theta) * r * radius
  }
  return positions
}

function GlobeMesh({
  dots,
  speed,
  size,
  theme,
}: {
  dots: number
  speed: number
  size: number
  theme: ThemeMode
}) {
  const groupRef = React.useRef<THREE.Group>(null)
  const { primaryColor, mutedColor } = useShadcnTheme(theme)
  const positions = React.useMemo(() => fibonacciSphere(dots, 2), [dots])

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25 * speed
  })

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0.15]}>
      {/* dotted surface */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={primaryColor}
          size={size}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>

      {/* faint inner sphere for depth */}
      <mesh>
        <sphereGeometry args={[1.97, 32, 32]} />
        <meshBasicMaterial color={mutedColor} transparent opacity={0.06} />
      </mesh>

      {/* orbit rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.006, 12, 120]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.6, 0]}>
        <torusGeometry args={[2.6, 0.005, 12, 120]} />
        <meshBasicMaterial color={mutedColor} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

export type GlobeProps = {
  /** Number of surface dots. */
  dots?: number
  /** Rotation speed multiplier. */
  speed?: number
  /** Dot size. */
  size?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A dotted globe rotating slowly, with two orbit rings. Dots use `--primary`,
 * rings blend `--primary` and `--muted-foreground`. Theme-aware and offline.
 */
export function Globe({
  dots = 1800,
  speed = 0.3,
  size = 0.035,
  className,
  theme = "auto",
  environment = "night",
}: GlobeProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 6]}
      fov={42}
    >
      <GlobeMesh dots={dots} speed={speed} size={size} theme={theme} />
    </SceneContainer>
  )
}
