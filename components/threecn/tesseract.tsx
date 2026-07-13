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

/** The 16 corners of a unit hypercube: every sign combination of (±1,±1,±1,±1). */
const VERTS4: [number, number, number, number][] = Array.from(
  { length: 16 },
  (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]
)

/** The 32 edges connect corners that differ in exactly one coordinate. */
const EDGES: [number, number][] = []
for (let i = 0; i < 16; i++) {
  for (let b = 0; b < 4; b++) {
    const j = i | (1 << b)
    if (j !== i) EDGES.push([i, j])
  }
}

/** Distance of the virtual 4D "camera" used for the w-perspective projection. */
const K = 3
/** Shrinks the projection so the swelling outer cell stays in frame. */
const BASE_SCALE = 0.62
const UP = new THREE.Vector3(0, 1, 0)

/**
 * Per-frame scratch for each corner's normalized 4D depth. Written in full,
 * then read, inside a single frame callback — safe to share at module level.
 */
const depths = new Float32Array(VERTS4.length)

function Hypercube({
  size,
  speed,
  thickness,
  theme,
}: {
  size: number
  speed: number
  thickness: number
  theme: ThemeMode
}) {
  const { primaryColor, accentColor } = useShadcnTheme(theme)
  const groupRef = React.useRef<THREE.Group>(null)
  const nodesRef = React.useRef<THREE.InstancedMesh>(null)
  const strutsRef = React.useRef<THREE.InstancedMesh>(null)
  const dummy = React.useMemo(() => new THREE.Object3D(), [])
  const tmpColor = React.useMemo(() => new THREE.Color(), [])
  const tmpDir = React.useMemo(() => new THREE.Vector3(), [])
  const points = React.useMemo(() => VERTS4.map(() => new THREE.Vector3()), [])

  useFrame(({ clock }) => {
    const nodes = nodesRef.current
    const struts = strutsRef.current
    const group = groupRef.current
    if (!nodes || !struts || !group) return
    const t = clock.getElapsedTime() * speed
    group.rotation.y = t * 0.16
    group.rotation.x = 0.32 + Math.sin(t * 0.2) * 0.12

    // Double rotation in two orthogonal 4D planes (XW and YZ) — the classic
    // tesseract motion where the inner cell turns itself inside out.
    const ca = Math.cos(t * 0.55)
    const sa = Math.sin(t * 0.55)
    const cb = Math.cos(t * 0.38)
    const sb = Math.sin(t * 0.38)

    for (let i = 0; i < VERTS4.length; i++) {
      const [x, y, z, w] = VERTS4[i]
      const x2 = x * ca - w * sa
      const w2 = x * sa + w * ca
      const y2 = y * cb - z * sb
      const z2 = y * sb + z * cb
      // Perspective projection along w: corners near the 4D camera grow.
      const s = K / (K - w2)
      points[i].set(x2, y2, z2).multiplyScalar(s * BASE_SCALE * size)
      depths[i] = (w2 + Math.SQRT2) / (2 * Math.SQRT2)

      dummy.position.copy(points[i])
      dummy.quaternion.identity()
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      nodes.setMatrixAt(i, dummy.matrix)
      tmpColor.copy(accentColor).lerp(primaryColor, depths[i])
      nodes.setColorAt(i, tmpColor)
    }

    for (let i = 0; i < EDGES.length; i++) {
      const a = points[EDGES[i][0]]
      const b = points[EDGES[i][1]]
      dummy.position.addVectors(a, b).multiplyScalar(0.5)
      tmpDir.subVectors(b, a)
      const len = tmpDir.length()
      dummy.quaternion.setFromUnitVectors(UP, tmpDir.divideScalar(len))
      dummy.scale.set(1, len, 1)
      dummy.updateMatrix()
      struts.setMatrixAt(i, dummy.matrix)
      const k = (depths[EDGES[i][0]] + depths[EDGES[i][1]]) / 2
      tmpColor.copy(accentColor).lerp(primaryColor, k)
      struts.setColorAt(i, tmpColor)
    }

    nodes.instanceMatrix.needsUpdate = true
    struts.instanceMatrix.needsUpdate = true
    if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true
    if (struts.instanceColor) struts.instanceColor.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, VERTS4.length]}
      >
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial roughness={0.25} metalness={0.5} />
      </instancedMesh>
      <instancedMesh
        key={thickness}
        ref={strutsRef}
        args={[undefined, undefined, EDGES.length]}
      >
        <cylinderGeometry args={[thickness, thickness, 1, 10]} />
        <meshStandardMaterial roughness={0.3} metalness={0.45} />
      </instancedMesh>
    </group>
  )
}

export type TesseractProps = {
  /** Overall projected scale of the hypercube. */
  size?: number
  /** Rotation speed multiplier (both the 4D and 3D spins). */
  speed?: number
  /** Strut radius. */
  thickness?: number
  className?: string
  theme?: ThemeMode
  environment?: SceneContainerProps["environment"]
}

/**
 * A 4D hypercube in double rotation, projected into 3D with w-perspective —
 * the inner cell endlessly swells through the outer one. Struts and corner
 * nodes shade from `--accent` to `--primary` by their depth in the 4th
 * dimension.
 */
export function Tesseract({
  size = 1,
  speed = 1,
  thickness = 0.05,
  className,
  theme = "auto",
  environment = "studio",
}: TesseractProps) {
  return (
    <SceneContainer
      className={className}
      theme={theme}
      environment={environment}
      camera={[0, 0, 7]}
      fov={40}
    >
      <Hypercube
        size={size}
        speed={speed}
        thickness={thickness}
        theme={theme}
      />
    </SceneContainer>
  )
}
