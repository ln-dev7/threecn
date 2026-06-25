"use client"

import * as React from "react"
import { useFrame } from "@react-three/fiber"
import { ContactShadows, Float, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

import { SceneContainer } from "@/components/threecn/scene-container"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

type ShowcaseProps = {
  color?: string
  theme: ThemeMode
}

function Showcase({ color, theme }: ShowcaseProps) {
  const groupRef = React.useRef<THREE.Group>(null)
  const { primaryColor, accentColor, mutedColor, foregroundColor } =
    useShadcnTheme(theme)

  const productColor = React.useMemo(
    () => (color ? new THREE.Color(color) : primaryColor),
    [color, primaryColor]
  )

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.25
  })

  return (
    <group position={[0, -0.6, 0]}>
      {/* circular pedestal */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <cylinderGeometry args={[1.7, 1.85, 0.3, 64]} />
        <meshStandardMaterial color={accentColor} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.04, 64]} />
        <meshStandardMaterial color={mutedColor} metalness={0.2} roughness={0.8} />
      </mesh>

      {/* the "product": a small composed object */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={groupRef} position={[0, 1.05, 0]}>
          <mesh castShadow>
            <torusKnotGeometry args={[0.55, 0.19, 160, 24]} />
            <meshStandardMaterial
              color={productColor}
              emissive={productColor}
              emissiveIntensity={0.22}
              metalness={0.8}
              roughness={0.18}
            />
          </mesh>
          <mesh castShadow position={[0, 0, 0]}>
            <icosahedronGeometry args={[0.34, 0]} />
            <meshStandardMaterial
              color={foregroundColor}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </group>
      </Float>

      <ContactShadows
        position={[0, -0.28, 0]}
        opacity={0.45}
        scale={7}
        blur={2.6}
        far={4}
        resolution={512}
        color="#000000"
      />
    </group>
  )
}

export type ProductShowcaseProps = {
  /** Overrides the theme `--primary` color for the product. */
  color?: string
  className?: string
  theme?: ThemeMode
}

/**
 * A product composed of merged geometry resting on a circular pedestal under
 * soft contact shadows and studio lighting, with a slow auto-rotation.
 */
export function ProductShowcase({
  color,
  className,
  theme = "auto",
}: ProductShowcaseProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment="studio"
      camera={[0, 1.4, 5.5]}
      fov={42}
    >
      <Showcase color={color} theme={theme} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.05}
      />
    </SceneContainer>
  )
}
