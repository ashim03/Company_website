import { Check } from "lucide-react";
import { Inner, text, asRecord, stringArray } from "@/lib/types";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { EcosystemScene } from "@/components/site/visuals/ecosystem-scene";
import { getProducts } from "@/lib/queries";

export async function IntroSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const points = stringArray(c.points);
  const [products] = await Promise.all([getProducts()]);
  const bullets =
    points.length > 0
      ? points
      : [
          "Product strategy, design, and engineering under one roof",
          "Ships to production — deployed, monitored, and maintained",
          "Built for reliability, security, and long-term operations",
        ];

  return (
    <Section className="gradient-top relative overflow-hidden border-t border-border/40">
      <div
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96"
        style={{
          background:
            "radial-gradient(60% 60% at 55% 45%, rgba(56,189,248,0.10), transparent 72%)",
        }}
        aria-hidden="true"
      />
      <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal from="left" className="min-w-0">
          <div className="relative">
            <EcosystemScene products={products} className="aspect-[4/3.8] w-full" />
            <div className="animate-bob absolute -bottom-4 right-5 hidden md:block">
              <div className="gradient-border flex items-center gap-2.5 rounded-xl bg-background/90 px-4 py-3 shadow-soft backdrop-blur">
                <span className="size-2 rounded-full bg-primary" />
                <span className="font-mono text-xs font-medium text-foreground">
                  one accountable team, start → production
                </span>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="min-w-0">
          <SectionHeading
            align="left"
            className="!mb-7"
            splitAccent
            eyebrow={c.eyebrow ? text(c.eyebrow) : "About CodAstra"}
            title={c.title ? text(c.title) : "A software studio that runs on real operations"}
            description={
              c.description
                ? text(c.description)
                : "We partner with founders and operators to design, build, and run the software their business depends on — from idea to deployment and beyond."
            }
          />
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {bullets.map((point, i) => (
              <Reveal key={point} delay={i * 60}>
                <li className="group flex items-start gap-3.5 py-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform group-hover:scale-110">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-sm leading-6 text-foreground">{point}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}