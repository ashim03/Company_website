import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getProduct, getProducts } from "@/lib/queries";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { Markdown } from "@/lib/markdown";
import { text } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — CodAstra Labs`,
    description: text(product.shortDescription) || text(product.tagline) || undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const others = (await getProducts()).filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Products", href: "/products" }, { name: product.name }]}
        eyebrow={text(product.tagline)}
        title={product.name}
        description={text(product.shortDescription)}
      />

      <Container className="py-10 md:py-16">
        {product.logo ? (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl border bg-muted/50">
            <Image
              src={product.logo}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1280px) 1200px, 90vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-10">
            {product.detailedDescription ? (
              <section>
                <Markdown source={text(product.detailedDescription)} />
              </section>
            ) : null}

            {product.features.length > 0 ? (
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight">Features</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-6">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="size-3 text-primary" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {product.screenshots.length > 0 ? (
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight">Screenshots</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {product.screenshots.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt={`${product.name} screenshot`}
                      loading="lazy"
                      className="w-full rounded-xl border object-cover"
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {product.technology ? (
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Technology
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.technology.split(",").map((t) => (
                    <Badge key={t} variant="outline">
                      {t.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-semibold">Try {product.name}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                Learn how this product works and whether it fits your operation.
              </p>
              {product.websiteUrl ? (
                <a
                  href={product.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ className: "mt-4 w-full" }), "gap-2")}
                >
                  {text(product.ctaLabel) || "Open product website"}
                  <ArrowUpRight className="size-4" />
                </a>
              ) : null}
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ variant: "outline", className: "mt-2 w-full" })
                )}
              >
                Ask about {product.name}
              </Link>
            </div>

            {others.length > 0 ? (
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  More products
                </h3>
                <ul className="space-y-2">
                  {others.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {p.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Container>
    </>
  );
}