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

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    vec3 color = mix(uColorA, uColorB, vUv.x);
    float along = sin(vUv.x * 3.14159265);
    float edge = sin(vUv.y * 3.14159265);
    float alpha = along * pow(edge, 1.6) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`

function Ribbon({
  index,
  total,
  speed,
  amplitude,
  colorA,
  colorB,
  isDark,
}: {
  index: number
  total: number
  speed: number
  amplitude: number
  colorA: THREE.Color
  colorB: THREE.Color
  isDark: boolean
}) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  const materialRef = React.useRef<THREE.ShaderMaterial>(null)
  /** Pristine plane Y positions, captured on the first frame. */
  const baseYRef = React.useRef<Float32Array | null>(null)

  const phase = (index / total) * Math.PI * 2
  const zOffset = (index - (total - 1) / 2) * 0.7
  const yOffset = (index - (total - 1) / 2) * 0.3

  const uniforms = React.useMemo(
    () => ({
      uColorA: { value: new THREE.Color() },
      uColorB: { value: new THREE.Color() },
      uOpacity: { value: 0.55 },
    }),
    []
  )

  useFrame(({ clock }) => {
    const mesh = meshRef.current
    const material = materialRef.current
    if (!mesh || !material) return

    const t = clock.getElapsedTime() * speed
    const pos = mesh.geometry.getAttribute("position") as THREE.BufferAttribute

    if (!baseYRef.current || baseYRef.current.length !== pos.count) {
      const base = new Float32Array(pos.count)
      for (let i = 0; i < pos.count; i++) base[i] = pos.getY(i)
      baseYRef.current = base
    }
    const baseY = baseYRef.current

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const wave =
        Math.sin(x * 0.5 + t * 0.8 + phase) * amplitude +
        Math.sin(x * 0.85 - t * 0.5 + phase * 1.7) * amplitude * 0.35
      pos.setY(i, baseY[i] + wave + yOffset)
      pos.setZ(i, Math.cos(x * 0.35 + t * 0.35 + phase) * 0.5)
    }
    pos.needsUpdate = true
    ;(material.uniforms.uColorA.value as THREE.Color).copy(colorA)
    ;(material.uniforms.uColorB.value as THREE.Color).copy(colorB)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, zOffset]}>
      <planeGeometry args={[14, 1.1, 128, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </mesh>
  )
}

function Ribbons({
  ribbons,
  speed,
  amplitude,
  theme,
}: {
  ribbons: number
  speed: number
  amplitude: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor, mutedColor, isDark } =
    useShadcnTheme(theme)

  return (
    <group rotation={[-0.12, 0, 0]}>
      {Array.from({ length: ribbons }, (_, i) => (
        <Ribbon
          key={i}
          index={i}
          total={ribbons}
          speed={speed}
          amplitude={amplitude}
          colorA={primaryColor}
          colorB={i % 2 ? mutedColor : accentColor}
          isDark={isDark}
        />
      ))}
    </group>
  )
}

export type AuroraRibbonsProps = {
  /** Number of ribbons. */
  ribbons?: number
  /** Wave animation speed multiplier. */
  speed?: number
  /** Wave height. */
  amplitude?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * Silky aurora ribbons drifting in slow sine waves, shaded with a custom
 * gradient from `--primary` to `--accent`. Additive glow in dark mode.
 */
export function AuroraRibbons({
  ribbons = 5,
  speed = 1,
  amplitude = 0.9,
  className,
  theme = "auto",
  environment = "night",
}: AuroraRibbonsProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0.4, 7.5]}
      fov={38}
    >
      <Ribbons
        ribbons={ribbons}
        speed={speed}
        amplitude={amplitude}
        theme={theme}
      />
    </SceneContainer>
  )
}
