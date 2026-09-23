import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Inner, text, asRecord, stringArray } from "@/lib/types";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { LearningJourney } from "@/components/site/visuals/learning-journey";

const DEFAULT_POINTS = [
  "IT and digital skills",
  "Digital marketing",
  "Graphic design",
  "Web development",
];

export function ClassesSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const eyebrow = c.eyebrow ? text(c.eyebrow) : "Professional classes";
  const title = c.title ? text(c.title) : "Learn. Build. Grow.";
  const description = c.description
    ? text(c.description)
    : "Build practical, industry-relevant skills through professional classes and hands-on training designed for students, professionals, and aspiring digital creators.";
  const rawPoints = Array.isArray(c.points) ? c.points : [];
  const points = rawPoints.length ? stringArray(rawPoints) : DEFAULT_POINTS;
  const primary = asRecord(c.primaryCta);
  const primaryLabel = text(primary.label, "Explore Our Classes");
  const primaryHref = text(primary.href, "/classes");

  return (
    <section id="classes" className="py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="bg-noise relative overflow-hidden rounded-3xl gradient-border bg-card/80 px-6 py-16 shadow-soft sm:px-12 md:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 70% at 15% 0%, rgba(59,130,246,0.18), transparent 70%), radial-gradient(60% 60% at 90% 100%, rgba(34,211,238,0.14), transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col gap-5">
                <span className="eyebrow">{eyebrow}</span>
                <h2 className="text-balance text-title font-semibold text-black dark:text-white">
                  {title}
                </h2>
                <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                  {description}
                </p>
                <div className="mt-1">
                  <Link
                    href={primaryHref}
                    className="group relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-12px_rgba(59,130,246,0.8)] transition-shadow hover:shadow-[0_18px_50px_-12px_rgba(34,211,238,0.8)]"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <span className="relative flex items-center gap-2">
                      {primaryLabel}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl gradient-border bg-card text-primary">
                  <GraduationCap className="size-7" />
                </div>
                <LearningJourney className="w-full rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6" />
                <ul className="flex flex-wrap gap-2.5">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="rounded-full border border-border/70 bg-background/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
