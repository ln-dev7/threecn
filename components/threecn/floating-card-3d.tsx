"use client"

import * as React from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Html, RoundedBox } from "@react-three/drei"
import * as THREE from "three"

import {
  SceneContainer,
  type SceneContainerProps,
} from "@/components/threecn/scene-container"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

type CardProps = {
  tiltStrength: number
  theme: ThemeMode
  children?: React.ReactNode
}

function Card({ tiltStrength, theme, children }: CardProps) {
  const groupRef = React.useRef<THREE.Group>(null)
  const { bgColor, borderColor, primaryColor } = useShadcnTheme(theme)
  const size = useThree((s) => s.size)
  const maxTilt = THREE.MathUtils.degToRad(tiltStrength)

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return
    // pointer is normalized to [-1, 1]; spring toward the target tilt.
    const targetY = state.pointer.x * maxTilt
    const targetX = -state.pointer.y * maxTilt
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.08)
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetX, 0.08)
    group.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06
  })

  const aspect = size.width / Math.max(size.height, 1)
  const cardW = aspect > 1 ? 3.4 : 2.6
  const cardH = 2.1

  return (
    <group ref={groupRef}>
      {/* border / backplate */}
      <RoundedBox args={[cardW + 0.08, cardH + 0.08, 0.06]} radius={0.12} smoothness={5} position={[0, 0, -0.04]}>
        <meshStandardMaterial color={borderColor} metalness={0.3} roughness={0.6} />
      </RoundedBox>
      {/* card surface */}
      <RoundedBox args={[cardW, cardH, 0.08]} radius={0.1} smoothness={5}>
        <meshStandardMaterial
          color={bgColor}
          emissive={primaryColor}
          emissiveIntensity={0.04}
          metalness={0.2}
          roughness={0.45}
        />
      </RoundedBox>
      {children ? (
        <Html
          transform
          distanceFactor={2.6}
          position={[0, 0, 0.06]}
          className="pointer-events-none select-none"
          style={{ width: `${cardW * 110}px` }}
        >
          {children}
        </Html>
      ) : null}
    </group>
  )
}

export type FloatingCard3DProps = {
  tiltStrength?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
  children?: React.ReactNode
}

/**
 * A flat card floating in 3D space that tilts toward the cursor with spring
 * smoothing. The surface uses `--background` with `--border` edges. Pass
 * `children` to overlay real HTML on the card via drei's `<Html>`.
 */
export function FloatingCard3D({
  tiltStrength = 15,
  className,
  theme = "auto",
  environment = "city",
  children,
}: FloatingCard3DProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 5]}
      fov={42}
    >
      <Card tiltStrength={tiltStrength} theme={theme}>
        {children}
      </Card>
    </SceneContainer>
  )
}
