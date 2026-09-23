import { Inner, text, asRecord } from "@/lib/types";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

const DEFAULT_STEPS = [
  {
    title: "Discovery",
    description:
      "We map the operation — workflows, people, bottlenecks — and define what success looks like in measurable terms.",
  },
  {
    title: "Design",
    description:
      "Interface and architecture designed together, with your team, so the final build matches how you actually work.",
  },
  {
    title: "Build",
    description:
      "Clean, testable code shipped in small increments. You see working software early and often, never a big reveal.",
  },
  {
    title: "Deploy & maintain",
    description:
      "Automated deployment, monitoring, security patching, and support — we stay after launch so the product keeps running.",
  },
];

export function ProcessSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const rawSteps = Array.isArray(c.steps) ? c.steps : [];
  const steps = rawSteps.length
    ? rawSteps.map((s) => {
        const r = asRecord(s);
        return { title: text(r.title) || "Step", description: text(r.description) };
      })
    : DEFAULT_STEPS;

  return (
    <Section>
      <SectionHeading
        splitAccent
        eyebrow={c.eyebrow ? text(c.eyebrow) : "How we work"}
        title={c.title ? text(c.title) : "A process that treats software like an operation"}
        description={
          c.description
            ? text(c.description)
            : "No black boxes, no surprise deadlines. A clear, collaborative process from first conversation to post-launch support."
        }
      />
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/60">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={(i % 4) * 80} className="h-full">
            <li className="group relative flex h-full flex-col gap-3 bg-card/80 p-7 transition-colors hover:bg-card">
              <span className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
              <span className="flex items-center gap-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary">
                <span className="gradient-border rounded-lg bg-card px-1.5 py-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                step
              </span>
              <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}