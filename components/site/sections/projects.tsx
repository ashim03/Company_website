import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { getProjects } from "@/lib/queries";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { TiltCard } from "@/components/site/tilt-card";

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

export async function ProjectsSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const projects = await getProjects();
  if (!projects.length) return null;

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const items = featured.length ? featured : projects.slice(0, 3);

  return (
    <Section id="work">
      <div className="flex items-end justify-between gap-6">
        <SectionHeading
          align="left"
          className="!mb-10"
          eyebrow={c.eyebrow ? text(c.eyebrow) : "Selected work"}
          title={c.title ? text(c.title) : "Projects that went from problem to deployed product"}
          description={
            c.description
              ? text(c.description)
              : "A look at software we've shipped for teams like yours — real operations, real constraints, real results."
          }
        />
        <Link
          href="/work"
          className="group hidden shrink-0 items-center gap-1.5 pb-1 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80 md:inline-flex"
        >
          View all projects
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 70}>
            <TiltCard className="h-full">
              <Link
                href={`/work/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl gradient-border bg-card/80"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/60">
                  {p.coverImage ? (
                    <Image
                      src={p.coverImage}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center p-6">
                      <p className="line-clamp-3 text-center font-mono text-xs text-muted-foreground">
                        {text(p.shortDescription)}
                      </p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                  {p.status ? (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
                      <span className="size-1.5 rounded-full bg-sky-300" />
                      {p.status}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-6">
                  <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {text(p.shortDescription)}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4 font-mono text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      {p.completionDate ? <CalendarDays className="size-3.5" /> : null}
                      {formatDate(p.completionDate)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-primary">
                      Case study
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}