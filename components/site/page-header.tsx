import { cn } from "@/lib/utils";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { Aurora } from "@/components/site/aurora";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { SplitHeading } from "@/components/site/split-heading";

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
  breadcrumbs,
  splitHeading = false,
  fill = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string | null;
  className?: string;
  breadcrumbs?: { name: string; href?: string }[];
  /** Render the title as a two-cluster lateral slide (lead + accent). */
  splitHeading?: boolean;
  /** Fill the viewport (immersive hero) instead of a compact header. */
  fill?: boolean;
}) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <Aurora orbs={2} grid={false} />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden="true"
      />
      <Container
        className={cn(
          "relative flex flex-col items-start justify-center",
          fill ? "min-h-[calc(100svh-4rem)] py-16 md:py-24" : "py-10 md:py-14 lg:py-16"
        )}
      >
        <div className="max-w-3xl space-y-6">
          {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
          {eyebrow ? (
            <Reveal rise>
              <span className="eyebrow">{eyebrow}</span>
            </Reveal>
          ) : null}
          {splitHeading ? (
            <SplitHeading
              as="h1"
              rise
              text={title}
              className="text-display text-foreground"
            />
          ) : (
            <Reveal rise delay={60}>
              <h1 className="text-display text-balance font-semibold">{title}</h1>
            </Reveal>
          )}
          {description ? (
            <Reveal rise delay={120}>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
                {description}
              </p>
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}