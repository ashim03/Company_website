import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import { getProjects } from "@/lib/queries";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { TiltCard } from "@/components/site/tilt-card";
import { EmptyState } from "@/components/site/empty-state";
import { FolderOpen } from "lucide-react";
import { text } from "@/lib/types";

export const metadata: Metadata = {
  title: "Work — CodAstra Labs",
  description:
    "Projects that went from problem to deployed product — software CodAstra has shipped for real operations.",
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return "";
  }
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Selected work"
        splitHeading
        title="Projects that went from problem to deployed product"
        description="A look at software we've shipped for teams like yours — real operations, real constraints, real results."
      />
      <Container className="py-16 md:py-24">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="Case studies in the making"
            body="We're documenting recent engagements right now — they'll land here soon."
            cta={{ label: "See our products", href: "/products" }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 70}>
                <TiltCard max={8} className="h-full">
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl gradient-border bg-card/80">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted/50">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 90vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : null}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" aria-hidden="true" />
                      {p.status ? (
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
                          <span className="size-1.5 rounded-full bg-sky-300" />
                          {p.status}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-2.5 p-6">
                      <h2 className="text-lg font-semibold tracking-tight">{p.name}</h2>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {text(p.shortDescription)}
                      </p>
                      {p.technology.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.technology.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          {p.completionDate ? <CalendarDays className="size-3.5" /> : null}
                          {formatDate(p.completionDate)}
                        </span>
                        <Link
                          href={`/work/${p.slug}`}
                          className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-primary/80"
                        >
                          Case study <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}