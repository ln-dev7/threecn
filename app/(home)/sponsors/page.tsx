import type { Metadata } from "next"
import Link from "next/link"
import { IconArrowRight, IconCheck, IconMail } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { DotField } from "@/components/site/dot-field"
import {
  SPONSOR_EMAIL,
  SPONSOR_PLANS,
  SPONSOR_TIERS,
  sponsorMailto,
} from "@/components/site/sponsors"
import { SCENES } from "@/lib/scenes"
import { ogImageUrl } from "@/lib/site"
import { cn } from "@/lib/utils"

const title = "Sponsors"
const description =
  "threecn is free and open source. Sponsors keep new scenes shipping — and get their logo in front of the shadcn community."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sponsors" },
  openGraph: {
    type: "website",
    url: "/sponsors",
    title,
    description,
    images: [
      {
        url: ogImageUrl({ eyebrow: "Community", title, subtitle: description }),
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
}

const stats = [
  { value: `${SCENES.length}`, label: "scenes & counting" },
  { value: "MIT", label: "licensed, free forever" },
  { value: "1", label: "command to install" },
]

const tierTileStyles: Record<string, { grid: string; tile: string; logo: string }> = {
  osp: {
    grid: "grid-cols-1 sm:grid-cols-2",
    tile: "h-28",
    logo: "h-10 max-w-48",
  },
  gold: {
    grid: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    tile: "h-24",
    logo: "h-9 max-w-40",
  },
  silver: {
    grid: "grid-cols-2 lg:grid-cols-4",
    tile: "h-20",
    logo: "h-7 max-w-32",
  },
}

export default function SponsorsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <DotField className="-z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/60 to-background" />

        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-24 pb-16 text-center sm:pt-32 sm:pb-20">
          <p className="font-mono text-xs tracking-widest text-primary uppercase">
            Sponsors
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Backed by the community
          </h1>
          <p className="mt-5 max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            threecn is free and open source. Sponsors keep new scenes shipping —
            and get their logo in front of the shadcn community.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="rounded-lg"
              nativeButton={false}
              render={
                <a href="#plans">
                  Become a sponsor
                  <IconArrowRight className="size-4" />
                </a>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="rounded-lg"
              nativeButton={false}
              render={
                <a href={sponsorMailto()}>
                  <IconMail className="size-4" />
                  Get in touch
                </a>
              }
            />
          </div>

          <div className="mt-12 grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="flex flex-col gap-12">
          {SPONSOR_TIERS.map((tier) => {
            const styles = tierTileStyles[tier.key] ?? tierTileStyles.silver
            if (tier.sponsors.length === 0 && tier.spots === 0) return null
            return (
              <div key={tier.key}>
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {tier.label}
                </p>
                <div className={cn("mt-4 grid gap-4", styles.grid)}>
                  {tier.sponsors.map((sponsor) => (
                    <a
                      key={sponsor.name}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener sponsored"
                      aria-label={sponsor.name}
                      className={cn(
                        "flex items-center justify-center rounded-2xl border border-border bg-card px-8 text-foreground transition-colors ease-out hover:bg-accent",
                        styles.tile
                      )}
                    >
                      <sponsor.logo className={cn("w-full shrink-0", styles.logo)} />
                    </a>
                  ))}
                  {Array.from({ length: tier.spots }, (_, i) => (
                    <Link
                      key={i}
                      href="#plans"
                      className={cn(
                        "flex items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground",
                        styles.tile
                      )}
                    >
                      Your logo here
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section
        id="plans"
        className="scroll-mt-14 border-t border-border bg-muted/20"
      >
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="mb-14 max-w-2xl">
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              Become a sponsor
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple monthly tiers
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Every tier puts your logo in the docs sidebar, visible on every
              page of the documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {SPONSOR_PLANS.map((plan) => (
              <div
                key={plan.key}
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-6",
                  plan.featured ? "border-primary" : "border-border"
                )}
              >
                {plan.featured ? (
                  <span className="absolute -top-2.5 left-5 rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-primary-foreground uppercase">
                    Most visible
                  </span>
                ) : null}
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {plan.label}
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {plan.price}
                  {plan.period ? (
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.period}
                    </span>
                  ) : null}
                </p>
                <ul className="mt-5 mb-6 flex flex-col gap-2.5 text-sm text-muted-foreground">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2.5">
                      <IconCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className="mt-auto rounded-lg"
                  nativeButton={false}
                  render={
                    <a href={sponsorMailto(plan.label)}>
                      Sponsor as {plan.label}
                    </a>
                  }
                />
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            Prefer a one-time contribution or something custom? Email{" "}
            <a
              href={sponsorMailto()}
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              {SPONSOR_EMAIL}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  )
}
