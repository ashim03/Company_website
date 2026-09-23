import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/queries";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export async function ProductsSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const products = await getProducts();
  if (!products.length) return null;

  const [featured, ...rest] = products.slice(0, 4);
  const tech = featured?.technology
    ? text(featured.technology)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];

  return (
    <Section id="products" className="gradient-top border-t border-border/40">
      <div className="flex items-end justify-between gap-6">
        <div className="mb-10 flex max-w-3xl flex-col gap-4">
          {c.eyebrow ? (
            <span className={cn("eyebrow", text(c.eyebrow))}>
              {text(c.eyebrow)}
            </span>
          ) : (
            <span className="eyebrow">Products</span>
          )}
          <h2 className="text-balance text-title font-bold text-black dark:text-white">
            {c.title ? text(c.title) : "Software products for real operations"}
          </h2>
          {c.description ? (
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {text(c.description)}
            </p>
          ) : (
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              We don&apos;t just build for clients — we build products of our
              own, designed to solve operational problems that outgrow
              spreadsheets.
            </p>
          )}
        </div>
        <Link
          href="/products"
          className="group hidden shrink-0 items-center gap-1.5 pb-1 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80 md:inline-flex"
        >
          All products
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {featured ? (
        <Reveal>
          <article className="group relative grid gap-6 overflow-hidden rounded-3xl gradient-border bg-card/70 p-6 transition-colors hover:border-primary/40 sm:p-8 lg:grid-cols-[1.12fr_1fr] lg:items-center lg:gap-12">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border bg-muted/50">
              {featured.logo ? (
                <Image
                  src={featured.logo}
                  alt={featured.name}
                  fill
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500/15 to-cyan-400/15">
                  <span className="text-4xl font-bold tracking-tight text-primary">
                    {featured.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-foreground backdrop-blur">
                <span className="size-1.5 rounded-full bg-success" />
                Flagship
              </span>
            </div>
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-bold tracking-tight">
                  {featured.name}
                </h3>
                {featured.status ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-wider text-muted-foreground">
                    <span className="size-1.5 animate-pulse rounded-full bg-success" />
                    {featured.status}
                  </span>
                ) : null}
              </div>
              {featured.tagline ? (
                <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  {text(featured.tagline)}
                </p>
              ) : null}
              <p className="text-sm leading-7 text-muted-foreground">
                {text(featured.shortDescription)}
              </p>
              {tech.length ? (
                <div className="flex flex-wrap gap-2">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center gap-5 border-t border-border/60 pt-5">
                <Link
                  href={`/products/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Open product
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                {featured.websiteUrl ? (
                  <a
                    href={featured.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {text(featured.ctaLabel) || "Product website"}
                    <ArrowUpRight className="size-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        </Reveal>
      ) : null}

      {rest.length ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 70}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/70 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_48px_-24px_rgba(59,130,246,0.45)]">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted/50">
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 30vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500/15 to-cyan-400/15">
                      <span className="text-3xl font-bold tracking-tight text-primary">
                        {p.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-base font-semibold tracking-tight">
                    {p.name}
                  </h3>
                  {p.tagline ? (
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {text(p.tagline)}
                    </p>
                  ) : null}
                  {p.websiteUrl ? (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      {text(p.ctaLabel) || "Visit website"}
                      <ArrowUpRight className="size-4" />
                    </a>
                  ) : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
