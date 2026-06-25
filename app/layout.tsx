import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { RootProvider } from "fumadocs-ui/provider/next"

import "./globals.css"
import { cn } from "@/lib/utils"
import { SITE, ogImageUrl } from "@/lib/site"
import { ThemeHotkey } from "@/components/theme-provider"

const defaultOg = ogImageUrl({
  title: "3D scenes for shadcn/ui.",
  subtitle: "Copy-paste React Three Fiber scenes that adapt to your shadcn theme.",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "threecn — 3D scenes for shadcn/ui",
    template: "%s — threecn",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "ln-dev7", url: SITE.twitter }],
  creator: "ln-dev7",
  keywords: [
    "react three fiber",
    "r3f",
    "drei",
    "shadcn",
    "shadcn registry",
    "3D",
    "three.js",
    "webgl",
    "nextjs",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    url: SITE.url,
    title: "threecn — 3D scenes for shadcn/ui",
    description: SITE.description,
    images: [{ url: defaultOg, width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitterHandle,
    creator: SITE.twitterHandle,
    title: "threecn — 3D scenes for shadcn/ui",
    description: SITE.description,
    images: [defaultOg],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}/banner.png`,
      sameAs: [SITE.github, SITE.twitter],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: SITE.name,
      url: SITE.url,
      inLanguage: "en",
      publisher: { "@id": `${SITE.url}/#org` },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE.name,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      description: SITE.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <RootProvider
          theme={{
            attribute: "class",
            defaultTheme: "dark",
            enableSystem: true,
          }}
        >
          <ThemeHotkey />
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
