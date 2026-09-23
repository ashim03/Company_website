import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getPublishedPost, getPublishedPosts } from "@/lib/queries";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";
import { Markdown } from "@/lib/markdown";
import { text } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || text(post.excerpt),
    openGraph: {
      title: post.title,
      description: text(post.excerpt),
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
  } catch {
    return "";
  }
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const related = (await getPublishedPosts())
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Insights", href: "/insights" }, { name: post.title }]}
        eyebrow={post.category?.name}
        title={post.title}
        description={text(post.excerpt) || undefined}
      />

      <Container className="max-w-3xl py-10 md:py-16">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {post.authorName ? <span>By {post.authorName}</span> : null}
          {post.publishedAt ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDate(post.publishedAt)}
            </span>
          ) : null}
        </div>

        {post.coverImage ? (
          <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl border bg-muted/50">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 90vw, 768px"
              className="object-cover"
            />
          </div>
        ) : null}

        <article className="prose-content mt-10">
          <Markdown source={post.content} />
        </article>

        {related.length > 0 ? (
          <section className="mt-16 border-t pt-10">
            <h2 className="mb-6 text-xl font-semibold tracking-tight">More insights</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/insights/${p.slug}`}
                  className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <h3 className="font-semibold leading-snug group-hover:text-primary">
                    {p.title}
                  </h3>
                  {p.excerpt ? (
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {text(p.excerpt)}
                    </p>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}