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

function Gem({
  speed,
  roughness,
  ior,
  theme,
}: {
  speed: number
  roughness: number
  ior: number
  theme: ThemeMode
}) {
  const groupRef = React.useRef<THREE.Group>(null)
  const { primaryColor, accentColor } = useShadcnTheme(theme)

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.4 * speed
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={groupRef}>
        {/* refractive faceted gem */}
        <mesh>
          <octahedronGeometry args={[1.6, 0]} />
          <meshPhysicalMaterial
            color={primaryColor}
            transmission={1}
            thickness={1.8}
            ior={ior}
            roughness={roughness}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.1}
            attenuationColor={primaryColor}
            attenuationDistance={2.5}
            transparent
          />
        </mesh>
        {/* glowing inner core */}
        <mesh scale={0.42}>
          <octahedronGeometry args={[1.6, 0]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={primaryColor}
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        {/* crisp edge highlight */}
        <lineSegments>
          <edgesGeometry args={[new THREE.OctahedronGeometry(1.62, 0)]} />
          <lineBasicMaterial color={primaryColor} transparent opacity={0.5} />
        </lineSegments>
      </group>
    </Float>
  )
}

export type CrystalProps = {
  /** Rotation speed multiplier. */
  speed?: number
  /** Surface roughness of the glass (0 = mirror-clear). */
  roughness?: number
  /** Index of refraction (how much light bends). */
  ior?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A faceted glass crystal with real refraction (physical transmission) and a
 * glowing inner core. Tinted with `--primary`. Self-contained and theme-aware.
 */
export function Crystal({
  speed = 1,
  roughness = 0.05,
  ior = 1.7,
  className,
  theme = "auto",
  environment = "studio",
}: CrystalProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 6]}
      fov={42}
    >
      <Gem speed={speed} roughness={roughness} ior={ior} theme={theme} />
    </SceneContainer>
  )
}
