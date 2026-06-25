"use client"

import * as React from "react"
import { useFrame } from "@react-three/fiber"
import { Center, Text3D as DreiText3D } from "@react-three/drei"
import * as THREE from "three"

import {
  SceneContainer,
  type SceneContainerProps,
} from "@/components/threecn/scene-container"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

/**
 * Default typeface (three.js `typeface.json` format), served from the jsDelivr
 * npm mirror so the scene works out of the box. To go fully offline, drop a
 * font JSON in `/public/fonts` and pass it via the `font` prop, e.g.
 * `font="/fonts/inter_bold.json"`.
 */
const DEFAULT_FONT =
  "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json"

type GlyphsProps = {
  text: string
  size: number
  depth: number
  font: string
  theme: ThemeMode
}

function Glyphs({ text, size, depth, font, theme }: GlyphsProps) {
  const groupRef = React.useRef<THREE.Group>(null)
  const { primaryColor, foregroundColor } = useShadcnTheme(theme)

  useFrame((state) => {
    const group = groupRef.current
    if (!group) return
    const t = state.clock.elapsedTime
    group.position.y = Math.sin(t * 0.9) * 0.12
    group.rotation.y = Math.sin(t * 0.4) * 0.18
    group.rotation.x = Math.cos(t * 0.3) * 0.06
  })

  return (
    <group ref={groupRef}>
      <Center>
        <DreiText3D
          font={font}
          size={size}
          height={depth}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.012}
          bevelSegments={4}
          letterSpacing={-0.02}
        >
          {text}
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.18}
            metalness={0.55}
            roughness={0.25}
          />
        </DreiText3D>
      </Center>
      <ambientLight color={foregroundColor} intensity={0.05} />
    </group>
  )
}

export type Text3DProps = {
  text: string
  size?: number
  depth?: number
  /** Path/URL to a three.js typeface JSON. Defaults to the bundled Inter Bold. */
  font?: string
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * Extruded, slowly floating 3D text rendered with drei's `<Text3D>`. The
 * glyph material uses your `--primary` color.
 */
export function Text3D({
  text,
  size = 1,
  depth = 0.3,
  font = DEFAULT_FONT,
  className,
  theme = "auto",
  environment = "studio",
}: Text3DProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 6]}
      fov={45}
    >
      <Glyphs
        text={text}
        size={size}
        depth={depth}
        font={font}
        theme={theme}
      />
    </SceneContainer>
  )
}
