import { Lightbulb, KeyRound, ShieldCheck, GitBranch } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { SpotlightCard } from "@/components/site/spotlight-card";

const ICONS = [Lightbulb, KeyRound, ShieldCheck, GitBranch];

const DEFAULT_ITEMS = [
  {
    title: "Operations first",
    description:
      "We optimize for how your business actually runs day-to-day, not for demos. Software that survives contact with real work.",
  },
  {
    title: "Ownership",
    description:
      "One team, one point of accountability — from your first discovery call to post-launch monitoring and support.",
  },
  {
    title: "Security by default",
    description:
      "Auth, encryption, code review, and patching are baseline practice on every engagement, not an upsell.",
  },
  {
    title: "Transparent process",
    description:
      "Clear roadmaps, regular demos, and honest communication about cost, timeline, and scope.",
  },
];

export function WhySection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const rawItems = Array.isArray(c.items) ? c.items : [];
  const items = rawItems.length
    ? rawItems.map((i) => {
        const r = asRecord(i);
        return { title: text(r.title) || "Why", description: text(r.description) };
      })
    : DEFAULT_ITEMS;

  return (
    <Section className="gradient-top border-t border-border/40">
      <SectionHeading
        splitAccent
        eyebrow={c.eyebrow ? text(c.eyebrow) : "Why CodAstra"}
        title={c.title ? text(c.title) : "Software built for how your operation really runs"}
        description={c.description ? text(c.description) : undefined}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {items.slice(0, 4).map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <Reveal
              key={item.title}
              delay={(i % 2) * 80}
              from={i % 2 === 0 ? "left" : "right"}
            >
              <SpotlightCard
                strength={0.12}
                className="h-full rounded-2xl border border-border/70 bg-card/70 transition-transform duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex h-full gap-5 p-7">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-primary transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[0.65rem] font-bold text-primary/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-base font-semibold tracking-tight">{item.title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}