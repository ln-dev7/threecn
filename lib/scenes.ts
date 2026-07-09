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
      {
        name: "size",
        type: "number",
        default: "0.045",
        description: "Particle size.",
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
      {
        name: "metalness",
        type: "number",
        default: "0.65",
        description: "Material metalness (0–1).",
      },
      {
        name: "roughness",
        type: "number",
        default: "0.22",
        description: "Material roughness (0–1).",
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
      {
        name: "metalness",
        type: "number",
        default: "0.8",
        description: "Product metalness (0–1).",
      },
      {
        name: "roughness",
        type: "number",
        default: "0.18",
        description: "Product roughness (0–1).",
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
      {
        name: "size",
        type: "number",
        default: "0.035",
        description: "Dot size.",
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
    slug: "crystal",
    name: "Crystal",
    componentName: "Crystal",
    title: "Crystal",
    description:
      "A faceted glass gem with real refraction and a glowing core, tinted with --primary.",
    props: [
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Rotation speed multiplier.",
      },
      {
        name: "roughness",
        type: "number",
        default: "0.05",
        description: "Glass surface roughness (0 = mirror-clear).",
      },
      {
        name: "ior",
        type: "number",
        default: "1.7",
        description: "Index of refraction (how much light bends).",
      },
      ...commonProps,
    ],
  },
  {
    slug: "halo",
    name: "Halo",
    componentName: "Halo",
    title: "Halo",
    description:
      "A glowing energy core wrapped by tilted orbit rings carrying satellites.",
    props: [
      {
        name: "rings",
        type: "number",
        default: "3",
        description: "Number of orbit rings.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Orbit speed multiplier.",
      },
      {
        name: "glow",
        type: "number",
        default: "1.6",
        description: "Core glow intensity.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "dna-helix",
    name: "DnaHelix",
    componentName: "DnaHelix",
    title: "DNA Helix",
    description:
      "A rotating double helix of spheres joined by rungs, colored with --primary and --accent.",
    props: [
      {
        name: "count",
        type: "number",
        default: "24",
        description: "Number of base pairs (nodes per strand).",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Rotation speed multiplier.",
      },
      {
        name: "radius",
        type: "number",
        default: "1.1",
        description: "Helix radius.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "vortex",
    name: "Vortex",
    componentName: "Vortex",
    title: "Vortex",
    description:
      "A spiral galaxy of points fading from --primary at the core to --muted-foreground at the rim.",
    props: [
      {
        name: "count",
        type: "number",
        default: "2200",
        description: "Number of points.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Rotation speed multiplier.",
      },
      {
        name: "arms",
        type: "number",
        default: "3",
        description: "Number of spiral arms.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "aurora-ribbons",
    name: "AuroraRibbons",
    componentName: "AuroraRibbons",
    title: "Aurora Ribbons",
    description:
      "Silky aurora ribbons drifting in slow sine waves, shaded from --primary to --accent.",
    props: [
      {
        name: "ribbons",
        type: "number",
        default: "5",
        description: "Number of ribbons.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Wave animation speed multiplier.",
      },
      {
        name: "amplitude",
        type: "number",
        default: "0.9",
        description: "Wave height.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "network-graph",
    name: "NetworkGraph",
    componentName: "NetworkGraph",
    title: "Network Graph",
    description:
      "A living plexus: drifting nodes link up when close, links fade from --primary to --muted-foreground.",
    props: [
      {
        name: "nodes",
        type: "number",
        default: "60",
        description: "Number of nodes.",
      },
      {
        name: "linkDistance",
        type: "number",
        default: "1.4",
        description: "Max distance at which two nodes get linked.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Drift and rotation speed multiplier.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "metaballs",
    name: "Metaballs",
    componentName: "Metaballs",
    title: "Metaballs",
    description:
      "A lava-lamp of liquid blobs that merge and split, surfaced with marching cubes and tinted --primary.",
    props: [
      {
        name: "blobs",
        type: "number",
        default: "6",
        description: "Number of blobs.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Animation speed multiplier.",
      },
      {
        name: "resolution",
        type: "number",
        default: "44",
        description: "Marching-cubes resolution (higher = smoother, heavier).",
      },
      {
        name: "roughness",
        type: "number",
        default: "0.18",
        description: "Surface roughness (0–1).",
      },
      ...commonProps,
    ],
  },
  {
    slug: "cube-wave",
    name: "CubeWave",
    componentName: "CubeWave",
    title: "Cube Wave",
    description:
      "A grid of instanced cubes riding a radial wave, blending --accent troughs into --primary crests.",
    props: [
      {
        name: "grid",
        type: "number",
        default: "16",
        description: "Cubes per side (total = grid²).",
      },
      {
        name: "gap",
        type: "number",
        default: "0.75",
        description: "Spacing between cube centers.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Wave speed multiplier.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "iso-city",
    name: "IsoCity",
    componentName: "IsoCity",
    title: "Iso City",
    description:
      "A procedural isometric skyline rotating under fog; a few towers pulse with --primary.",
    props: [
      {
        name: "size",
        type: "number",
        default: "14",
        description: "Blocks per side of the city grid.",
      },
      {
        name: "density",
        type: "number",
        default: "0.8",
        description: "Chance (0–1) that a lot gets a building.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Rotation and pulse speed multiplier.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "warp-tunnel",
    name: "WarpTunnel",
    componentName: "WarpTunnel",
    title: "Warp Tunnel",
    description:
      "Hyperspace star streaks racing past the camera, from --foreground heads to --primary tails.",
    props: [
      {
        name: "count",
        type: "number",
        default: "400",
        description: "Number of star streaks.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Warp speed multiplier.",
      },
      {
        name: "spread",
        type: "number",
        default: "7",
        description: "Tunnel radius.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "phyllotaxis",
    name: "Phyllotaxis",
    componentName: "Phyllotaxis",
    title: "Phyllotaxis",
    description:
      "A sunflower-style bloom of instanced petals placed by the golden angle, breathing from --primary at the core to --accent at the rim.",
    props: [
      {
        name: "count",
        type: "number",
        default: "520",
        description: "Number of petals on the spiral.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Breathing and rotation speed multiplier.",
      },
      {
        name: "spread",
        type: "number",
        default: "3.2",
        description: "Radius of the bloom.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "strange-attractor",
    name: "StrangeAttractor",
    componentName: "StrangeAttractor",
    title: "Strange Attractor",
    description:
      "The Aizawa attractor integrated live into one glowing orbit that never repeats, colored --primary to --accent with a sweeping head.",
    props: [
      {
        name: "points",
        type: "number",
        default: "6000",
        description: "Integration steps traced (path detail).",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Rotation and head speed multiplier.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "boids",
    name: "Boids",
    componentName: "Boids",
    title: "Boids",
    description:
      "A living flock steering by separation, alignment and cohesion; each agent tints --accent when slow to --primary at full speed.",
    props: [
      {
        name: "count",
        type: "number",
        default: "170",
        description: "Number of agents in the flock.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Flight speed multiplier.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "curl-flow",
    name: "CurlFlow",
    componentName: "CurlFlow",
    title: "Curl Flow",
    description:
      "Particles advected through a divergence-free curl-noise field into silky filaments, tinted --accent to --primary by height.",
    props: [
      {
        name: "count",
        type: "number",
        default: "2400",
        description: "Number of flowing particles.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Flow speed multiplier.",
      },
      {
        name: "size",
        type: "number",
        default: "0.04",
        description: "Particle size.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "cloth",
    name: "Cloth",
    componentName: "Cloth",
    title: "Cloth",
    description:
      "A real spring-mass cloth (Verlet) hanging from its top edge and rippling under procedural wind, with the theme woven --primary to --accent.",
    props: [
      {
        name: "segments",
        type: "number",
        default: "26",
        description: "Grid resolution per side (finer = heavier sim).",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Overall motion speed multiplier.",
      },
      {
        name: "wind",
        type: "number",
        default: "1",
        description: "Wind strength.",
      },
      ...commonProps,
    ],
  },
  {
    slug: "voronoi-shatter",
    name: "VoronoiShatter",
    componentName: "VoronoiShatter",
    title: "Voronoi Shatter",
    description:
      "A sphere fractured into Voronoi shards that drift apart and snap back together, each facet shading --accent to --primary by height.",
    props: [
      {
        name: "shards",
        type: "number",
        default: "26",
        description: "Number of Voronoi fragments.",
      },
      {
        name: "speed",
        type: "number",
        default: "1",
        description: "Explode/reassemble speed multiplier.",
      },
      {
        name: "spread",
        type: "number",
        default: "0.6",
        description: "How far the shards fly apart.",
      },
      ...commonProps,
    ],
  },
]

/** Raw registry item URLs (used to fetch published JSON). */
export const REGISTRY_BASE = "https://threecn.dev/r"

/** Namespace threecn is published under in the shadcn registry. */
export const REGISTRY_NAMESPACE = "@threecn"

/** The shadcn CLI reference for a scene, e.g. `@threecn/particle-field`. */
export function registryRef(slug: string) {
  return `${REGISTRY_NAMESPACE}/${slug}`
}

export function installCommand(slug: string) {
  return `npx shadcn@latest add ${registryRef(slug)}`
}

export function getScene(slug: string) {
  return SCENES.find((s) => s.slug === slug)
}
