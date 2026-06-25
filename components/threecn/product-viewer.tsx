"use client"

import * as React from "react"
import { useFrame } from "@react-three/fiber"
import { OrbitControls, RoundedBox } from "@react-three/drei"
import * as THREE from "three"

import {
  SceneContainer,
  type SceneContainerProps,
} from "@/components/threecn/scene-container"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

type ProductProps = {
  autoRotate: boolean
  autoRotateSpeed: number
  theme: ThemeMode
}

function Product({ autoRotate, autoRotateSpeed, theme }: ProductProps) {
  const groupRef = React.useRef<THREE.Group>(null)
  const matRef = React.useRef<THREE.MeshStandardMaterial>(null)
  const [hovered, setHovered] = React.useState(false)
  const { primaryColor, accentColor, foregroundColor } = useShadcnTheme(theme)

  useFrame((_, delta) => {
    if (!groupRef.current || !autoRotate) return
    const target = hovered ? 0.15 : 1
    groupRef.current.rotation.y += delta * 0.4 * autoRotateSpeed * target
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      hovered ? 0.1 : 0.25,
      0.05
    )
  })

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
    >
      <RoundedBox args={[2.2, 2.2, 2.2]} radius={0.28} smoothness={6} castShadow>
        <meshStandardMaterial
          ref={matRef}
          color={accentColor}
          emissive={primaryColor}
          emissiveIntensity={hovered ? 0.55 : 0.3}
          metalness={0.65}
          roughness={0.22}
        />
      </RoundedBox>
      {/* subtle inner accent edge */}
      <RoundedBox args={[2.24, 2.24, 2.24]} radius={0.3} smoothness={6}>
        <meshStandardMaterial
          color={foregroundColor}
          transparent
          opacity={0.04}
          metalness={0.9}
          roughness={0.1}
          wireframe
        />
      </RoundedBox>
    </group>
  )
}

export type ProductViewerProps = {
  autoRotate?: boolean
  autoRotateSpeed?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A polished rounded volume that simulates a product. Drag to orbit; hovering
 * slows the auto-rotation. The material picks up your `--primary` as an
 * emissive tint and `--accent` as the base color.
 */
export function ProductViewer({
  autoRotate = true,
  autoRotateSpeed = 1,
  className,
  theme = "auto",
  environment = "studio",
}: ProductViewerProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[3, 2, 5]}
      fov={40}
    >
      <Product
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
        theme={theme}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </SceneContainer>
  )
}
