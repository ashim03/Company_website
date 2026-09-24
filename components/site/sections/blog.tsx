import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { getPublishedPosts } from "@/lib/queries";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

export async function BlogSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const posts = await getPublishedPosts();
  const items = posts.slice(0, 3);
  if (!items.length) return null;

  return (
    <Section>
      <div className="flex items-end justify-between gap-6">
        <SectionHeading
          align="left"
          className="!mb-10"
          eyebrow={c.eyebrow ? text(c.eyebrow) : "From the blog"}
          title={c.title ? text(c.title) : "Insights on building software that ships"}
          description={c.description ? text(c.description) : undefined}
        />
        <Link
          href="/insights"
          className="group hidden shrink-0 items-center gap-1.5 pb-1 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80 md:inline-flex"
        >
          View all insights
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((post, i) => (
          <Reveal key={post.id} delay={(i % 3) * 70}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl gradient-border bg-card/70 transition-colors hover:border-primary/40">
              {post.coverImage ? (
                <div className="relative aspect-[16/9] overflow-hidden bg-muted/50">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden="true" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-2.5 p-6">
                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  {post.category ? (
                    <span className="inline-flex items-center gap-1.5 text-primary">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {post.category.name}
                    </span>
                  ) : null}
                  {post.publishedAt ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {formatDate(post.publishedAt)}
                    </span>
                  ) : null}
                </div>
                <h3 className="text-lg font-semibold leading-snug tracking-tight">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="line-clamp-2 transition-colors group-hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt ? (
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {text(post.excerpt)}
                  </p>
                ) : null}
                <Link href={`/insights/${post.slug}`} aria-label={`Read ${post.title}`} className="mt-auto inline-flex min-h-11 items-center gap-1 border-t border-border/60 pt-3.5 text-sm font-medium text-primary">
                  Read article
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
