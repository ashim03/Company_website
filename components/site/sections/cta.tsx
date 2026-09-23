import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

export function CtaSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const title = c.title
    ? text(c.title)
    : "Have an operation that needs software?";
  const description =
    c.description || c.subtitle
      ? text(c.description || c.subtitle)
      : "Tell us what you're trying to run, fix, or scale. The first conversation is free and practical — you'll leave with a clear picture either way.";
  const primary = asRecord(c.primaryCta);
  const secondary = asRecord(c.secondaryCta);
  const primaryLabel = text(primary.label, "Start a conversation");
  const primaryHref = text(primary.href, "/contact");
  const secondaryLabel = text(secondary.label, "");
  const secondaryHref = text(secondary.href, "");

  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal>
          <div className="bg-noise relative overflow-hidden rounded-3xl gradient-border bg-card/80 px-6 py-16 shadow-soft sm:px-12 md:px-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 60% at 50% 0%, rgba(59,130,246,0.14), transparent 70%)",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
              <span className="eyebrow">
                {text(c.eyebrow) || "Ready when you are"}
              </span>
              <h3 className="text-balance text-title font-extrabold text-black dark:text-white">
                {title}
              </h3>
              <p className="text-pretty text-base leading-7 text-muted-foreground">
                {description}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
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
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/40 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-all hover:border-primary/50 hover:text-primary",
                    )}
                  >
                    {secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
