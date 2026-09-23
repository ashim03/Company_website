import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { RevealText } from "@/components/site/reveal-text";
import { Counter } from "@/components/site/counter";
import { CodeTerminal } from "@/components/site/code-terminal";
import { AnimatedVisual } from "@/components/site/animated-visual";
import { getProducts } from "@/lib/queries";
import { cn } from "@/lib/utils";

export async function HeroSection({ content, compact = false }: { content: Inner; compact?: boolean }) {
  const c = asRecord(content);
  const [products] = await Promise.all([getProducts()]);
  const headline = text(c.headline);
  const title = c.title ? text(c.title) : "";
  const description = c.description ? text(c.description) : "";
  const eyebrow = c.eyebrow ? text(c.eyebrow) : "";
  const primary = asRecord(c.primaryCta);
  const secondary = asRecord(c.secondaryCta);
  const primaryLabel = text(primary.label, "Explore Our Services");
  const primaryHref = text(primary.href, "#services");
  const secondaryLabel = text(secondary.label, "Explore Classes");
  const secondaryHref = text(secondary.href, "#classes");
  const image = c.image ? text(c.image) : "";
  const stats = Array.isArray(c.stats) ? c.stats.map((s) => asRecord(s)) : [];

  const heading =
    title ||
    headline ||
    "Digital Solutions. Creative Services. Professional Training.";

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 12% -8%, rgba(59,130,246,0.28), transparent 68%), radial-gradient(45% 45% at 88% 4%, rgba(56,189,248,0.20), transparent 70%), radial-gradient(55% 45% at 85% 110%, rgba(34,211,238,0.16), transparent 72%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(233,237,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(233,237,250,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      <Container
        className={cn(
          "relative flex flex-col py-12 md:py-16 lg:py-20",
          compact ? "" : "min-h-[calc(100svh-4rem)] justify-center lg:py-24"
        )}
      >
        <div
          className={cn(
            "grid grid-cols-1 gap-14 lg:grid-cols-[1.05fr_0.95fr]",
            compact ? "items-start" : "items-center"
          )}
        >
          <div className="flex min-w-0 flex-col gap-6">
            {eyebrow ? (
              <Reveal rise initialVisible>
                <span className="gradient-border inline-flex w-fit items-center gap-2.5 rounded-full bg-card px-4 py-1.5">
                  <span className="grid size-2.5 grid-cols-2 gap-[3px]" aria-hidden="true">
                    <span className="rounded-[1px] bg-primary" />
                    <span className="rounded-[1px] bg-primary" />
                    <span className="rounded-[1px] bg-primary" />
                    <span className="rounded-[1px] bg-primary/40" />
                  </span>
                  <span className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary">
                    {eyebrow}
                  </span>
                </span>
              </Reveal>
            ) : null}
            <RevealText
              text={heading}
              highlight={2}
              rise
              initialVisible
              as="h1"
              className="text-display font-semibold"
            />
            {description ? (
              <Reveal rise delay={140} initialVisible>
                <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {description}
                </p>
              </Reveal>
            ) : null}
            <Reveal rise delay={200} initialVisible>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={primaryHref}
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_-12px_rgba(59,130,246,0.8)] transition-shadow hover:shadow-[0_18px_50px_-12px_rgba(34,211,238,0.8)]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative flex items-center gap-2">
                    {primaryLabel}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
                {secondaryLabel && secondaryHref ? (
                  <Link
                    href={secondaryHref}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:text-primary"
                  >
                    {secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </Reveal>
            {stats.length > 0 ? (
              <Reveal rise delay={260} initialVisible>
                <dl className="mt-8 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
                  {stats.map((s) => (
                    <div key={text(s.label) || "stat"} className="flex flex-col gap-1">
                      <dt className="text-accent -mt-1 text-3xl font-bold tracking-tight tabular-nums">
                        <Counter value={text(s.value)} />
                      </dt>
                      <dd className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {text(s.label)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ) : null}
          </div>

          <Reveal rise delay={160} initialVisible className="min-w-0 lg:justify-self-end">
            {image ? (
              <div className="relative">
                <AnimatedVisual
                  icon={<Sparkles className="size-6" />}
                  label={c.imageAlt ? text(c.imageAlt) : "codastra · build, design, learn"}
                  seed={1}
                  className="aspect-[4/5] w-full sm:aspect-square lg:aspect-[4/5]"
                />
                <div className="animate-bob absolute -bottom-5 -right-5">
                  <div className="gradient-border flex items-center gap-2 rounded-xl bg-background/90 px-4 py-3 shadow-soft">
                    <span className="relative flex size-2">
                      <span className="animate-ping-ring absolute inline-flex size-full rounded-full bg-primary" />
                      <span className="relative inline-flex size-2 rounded-full bg-primary" />
                    </span>
                    <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground">
                      shipped to production
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <CodeTerminal products={products} />
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
