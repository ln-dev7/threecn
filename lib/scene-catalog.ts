/**
 * Presentation metadata for the scene gallery: which category a scene belongs
 * to, whether it's newly added, and whether it's featured on the home page.
 * Keyed by scene slug. Scenes missing here (e.g. the foundational
 * `scene-container`) are excluded from the gallery.
 */
export const SCENE_CATEGORIES = [
  "Backgrounds",
  "Objects",
  "Particles",
  "Interactive",
  "Text",
] as const

export type SceneCategory = (typeof SCENE_CATEGORIES)[number]

export type CatalogEntry = {
  category: SceneCategory
  /** Show a NEW badge in the gallery. */
  isNew?: boolean
  /**
   * Position (1–6) on the home page's "Ready-to-use 3D scenes" grid.
   * IMPORTANT: that section shows EXACTLY 6 scenes (two rows of three) —
   * when featuring a new scene, unfeature another so the count stays at 6,
   * and keep the ranks a contiguous 1–6 (they define the display order).
   */
  featured?: number
}

export const SCENE_CATALOG: Record<string, CatalogEntry> = {
  "particle-field": { category: "Particles" },
  "product-viewer": { category: "Objects" },
  "floating-card-3d": { category: "Interactive" },
  "text-3d": { category: "Text" },
  "product-showcase": { category: "Objects" },
  globe: { category: "Objects" },
  "wave-terrain": { category: "Backgrounds" },
  crystal: { category: "Objects", featured: 3 },
  halo: { category: "Objects" },
  "dna-helix": { category: "Objects" },
  vortex: { category: "Backgrounds" },
  "aurora-ribbons": { category: "Backgrounds" },
  "network-graph": { category: "Backgrounds" },
  metaballs: { category: "Objects", featured: 4 },
  "cube-wave": { category: "Backgrounds" },
  "iso-city": { category: "Objects" },
  "warp-tunnel": { category: "Backgrounds", featured: 5 },
  phyllotaxis: { category: "Objects", isNew: true },
  "strange-attractor": { category: "Backgrounds", isNew: true },
  "curl-flow": { category: "Particles", isNew: true },
  cloth: { category: "Objects", isNew: true },
  boids: { category: "Particles", isNew: true },
  "voronoi-shatter": { category: "Objects", isNew: true },
  tesseract: { category: "Objects", isNew: true, featured: 6 },
  "pendulum-wave": { category: "Objects", isNew: true },
  "pitch-momentum": { category: "Particles", isNew: true, featured: 1 },
  "world-cup": { category: "Objects", isNew: true, featured: 2 },
}

export function catalogFor(slug: string): CatalogEntry | undefined {
  return SCENE_CATALOG[slug]
}
