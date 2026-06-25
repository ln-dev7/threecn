export type SceneProp = {
  name: string
  type: string
  default: string
  description: string
}

export type SceneMeta = {
  slug: string
  name: string
  title: string
  description: string
  /** import line shown in docs/grid */
  componentName: string
  props: SceneProp[]
}

const commonProps: SceneProp[] = [
  {
    name: "className",
    type: "string",
    default: "—",
    description: "Classes for the wrapper element (set its height here).",
  },
  {
    name: "theme",
    type: `"auto" | "light" | "dark"`,
    default: `"auto"`,
    description: "Color source. auto reads the live shadcn theme.",
  },
]

export const SCENES: SceneMeta[] = [
  {
    slug: "scene-container",
    name: "SceneContainer",
    componentName: "SceneContainer",
    title: "Scene Container",
    description:
      "The themed canvas wrapper every scene builds on: DPR, camera, lighting rig and fog.",
    props: [
      ...commonProps,
      {
        name: "environment",
        type: `"studio" | "city" | "dawn" | "night"`,
        default: `"studio"`,
        description: "Offline lighting rig preset (no HDRI downloads).",
      },
      {
        name: "fog",
        type: "boolean",
        default: "false",
        description: "Adds themed fog using --background.",
      },
      {
        name: "children",
        type: "ReactNode",
        default: "—",
        description: "Your 3D content (meshes, points, drei helpers).",
      },
    ],
  },
  {
    slug: "particle-field",
    name: "ParticleField",
    componentName: "ParticleField",
    title: "Particle Field",
    description:
      "A drifting cloud of particles colored with --primary and --muted-foreground.",
    props: [
      {
        name: "count",
        type: "number",
        default: "1500",
        description: "Number of particles.",
      },
      {
        name: "speed",
        type: "number",
        default: "0.3",
        description: "Drift and rotation speed multiplier.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "product-viewer",
    name: "ProductViewer",
    componentName: "ProductViewer",
    title: "Product Viewer",
    description:
      "A polished rounded volume with orbit controls; hover slows the spin. Emissive --primary tint.",
    props: [
      {
        name: "autoRotate",
        type: "boolean",
        default: "true",
        description: "Auto-rotate the object.",
      },
      {
        name: "autoRotateSpeed",
        type: "number",
        default: "1",
        description: "Rotation speed multiplier.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "floating-card-3d",
    name: "FloatingCard3D",
    componentName: "FloatingCard3D",
    title: "Floating Card 3D",
    description:
      "A card that tilts toward the cursor with spring smoothing. --background surface, --border edges.",
    props: [
      {
        name: "tiltStrength",
        type: "number",
        default: "15",
        description: "Max tilt in degrees.",
      },
      {
        name: "children",
        type: "ReactNode",
        default: "—",
        description: "HTML overlaid on the card via drei <Html>.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "text-3d",
    name: "Text3D",
    componentName: "Text3D",
    title: "Text 3D",
    description:
      "Extruded, slowly floating 3D text using drei <Text3D>, colored with --primary.",
    props: [
      {
        name: "text",
        type: "string",
        default: "(required)",
        description: "The string to extrude.",
      },
      {
        name: "size",
        type: "number",
        default: "1",
        description: "Glyph size.",
      },
      {
        name: "depth",
        type: "number",
        default: "0.3",
        description: "Extrusion depth.",
      },
      {
        name: "font",
        type: "string",
        default: "Helvetiker Bold (CDN)",
        description: "Path/URL to a three.js typeface JSON.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "product-showcase",
    name: "ProductShowcase",
    componentName: "ProductShowcase",
    title: "Product Showcase",
    description:
      "A product on a circular pedestal under soft contact shadows and studio lighting.",
    props: [
      {
        name: "color",
        type: "string",
        default: "—",
        description: "Overrides the theme --primary for the product.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "globe",
    name: "Globe",
    componentName: "Globe",
    title: "Globe",
    description:
      "A dotted globe rotating slowly with orbit rings, colored with --primary.",
    props: [
      {
        name: "dots",
        type: "number",
        default: "1800",
        description: "Number of surface dots.",
      },
      {
        name: "speed",
        type: "number",
        default: "0.3",
        description: "Rotation speed multiplier.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "wave-terrain",
    name: "WaveTerrain",
    componentName: "WaveTerrain",
    title: "Wave Terrain",
    description:
      "An undulating wireframe terrain in perspective, drawn with --primary.",
    props: [
      {
        name: "amplitude",
        type: "number",
        default: "0.6",
        description: "Peak height of the waves.",
      },
      {
        name: "speed",
        type: "number",
        default: "0.6",
        description: "Animation speed multiplier.",
      },
      {
        name: "density",
        type: "number",
        default: "48",
        description: "Grid resolution (segments per side).",
      },
      ...commonProps,
    ],
  },
  {
    slug: "floating-shapes",
    name: "FloatingShapes",
    componentName: "FloatingShapes",
    title: "Floating Shapes",
    description:
      "A drifting cluster of low-poly shapes that float and react to the pointer.",
    props: [
      {
        name: "count",
        type: "number",
        default: "12",
        description: "Number of shapes.",
      },
      {
        name: "spread",
        type: "number",
        default: "5",
        description: "How far shapes spread from the center.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Float animation speed multiplier.",
      },
      ...commonProps,
    ],
  },
]

export const REGISTRY_BASE = "https://threecn.dev/r"

export function installCommand(slug: string) {
  return `npx shadcn add ${REGISTRY_BASE}/${slug}.json`
}

export function getScene(slug: string) {
  return SCENES.find((s) => s.slug === slug)
}
