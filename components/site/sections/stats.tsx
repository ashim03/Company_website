import { Inner, text, asRecord } from "@/lib/types";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Counter } from "@/components/site/counter";

export function StatsSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const rawStats = Array.isArray(c.stats) ? c.stats : [];
  const stats = rawStats
    .map((s) => {
      const r = asRecord(s);
      return { value: text(r.value), label: text(r.label) };
    })
    .filter((s) => s.value || s.label);

  if (stats.length === 0) return null;

  const caption = c.title ? text(c.title) : "";

  return (
    <Section className="!py-14">
      <Reveal>
        <div className="bg-noise relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-500 px-8 py-12 text-white md:px-14 md:py-16">
          <div className="animate-spin-slow pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-white/20 motion-reduce:animate-none" aria-hidden="true" />
          <div className="animate-spin-slow pointer-events-none absolute -bottom-28 -left-20 size-80 rounded-full border border-white/15 [animation-direction:reverse] motion-reduce:animate-none" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/15 blur-3xl motion-reduce:hidden" aria-hidden="true" />
          <div className="relative">
            {caption ? (
              <p className="mb-10 max-w-xl text-pretty text-sm leading-6 text-white/90 md:text-base">
                {caption}
              </p>
            ) : null}
            <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-12">
              {stats.map((stat, i) => (
                <div
                  key={stat.label || `stat-${i}`}
                  className="flex flex-col gap-2 border-l border-white/25 pl-5"
                >
                  <dt className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
                    <Counter value={stat.value} />
                  </dt>
                  <dd className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white/80">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}