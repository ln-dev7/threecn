import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const nextConfig: NextConfig = {
  // R3F ships ESM-only transitive deps (three/examples helpers used by drei).
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  // Ensure the OG image routes bundle the brand fonts they read at runtime.
  outputFileTracingIncludes: {
    "/og": ["./assets/fonts/**", "./public/banner.png"],
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
