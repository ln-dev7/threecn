import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page"

import { source } from "@/lib/source"
import { ogImageUrl } from "@/lib/site"
import { getMDXComponents } from "@/components/mdx"

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDXContent = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const og = ogImageUrl({
    eyebrow: "Documentation",
    title: page.data.title,
    subtitle: page.data.description,
  })

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      type: "article",
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      images: [{ url: og, width: 1200, height: 630, alt: page.data.title }],
    },
    twitter: { card: "summary_large_image", images: [og] },
  }
}
