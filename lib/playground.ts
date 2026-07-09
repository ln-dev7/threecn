import type { SceneSlug } from "@/components/threecn/scene-by-slug"

export type Control =
  | {
      kind: "slider"
      prop: string
      label: string
      min: number
      max: number
      step: number
      unit?: string
    }
  | {
      kind: "select"
      prop: string
      label: string
      options: { value: string; label: string }[]
    }
  | { kind: "switch"; prop: string; label: string }
  | { kind: "text"; prop: string; label: string }
  | { kind: "color"; prop: string; label: string }

export type PlaygroundConfig = {
  /** Default prop values, also the playground's initial state. */
  defaults: Record<string, unknown>
  /** Interactive controls bound to props. */
  controls: Control[]
  /** Runtime npm dependencies for this scene. */
  dependencies: string[]
}

const ENV_OPTIONS = [
  { value: "studio", label: "Studio" },
  { value: "city", label: "City" },
  { value: "dawn", label: "Dawn" },
  { value: "night", label: "Night" },
]

const R3F_DEPS = ["three", "@react-three/fiber", "@react-three/drei"]

export const PLAYGROUNDS: Record<SceneSlug, PlaygroundConfig> = {
  "scene-container": {
    defaults: { environment: "dawn", fog: false },
    controls: [
      {
        kind: "select",
        prop: "environment",
        label: "Environment",
        options: ENV_OPTIONS,
      },
      { kind: "switch", prop: "fog", label: "Fog" },
    ],
    dependencies: R3F_DEPS,
  },
  "particle-field": {
    defaults: { count: 1500, speed: 0.3, size: 0.045, environment: "night" },
    controls: [
      {
        kind: "slider",
        prop: "count",
        label: "Count",
        min: 300,
        max: 3000,
        step: 100,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 1.5,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "size",
        label: "Particle size",
        min: 0.01,
        max: 0.12,
        step: 0.005,
      },
      {
        kind: "select",
        prop: "environment",
        label: "Environment",
        options: ENV_OPTIONS,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "product-viewer": {
    defaults: {
      autoRotate: true,
      autoRotateSpeed: 1,
      metalness: 0.65,
      roughness: 0.22,
      environment: "studio",
    },
    controls: [
      { kind: "switch", prop: "autoRotate", label: "Auto-rotate" },
      {
        kind: "slider",
        prop: "autoRotateSpeed",
        label: "Rotate speed",
        min: 0.2,
        max: 3,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "metalness",
        label: "Metalness",
        min: 0,
        max: 1,
        step: 0.05,
      },
      {
        kind: "slider",
        prop: "roughness",
        label: "Roughness",
        min: 0,
        max: 1,
        step: 0.05,
      },
      {
        kind: "select",
        prop: "environment",
        label: "Environment",
        options: ENV_OPTIONS,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "floating-card-3d": {
    defaults: { tiltStrength: 15, environment: "city" },
    controls: [
      {
        kind: "slider",
        prop: "tiltStrength",
        label: "Tilt",
        min: 0,
        max: 40,
        step: 1,
        unit: "°",
      },
      {
        kind: "select",
        prop: "environment",
        label: "Environment",
        options: ENV_OPTIONS,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "text-3d": {
    defaults: { text: "threecn", size: 0.9, depth: 0.3 },
    controls: [
      { kind: "text", prop: "text", label: "Text" },
      {
        kind: "slider",
        prop: "size",
        label: "Size",
        min: 0.4,
        max: 1.6,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "depth",
        label: "Depth",
        min: 0.05,
        max: 0.8,
        step: 0.05,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "product-showcase": {
    defaults: { color: "#7c3aed", metalness: 0.8, roughness: 0.18 },
    controls: [
      { kind: "color", prop: "color", label: "Product color" },
      {
        kind: "slider",
        prop: "metalness",
        label: "Metalness",
        min: 0,
        max: 1,
        step: 0.05,
      },
      {
        kind: "slider",
        prop: "roughness",
        label: "Roughness",
        min: 0,
        max: 1,
        step: 0.05,
      },
    ],
    dependencies: R3F_DEPS,
  },
  globe: {
    defaults: { dots: 1800, speed: 0.3, size: 0.035 },
    controls: [
      {
        kind: "slider",
        prop: "dots",
        label: "Dots",
        min: 600,
        max: 3500,
        step: 100,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.05,
        max: 1.5,
        step: 0.05,
      },
      {
        kind: "slider",
        prop: "size",
        label: "Dot size",
        min: 0.01,
        max: 0.1,
        step: 0.005,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "wave-terrain": {
    defaults: { amplitude: 0.6, speed: 0.6, density: 48 },
    controls: [
      {
        kind: "slider",
        prop: "amplitude",
        label: "Amplitude",
        min: 0.1,
        max: 1.5,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 2,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "density",
        label: "Density",
        min: 16,
        max: 96,
        step: 8,
      },
    ],
    dependencies: R3F_DEPS,
  },
  crystal: {
    defaults: { speed: 1, roughness: 0.05, ior: 1.7 },
    controls: [
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "roughness",
        label: "Roughness",
        min: 0,
        max: 0.4,
        step: 0.01,
      },
      {
        kind: "slider",
        prop: "ior",
        label: "IOR",
        min: 1,
        max: 2.5,
        step: 0.05,
      },
    ],
    dependencies: R3F_DEPS,
  },
  halo: {
    defaults: { rings: 3, speed: 1, glow: 1.6 },
    controls: [
      {
        kind: "slider",
        prop: "rings",
        label: "Rings",
        min: 2,
        max: 6,
        step: 1,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "glow",
        label: "Glow",
        min: 0.3,
        max: 3,
        step: 0.1,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "dna-helix": {
    defaults: { count: 24, speed: 1, radius: 1.1 },
    controls: [
      {
        kind: "slider",
        prop: "count",
        label: "Base pairs",
        min: 12,
        max: 40,
        step: 1,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "radius",
        label: "Radius",
        min: 0.6,
        max: 1.6,
        step: 0.1,
      },
    ],
    dependencies: R3F_DEPS,
  },
  vortex: {
    defaults: { count: 2200, speed: 1, arms: 3 },
    controls: [
      {
        kind: "slider",
        prop: "count",
        label: "Count",
        min: 600,
        max: 4000,
        step: 100,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      { kind: "slider", prop: "arms", label: "Arms", min: 2, max: 6, step: 1 },
    ],
    dependencies: R3F_DEPS,
  },
  "aurora-ribbons": {
    defaults: { ribbons: 5, speed: 1, amplitude: 0.9 },
    controls: [
      {
        kind: "slider",
        prop: "ribbons",
        label: "Ribbons",
        min: 2,
        max: 9,
        step: 1,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "amplitude",
        label: "Amplitude",
        min: 0.2,
        max: 1.8,
        step: 0.1,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "network-graph": {
    defaults: { nodes: 60, linkDistance: 1.4, speed: 1 },
    controls: [
      {
        kind: "slider",
        prop: "nodes",
        label: "Nodes",
        min: 20,
        max: 140,
        step: 5,
      },
      {
        kind: "slider",
        prop: "linkDistance",
        label: "Link distance",
        min: 0.6,
        max: 2.4,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
    ],
    dependencies: R3F_DEPS,
  },
  metaballs: {
    defaults: { blobs: 6, speed: 1, resolution: 44, roughness: 0.18 },
    controls: [
      {
        kind: "slider",
        prop: "blobs",
        label: "Blobs",
        min: 2,
        max: 10,
        step: 1,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "resolution",
        label: "Smoothness",
        min: 24,
        max: 72,
        step: 4,
      },
      {
        kind: "slider",
        prop: "roughness",
        label: "Roughness",
        min: 0,
        max: 1,
        step: 0.05,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "cube-wave": {
    defaults: { grid: 16, gap: 0.75, speed: 1 },
    controls: [
      {
        kind: "slider",
        prop: "grid",
        label: "Grid",
        min: 8,
        max: 26,
        step: 2,
      },
      {
        kind: "slider",
        prop: "gap",
        label: "Gap",
        min: 0.65,
        max: 1.2,
        step: 0.05,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "iso-city": {
    defaults: { size: 14, density: 0.8, speed: 1 },
    controls: [
      {
        kind: "slider",
        prop: "size",
        label: "City size",
        min: 8,
        max: 22,
        step: 2,
      },
      {
        kind: "slider",
        prop: "density",
        label: "Density",
        min: 0.3,
        max: 1,
        step: 0.05,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Speed",
        min: 0.1,
        max: 3,
        step: 0.1,
      },
    ],
    dependencies: R3F_DEPS,
  },
  "warp-tunnel": {
    defaults: { count: 400, speed: 1, spread: 7 },
    controls: [
      {
        kind: "slider",
        prop: "count",
        label: "Streaks",
        min: 100,
        max: 900,
        step: 50,
      },
      {
        kind: "slider",
        prop: "speed",
        label: "Warp speed",
        min: 0.2,
        max: 4,
        step: 0.1,
      },
      {
        kind: "slider",
        prop: "spread",
        label: "Spread",
        min: 3,
        max: 12,
        step: 0.5,
      },
    ],
    dependencies: R3F_DEPS,
  },
}
