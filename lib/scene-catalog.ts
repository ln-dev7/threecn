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
  /** Surface on the home page's curated grid. */
  featured?: boolean
}

export const SCENE_CATALOG: Record<string, CatalogEntry> = {
  "particle-field": { category: "Particles" },
  "product-viewer": { category: "Objects" },
  "floating-card-3d": { category: "Interactive" },
  "text-3d": { category: "Text" },
  "product-showcase": { category: "Objects" },
  globe: { category: "Objects" },
  "wave-terrain": { category: "Backgrounds" },
  crystal: { category: "Objects", featured: true },
  halo: { category: "Objects" },
  "dna-helix": { category: "Objects" },
  vortex: { category: "Backgrounds" },
  "aurora-ribbons": { category: "Backgrounds", featured: true },
  "network-graph": { category: "Backgrounds" },
  metaballs: { category: "Objects", featured: true },
  "cube-wave": { category: "Backgrounds" },
  "iso-city": { category: "Objects" },
  "warp-tunnel": { category: "Backgrounds", featured: true },
  phyllotaxis: { category: "Objects", isNew: true },
  "strange-attractor": { category: "Backgrounds", isNew: true },
  "curl-flow": { category: "Particles", isNew: true },
  cloth: { category: "Objects", isNew: true },
  boids: { category: "Particles", isNew: true, featured: true },
  "voronoi-shatter": { category: "Objects", isNew: true, featured: true },
}

export function catalogFor(slug: string): CatalogEntry | undefined {
  return SCENE_CATALOG[slug]
}
