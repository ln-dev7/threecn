"use client"

import * as React from "react"
import { Canvas } from "@react-three/fiber"

import { cn } from "@/lib/utils"
import {
  useShadcnTheme,
  type ThemeMode,
} from "@/components/hooks/use-shadcn-theme"

export type EnvironmentPreset = "studio" | "city" | "dawn" | "night"

type LightRig = {
  ambient: { color: string; intensity: number }
  key: { color: string; intensity: number; position: [number, number, number] }
  fill: { color: string; intensity: number; position: [number, number, number] }
  rim: { color: string; intensity: number; position: [number, number, number] }
}

/**
 * Offline lighting rigs. We avoid drei's <Environment preset> because it
 * fetches HDRIs from a CDN — scenes must work with zero external assets.
 */
const RIGS: Record<EnvironmentPreset, LightRig> = {
  studio: {
    ambient: { color: "#ffffff", intensity: 0.6 },
    key: { color: "#ffffff", intensity: 2.2, position: [5, 6, 5] },
    fill: { color: "#dfe3ff", intensity: 0.8, position: [-6, 2, 4] },
    rim: { color: "#ffffff", intensity: 1.4, position: [0, 4, -6] },
  },
  city: {
    ambient: { color: "#c7d2fe", intensity: 0.7 },
    key: { color: "#e0e7ff", intensity: 1.8, position: [4, 7, 4] },
    fill: { color: "#a5b4fc", intensity: 0.9, position: [-5, 1, 5] },
    rim: { color: "#818cf8", intensity: 1.2, position: [-2, 3, -6] },
  },
  dawn: {
    ambient: { color: "#fde2c8", intensity: 0.5 },
    key: { color: "#ffb27a", intensity: 2.0, position: [6, 4, 4] },
    fill: { color: "#9fb4ff", intensity: 0.7, position: [-5, 2, 4] },
    rim: { color: "#ffd9a8", intensity: 1.0, position: [0, 5, -5] },
  },
  night: {
    ambient: { color: "#1e1b4b", intensity: 0.4 },
    key: { color: "#a78bfa", intensity: 1.6, position: [4, 5, 4] },
    fill: { color: "#4338ca", intensity: 0.6, position: [-5, 1, 4] },
    rim: { color: "#7c3aed", intensity: 1.6, position: [-2, 3, -6] },
  },
}

function Rig({
  preset,
  fog,
  theme,
}: {
  preset: EnvironmentPreset
  fog: boolean
  theme: ThemeMode
}) {
  const { bgColor } = useShadcnTheme(theme)
  const rig = RIGS[preset]

  return (
    <>
      {fog ? <fog attach="fog" args={[bgColor.getHex(), 8, 24]} /> : null}
      <ambientLight color={rig.ambient.color} intensity={rig.ambient.intensity} />
      <directionalLight
        color={rig.key.color}
        intensity={rig.key.intensity}
        position={rig.key.position}
      />
      <directionalLight
        color={rig.fill.color}
        intensity={rig.fill.intensity}
        position={rig.fill.position}
      />
      <pointLight
        color={rig.rim.color}
        intensity={rig.rim.intensity * 12}
        position={rig.rim.position}
        distance={30}
      />
    </>
  )
}

export type SceneContainerProps = {
  className?: string
  theme?: ThemeMode
  environment?: EnvironmentPreset
  fog?: boolean
  /** Camera position, defaults to a gentle 3/4 view. */
  camera?: [number, number, number]
  /** Vertical field of view. */
  fov?: number
  children?: React.ReactNode
  /** Rendered as an HTML overlay above the canvas (not inside the 3D scene). */
  overlay?: React.ReactNode
}

/**
 * The canvas wrapper every threecn scene builds on. Sets up a transparent
 * canvas (so your CSS background shows through), responsive DPR, a themed
 * lighting rig and optional fog.
 */
export function SceneContainer({
  className,
  theme = "auto",
  environment = "studio",
  fog = false,
  camera = [0, 0, 6],
  fov = 45,
  children,
  overlay,
}: SceneContainerProps) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: camera, fov, near: 0.1, far: 100 }}
      >
        <Rig preset={environment} fog={fog} theme={theme} />
        <React.Suspense fallback={null}>{children}</React.Suspense>
      </Canvas>
      {overlay ? <div className="pointer-events-none absolute inset-0">{overlay}</div> : null}
    </div>
  )
}
