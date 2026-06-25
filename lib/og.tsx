import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

let bannerCache: string | null = null
async function bannerDataUri() {
  if (!bannerCache) {
    const buf = await readFile(join(process.cwd(), "public/banner.png"))
    bannerCache = `data:image/png;base64,${buf.toString("base64")}`
  }
  return bannerCache
}

type Weight = "Regular" | "Medium" | "SemiBold"
const fontCache: Partial<Record<Weight, Buffer>> = {}
async function geist(weight: Weight) {
  if (!fontCache[weight]) {
    fontCache[weight] = await readFile(
      join(process.cwd(), `assets/fonts/Geist-${weight}.ttf`)
    )
  }
  return fontCache[weight]!
}

/**
 * Renders an Open Graph image: the threecn banner as background with the page
 * title overlaid in the empty left zone, set in the brand font (Geist).
 */
export async function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  const [bg, regular, medium, semibold] = await Promise.all([
    bannerDataUri(),
    geist("Regular"),
    geist("Medium"),
    geist("SemiBold"),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          fontFamily: "Geist",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bg}
          alt=""
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: 72,
            top: 176,
            width: 560,
          }}
        >
          {eyebrow ? (
            <div
              style={{
                fontSize: 26,
                fontWeight: 500,
                color: "#7c3aed",
                marginBottom: 18,
                letterSpacing: "0.04em",
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: 60,
              fontWeight: 600,
              color: "#1b1830",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                fontSize: 26,
                fontWeight: 400,
                color: "#65617d",
                marginTop: 22,
                lineHeight: 1.35,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
      ],
    }
  )
}
