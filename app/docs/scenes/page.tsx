import type { Metadata } from "next"
import { DocsPage } from "fumadocs-ui/page"

import { ScenesGallery } from "@/components/site/scenes-gallery"
import { SponsorCard } from "@/components/site/sponsor-card"
import { ogImageUrl } from "@/lib/site"

const title = "Scenes"
const description =
  "Browse every ready-to-use threecn 3D scene. Filter by category, search, and install any of them with the shadcn CLI."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/docs/scenes" },
  openGraph: {
    type: "website",
    url: "/docs/scenes",
    title,
    description,
    images: [
      {
        url: ogImageUrl({ eyebrow: "Components", title, subtitle: description }),
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
}

export default function ScenesIndexPage() {
  return (
    <DocsPage
      toc={[]}
      breadcrumb={{ enabled: false }}
      tableOfContent={{ footer: <SponsorCard className="mt-4" /> }}
    >
      <ScenesGallery />
    </DocsPage>
  )
}
