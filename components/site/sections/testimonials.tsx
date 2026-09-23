import { Quote } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { getTestimonials } from "@/lib/queries";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { TiltCard } from "@/components/site/tilt-card";

export async function TestimonialsSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const testimonials = await getTestimonials();
  if (!testimonials.length) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow={c.eyebrow ? text(c.eyebrow) : "In their words"}
        title={c.title ? text(c.title) : "What teams say about working with us"}
        description={c.description ? text(c.description) : undefined}
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 6).map((t, i) => (
          <Reveal key={t.id} delay={(i % 3) * 70}>
            <TiltCard max={5} glare={false} className="h-full">
              <figure className="flex h-full flex-col gap-4 rounded-2xl gradient-border bg-card/80 p-7 transition-colors">
                <Quote className="text-gradient size-7" aria-hidden="true" />
                <blockquote className="text-[0.95rem] leading-7 text-foreground">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3 border-t border-border/60 pt-4">
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.avatar}
                      alt={t.author || "Client"}
                      loading="lazy"
                      className="size-10 rounded-full object-cover ring-1 ring-border"
                    />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-semibold text-white">
                      {(t.author || "C").slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <div className="text-sm font-semibold">{t.author}</div>
                    {(t.role || t.company) && (
                      <div className="font-mono text-xs text-muted-foreground">
                        {[t.role, t.company].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </div>
                </figcaption>
              </figure>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}