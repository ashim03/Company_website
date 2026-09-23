import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

export interface SeoInput {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  robots?: string;
  canonical?: string;
}

export function buildMetadata(input: SeoInput): Metadata {
  const url = input.canonical ? absoluteUrl(input.canonical) : input.path ? absoluteUrl(input.path) : undefined;
  const image = input.ogImage ? absoluteUrl(input.ogImage) : undefined;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.robots,
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: "CodAstra Labs",
      type: input.ogType ?? "website",
      images: image ? [{ url: image, width: 1200, height: 630, alt: input.title }] : undefined,
      publishedTime: input.ogType === "article" ? input.publishedTime : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: image ? [image] : undefined,
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CodAstra Labs",
    legalName: "CodAstra Labs Pvt. Ltd.",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/codastralabs-logo.jpeg"),
    description:
      "CodAstraLabs builds websites, mobile apps, web apps, automation, cloud systems, and secure business software.",
    email: "support.codastralabs@gmail.com",
    telephone: "+9779851405271",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NP",
    },
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CodAstra Labs",
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(article: {
  title: string;
  description?: string | null;
  url: string;
  publishedTime?: Date | string | null;
  author?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description ?? undefined,
    url: article.url,
    datePublished: article.publishedTime ? new Date(article.publishedTime).toISOString() : undefined,
    author: article.author
      ? { "@type": "Person", name: article.author }
      : { "@type": "Organization", name: "CodAstra Labs" },
    publisher: { "@type": "Organization", name: "CodAstra Labs", url: absoluteUrl("/") },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(svc: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.name,
    description: svc.description,
    provider: {
      "@type": "Organization",
      name: "CodAstra Labs",
      url: absoluteUrl("/"),
    },
    url: svc.url,
    areaServed: "NP",
  };
}