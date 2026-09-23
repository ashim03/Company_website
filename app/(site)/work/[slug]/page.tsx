import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { getProject, getProjects } from "@/lib/queries";
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
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — CodAstra Labs`,
    description: text(project.shortDescription),
  };
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long" }).format(date);
  } catch {
    return "";
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const more = (await getProjects()).filter((p) => p.id !== project.id).slice(0, 3);

  const story = [
    project.problem ? { heading: "The problem", body: text(project.problem) } : null,
    project.solution ? { heading: "What we built", body: text(project.solution) } : null,
    project.outcome ? { heading: "The outcome", body: text(project.outcome) } : null,
  ].filter(Boolean) as { heading: string; body: string }[];

  const testimonials = Array.isArray(project.testimonials)
    ? (project.testimonials as string[])
    : [];

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Work", href: "/work" }, { name: project.name }]}
        eyebrow={project.status || undefined}
        title={project.name}
        description={text(project.shortDescription) || undefined}
      />

      <Container className="py-10 md:py-16">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {project.client ? (
            <span>
              Client:{" "}
              <strong className="font-medium text-foreground">{project.client}</strong>
            </span>
          ) : null}
          {project.serviceProvided ? (
            <span>
              Service:{" "}
              <strong className="font-medium text-foreground">
                {project.serviceProvided}
              </strong>
            </span>
          ) : null}
          {project.completionDate ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDate(project.completionDate)}
            </span>
          ) : null}
          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Visit project site ↗
            </a>
          ) : null}
        </div>

        {project.coverImage ? (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl border bg-muted/50">
            <Image
              src={project.coverImage}
              alt={project.name}
              fill
              priority
              sizes="(min-width: 1280px) 1200px, 90vw"
              className="object-cover"
            />
          </div>
        ) : null}

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-10">
            {story.length > 0 ? (
              <div className="flex flex-col gap-10">
                {story.map((block) => (
                  <section key={block.heading}>
                    <h2 className="mb-4 text-xl font-semibold tracking-tight">
                      {block.heading}
                    </h2>
                    <Markdown source={block.body} />
                  </section>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Case study details are being prepared — check back soon.
              </p>
            )}

            {testimonials.length > 0 ? (
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight">What they said</h2>
                <ul className="space-y-4">
                  {testimonials.map((t) => (
                    <li key={t} className="rounded-xl border bg-muted/40 p-5 text-sm italic">
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {project.technology.length > 0 ? (
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Technology
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technology.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
            {project.gallery.length > 0 ? (
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {project.gallery.slice(0, 4).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt={`${project.name} gallery`}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-lg border object-cover"
                    />
                  ))}
                </div>
              </div>
            ) : null}
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-lg font-semibold">Have a similar project?</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                We&apos;d love to hear about the operation you&apos;re trying to build or fix.
              </p>
              <Link href="/contact" className={cn(buttonVariants({ className: "mt-4 w-full" }))}>
                Get in touch
              </Link>
            </div>
          </aside>
        </div>

        {more.length > 0 ? (
          <section className="mt-20 border-t pt-12">
            <h2 className="mb-6 text-xl font-semibold tracking-tight">More work</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {more.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <h3 className="font-semibold group-hover:text-primary">{p.name}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                    {text(p.shortDescription)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}