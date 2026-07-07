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

function Ring({
  radius,
  tilt,
  speed,
  color,
  satellite,
}: {
  radius: number
  tilt: [number, number, number]
  speed: number
  color: THREE.Color
  satellite: THREE.Color
}) {
  const groupRef = React.useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += delta * speed
  })
  return (
    <group rotation={tilt}>
      <group ref={groupRef}>
        <mesh>
          <torusGeometry args={[radius, 0.012, 12, 160]} />
          <meshBasicMaterial color={color} transparent opacity={0.55} />
        </mesh>
        {/* orbiting satellite */}
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color={satellite}
            emissive={satellite}
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}

function HaloCore({
  rings,
  speed,
  glow,
  theme,
}: {
  rings: number
  speed: number
  glow: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor, mutedColor, foregroundColor } =
    useShadcnTheme(theme)
  const palette = [primaryColor, accentColor, mutedColor]

  const config = React.useMemo(
    () =>
      Array.from({ length: rings }, (_, i) => ({
        radius: 1.5 + i * 0.55,
        tilt: [
          Math.PI / 2 + (i - rings / 2) * 0.5,
          i * 0.7,
          i * 0.4,
        ] as [number, number, number],
        speed: (0.5 + i * 0.25) * (i % 2 ? -1 : 1),
        colorKey: i % 3,
      })),
    [rings]
  )

  return (
    <group>
      {/* glowing core */}
      <mesh>
        <sphereGeometry args={[0.65, 48, 48]} />
        <meshStandardMaterial
          color={foregroundColor}
          emissive={primaryColor}
          emissiveIntensity={glow}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={1.3}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.08} />
      </mesh>
      {config.map((r, i) => (
        <Ring
          key={i}
          radius={r.radius}
          tilt={r.tilt}
          speed={r.speed * speed}
          color={palette[r.colorKey]}
          satellite={i === 0 ? accentColor : primaryColor}
        />
      ))}
    </group>
  )
}

export type HaloProps = {
  /** Number of orbit rings. */
  rings?: number
  /** Orbit speed multiplier. */
  speed?: number
  /** Core glow intensity. */
  glow?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A glowing energy core wrapped by tilted orbit rings, each carrying a small
 * satellite. Colors blend `--primary`, `--accent` and `--muted-foreground`.
 */
export function Halo({
  rings = 3,
  speed = 1,
  glow = 1.6,
  className,
  theme = "auto",
  environment = "night",
}: HaloProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 1.2, 6]}
      fov={42}
    >
      <HaloCore rings={rings} speed={speed} glow={glow} theme={theme} />
    </SceneContainer>
  )
}
