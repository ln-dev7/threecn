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

/** Total width of the row of pendulums. */
const WIDTH = 6
/** Height of the support bar the pendulums hang from. */
const TOP_Y = 1.7
/** Seconds for the whole pattern to drift out of phase and realign. */
const CYCLE = 26
/** Oscillations the slowest (longest) pendulum completes per cycle. */
const BASE_SWINGS = 7
const UP = new THREE.Vector3(0, 1, 0)

function Pendulums({
  count,
  speed,
  swing,
  theme,
}: {
  count: number
  speed: number
  swing: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor, mutedColor } = useShadcnTheme(theme)
  const bobsRef = React.useRef<THREE.InstancedMesh>(null)
  const stringsRef = React.useRef<THREE.InstancedMesh>(null)
  const dummy = React.useMemo(() => new THREE.Object3D(), [])
  const tmpColor = React.useMemo(() => new THREE.Color(), [])
  const tmpDir = React.useMemo(() => new THREE.Vector3(), [])

  // Pendulum i completes (BASE_SWINGS + i) oscillations per CYCLE, so the row
  // drifts through snakes and chaos before snapping back in phase. Lengths
  // follow real pendulum physics (L ∝ 1/f²), giving the descending cascade.
  const lengths = React.useMemo(
    () =>
      Array.from(
        { length: count },
        (_, i) => 3.1 * (BASE_SWINGS / (BASE_SWINGS + i)) ** 2
      ),
    [count]
  )

  const spacing = count > 1 ? WIDTH / (count - 1) : 0
  const bobRadius = Math.min(0.18, Math.max(0.09, spacing * 0.42))

  useFrame(({ clock }) => {
    const bobs = bobsRef.current
    const strings = stringsRef.current
    if (!bobs || !strings) return
    const t = clock.getElapsedTime() * speed
    const swingRad = (swing * Math.PI) / 180

    for (let i = 0; i < count; i++) {
      const f = (BASE_SWINGS + i) / CYCLE
      // cos → every pendulum starts released from its full amplitude, so the
      // row begins as one clean diagonal sweep.
      const angle = swingRad * Math.cos(2 * Math.PI * f * t)
      const x = -WIDTH / 2 + i * spacing
      const len = lengths[i]

      // Swing happens in the Z plane, perpendicular to the row.
      tmpDir.set(0, -Math.cos(angle), Math.sin(angle))
      dummy.position.set(x, TOP_Y, 0).addScaledVector(tmpDir, len)
      dummy.quaternion.identity()
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      bobs.setMatrixAt(i, dummy.matrix)
      const k = swingRad > 1e-4 ? angle / swingRad / 2 + 0.5 : 0.5
      tmpColor.copy(accentColor).lerp(primaryColor, k)
      bobs.setColorAt(i, tmpColor)

      // String: a thin rod from the pivot down to the bob.
      dummy.position.set(x, TOP_Y, 0).addScaledVector(tmpDir, len / 2)
      dummy.quaternion.setFromUnitVectors(UP, tmpDir)
      dummy.scale.set(1, len, 1)
      dummy.updateMatrix()
      strings.setMatrixAt(i, dummy.matrix)
    }

    bobs.instanceMatrix.needsUpdate = true
    strings.instanceMatrix.needsUpdate = true
    if (bobs.instanceColor) bobs.instanceColor.needsUpdate = true
  })

  return (
    <group position={[0, -0.2, 0]}>
      <mesh position={[0, TOP_Y, 0]}>
        <boxGeometry args={[WIDTH + 0.7, 0.09, 0.09]} />
        <meshStandardMaterial
          color={mutedColor}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
      <instancedMesh
        key={count}
        ref={stringsRef}
        args={[undefined, undefined, count]}
      >
        <cylinderGeometry args={[0.012, 0.012, 1, 6]} />
        <meshStandardMaterial color={mutedColor} roughness={0.6} />
      </instancedMesh>
      <instancedMesh
        key={`b${count}`}
        ref={bobsRef}
        args={[undefined, undefined, count]}
      >
        <sphereGeometry args={[bobRadius, 24, 24]} />
        <meshStandardMaterial roughness={0.25} metalness={0.45} />
      </instancedMesh>
    </group>
  )
}

export type PendulumWaveProps = {
  /** Number of pendulums in the row. */
  count?: number
  /** Time speed multiplier. */
  speed?: number
  /** Release amplitude in degrees. */
  swing?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * The classic pendulum-wave machine: a row of pendulums whose periods are
 * stepped so the line drifts into traveling snakes, mirrored arches and
 * apparent chaos before snapping back into one clean sweep. Bobs tint from
 * `--accent` to `--primary` across the swing.
 */
export function PendulumWave({
  count = 15,
  speed = 1,
  swing = 26,
  className,
  theme = "auto",
  environment = "studio",
}: PendulumWaveProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[3.2, 2.2, 6.8]}
      fov={38}
    >
      <Pendulums count={count} speed={speed} swing={swing} theme={theme} />
    </SceneContainer>
  )
}
