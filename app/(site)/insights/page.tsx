import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Newspaper } from "lucide-react";
import { getPublishedPosts, getBlogCategories } from "@/lib/queries";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { EmptyState } from "@/components/site/empty-state";
import { text } from "@/lib/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Insights — CodAstra Labs",
  description:
    "Notes on building software that has to work — operations, product engineering, and dependable systems.",
};

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, posts, categories] = await Promise.all([
    searchParams,
    getPublishedPosts(),
    getBlogCategories(),
  ]);

  const filtered = category
    ? posts.filter((p) => p.category && p.category.slug === category)
    : posts;

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        splitHeading
        title="Notes on building software that ships"
        description="Practical writing about operations software, product engineering, and systems that have to work — from the team behind CodAstra Labs."
      />
      <Container className="py-16 md:py-24">
        {categories.length > 0 ? (
          <div className="mb-12 flex flex-wrap gap-2">
            <Link
              href="/insights"
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                category
                  ? "border-border/70 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  : "border-primary bg-primary text-primary-foreground"
              )}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/insights?category=${c.slug}`}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  category === c.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/70 bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No articles yet"
            body="We're brewing long-form guides and notes on building operations software — they'll appear here as they publish."
            cta={{ label: "Talk to us", href: "/contact" }}
          />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 70}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl gradient-border bg-card/70 transition-colors hover:border-primary/40">
                  {post.coverImage ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted/50">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden="true" />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-2.5 p-6">
                    {post.category ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
                        <span className="size-1.5 rounded-full bg-primary" />
                        {post.category.name}
                      </span>
                    ) : null}
                    <h2 className="text-lg font-semibold leading-snug tracking-tight">
                      <Link
                        href={`/insights/${post.slug}`}
                        className="line-clamp-2 transition-colors group-hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt ? (
                      <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {text(post.excerpt)}
                      </p>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-1.5 border-t border-border/60 pt-3.5 text-sm font-semibold text-primary">
                      Read article
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
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