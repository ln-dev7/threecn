import type { NextConfig } from "next"
import { createMDX } from "fumadocs-mdx/next"

const nextConfig: NextConfig = {
  // R3F ships ESM-only transitive deps (three/examples helpers used by drei).
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
}

const withMDX = createMDX()

export default withMDX(nextConfig)
