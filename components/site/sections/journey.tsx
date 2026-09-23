import { Lightbulb, Flag, Hammer, FolderKanban, Rocket, TrendingUp } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { GlowDot } from "@/components/site/visuals/shared";

const DEFAULT_STEPS = [
  {
    label: "Idea",
    description: "A product that outgrows spreadsheets.",
    icon: Lightbulb,
  },
  {
    label: "Founded",
    description: "CodAstraLabs is set up from Kathmandu.",
    icon: Flag,
  },
  {
    label: "Built",
    description: "Focused SaaS with real operational depth.",
    icon: Hammer,
  },
  {
    label: "Projects",
    description: "Live portals, workflows, and automation.",
    icon: FolderKanban,
  },
  {
    label: "Products",
    description: "BridgeLabs, PlatterLabs, and the products we run.",
    icon: Rocket,
  },
  {
    label: "Growth",
    description: "One accountable team, continuously shipping.",
    icon: TrendingUp,
  },
] as const;

/**
 * Company page journey: Idea → Founded → Built → Projects → Products →
 * Growth. A stepper with an animated gradient spine that fills as each
 * milestone is reached during scroll. Falls back to a clean static timeline
 * (section is server-rendered; only the fill uses a scrolled class).
 */
export function JourneySection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const eyebrow = c.eyebrow ? text(c.eyebrow) : "The company journey";
  const title = c.title ? text(c.title) : "From idea to operating product.";
  const description = c.description
    ? text(c.description)
    : "The path CodAstraLabs took — from a product idea to software that runs real operations every day.";
  const rawSteps = Array.isArray(c.steps) ? c.steps : [];

  const steps = rawSteps.length
    ? rawSteps.map((s) => {
        const r = asRecord(s);
        return { label: text(r.label), description: text(r.description) };
      })
    : DEFAULT_STEPS.map((s) => ({ label: s.label, description: s.description }));

  return (
    <Section className="gradient-top border-t border-border/40">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <ol className="relative mx-auto max-w-3xl space-y-8 lg:space-y-0" data-journey-scroll>
        {/* spine */}
        <div
          className="absolute inset-y-0 left-[18px] w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent lg:inset-x-0 lg:top-1/2 lg:bottom-auto lg:left-0 lg:h-px lg:w-full lg:bg-gradient-to-r"
          aria-hidden="true"
        />

        <div className="grid gap-6 lg:grid-cols-6 lg:gap-4">
          {steps.map((step, i) => {
            const StepIcon = DEFAULT_STEPS[i]?.icon ?? Lightbulb;
            return (
              <li key={step.label} className="relative lg:pt-10 lg:text-center">
                <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-3">
                  <Reveal rise delay={i * 90} className="relative shrink-0">
                    <span className="relative grid size-9 place-items-center rounded-xl gradient-border bg-card text-primary shadow-card">
                      <StepIcon className="size-4" />
                    </span>
                    <GlowDot className="absolute -right-1 -top-1" />
                  </Reveal>
                  <Reveal rise delay={i * 90 + 40} className="lg:text-center">
                    <h3 className="text-sm font-bold tracking-tight text-foreground">{step.label}</h3>
                    <p className="mt-1 max-w-[15rem] text-xs leading-5 text-muted-foreground lg:max-w-none">
                      {step.description}
                    </p>
                  </Reveal>
                </div>
              </li>
            );
          })}
        </div>
      </ol>
    </Section>
  );
}