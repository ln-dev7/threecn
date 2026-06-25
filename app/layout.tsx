import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { RootProvider } from "fumadocs-ui/provider/next"

import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeHotkey } from "@/components/theme-provider"

const siteUrl = "https://threecn.dev"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "threecn — 3D scenes for shadcn/ui",
    template: "%s — threecn",
  },
  description:
    "Copy-paste React Three Fiber scenes that auto-adapt to your shadcn theme. Dark mode included. Zero Three.js expertise required.",
  keywords: [
    "react three fiber",
    "drei",
    "shadcn",
    "3D",
    "threejs",
    "registry",
    "nextjs",
  ],
  openGraph: {
    title: "threecn — 3D scenes for shadcn/ui",
    description:
      "Copy-paste React Three Fiber scenes that auto-adapt to your shadcn theme.",
    url: siteUrl,
    siteName: "threecn",
    type: "website",
  },
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
