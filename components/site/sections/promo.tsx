import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Inner, text, asRecord, stringArray } from "@/lib/types";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { RevealText } from "@/components/site/reveal-text";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { ServiceIcon } from "@/components/site/service-icon";

const DEFAULT_POINTS = [
  "Strategy, execution, and reporting in one engagement",
  "Work that matches your brand, audience, and goals",
  "Clear scope, honest timelines, measurable outcomes",
];

export function PromoSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const eyebrow = c.eyebrow ? text(c.eyebrow) : "";
  const title = c.title ? text(c.title) : "Feature spotlight";
  const description = c.description ? text(c.description) : "";
  const icon = c.icon ? text(c.icon) : "rocket";
  const rawPoints = Array.isArray(c.points) ? c.points : [];
  const points = rawPoints.length
    ? stringArray(rawPoints)
    : DEFAULT_POINTS;
  const primary = asRecord(c.primaryCta);
  const primaryLabel = text(primary.label, "");
  const primaryHref = text(primary.href, "");

  return (
    <Section className="gradient-top border-t border-border/40">
      <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-16">
        <Reveal from="left" className="lg:justify-self-start">
          <SpotlightCard
            strength={0.14}
            className="gradient-border flex size-24 items-center justify-center rounded-3xl bg-card sm:size-28"
          >
            <ServiceIcon icon={icon} className="size-12 text-primary" />
          </SpotlightCard>
        </Reveal>
        <div>
          <div className="mb-4 flex flex-col gap-3">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <RevealText
              text={title}
              highlight={1}
              rise
              initialVisible
              as="h2"
              className="text-title font-semibold"
            />
          </div>
          {description ? (
            <Reveal rise delay={100} initialVisible>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {description}
              </p>
            </Reveal>
          ) : null}
          <ul className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
            {points.map((point, i) => (
              <Reveal key={point} delay={120 + i * 50} rise initialVisible>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Check className="size-3" />
                  </span>
                  <span className="text-sm leading-6 text-foreground">{point}</span>
                </li>
              </Reveal>
            ))}
          </ul>
          {primaryLabel && primaryHref ? (
            <Reveal rise delay={200} initialVisible>
              <Link
                href={primaryHref}
                className="group mt-7 inline-flex items-center gap-1.5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80"
              >
                {primaryLabel}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
