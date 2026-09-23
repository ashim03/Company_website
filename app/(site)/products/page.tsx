import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProducts } from "@/lib/queries";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { text } from "@/lib/types";
import { Check } from "lucide-react";
import { ProductShowcase, type ShowcaseProduct } from "@/components/site/visuals/product-showcase";

export const metadata: Metadata = {
  title: "Products — CodAstra Labs",
  description:
    "Software products we own and operate — starting with BridgeLabs, the operating system for education consultancies.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  const showcase: ShowcaseProduct[] = products.map((p) => ({
    name: p.name,
    tagline: p.tagline ? text(p.tagline) : undefined,
    logo: p.logo ?? undefined,
    features: p.features.slice(0, 4),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Products"
        splitHeading
        title="Software we own and operate"
        description="We build products of our own, designed to solve operational problems that outgrow spreadsheets. Each product is a working proof of the way we build for clients."
      />
      {showcase.length > 0 ? (
        <Container size="wide" className="pt-0">
          <ProductShowcase products={showcase} className="min-h-[24rem]" />
        </Container>
      ) : null}
      <Container className="py-16 md:py-24">
        {products.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Product pages are being prepared — check back soon.
          </p>
        ) : (
          <div className="space-y-8">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 70}>
                <article className="group grid overflow-hidden rounded-2xl gradient-border bg-card/80 transition-colors hover:border-primary/40 md:grid-cols-2">
                  <div className="relative aspect-video overflow-hidden border-b bg-muted/50 md:border-b-0 md:border-r">
                    {p.logo ? (
                      <Image
                        src={p.logo}
                        alt={p.name}
                        fill
                        sizes="(min-width: 768px) 50vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-gradient text-4xl font-bold tracking-tight">
                          {p.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold tracking-tight">{p.name}</h2>
                      {p.status ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-wider text-muted-foreground">
                          <span className="size-1.5 animate-pulse rounded-full bg-success" />
                          {p.status}
                        </span>
                      ) : null}
                    </div>
                    {p.tagline ? (
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary">
                        {text(p.tagline)}
                      </p>
                    ) : null}
                    <p className="text-sm leading-7 text-muted-foreground">
                      {text(p.shortDescription)}
                    </p>
                    {p.features.length > 0 ? (
                      <ul className="flex flex-wrap gap-x-5 gap-y-2">
                        {p.features.slice(0, 5).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                            <Check className="size-4 shrink-0 text-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
                      <Link
                        href={`/products/${p.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        Learn more <ArrowUpRight className="size-4" />
                      </Link>
                      {p.websiteUrl ? (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {text(p.ctaLabel) || "Open product website"}
                          <ArrowUpRight className="size-4" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}