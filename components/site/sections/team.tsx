import { Mail } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { getTeam } from "@/lib/queries";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { SpotlightCard } from "@/components/site/spotlight-card";

export async function TeamSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const members = await getTeam();

  return (
    <Section>
      <SectionHeading
        eyebrow={c.eyebrow ? text(c.eyebrow) : "The team"}
        title={c.title ? text(c.title) : "Engineers, designers, and product minds"}
        description={c.description ? text(c.description) : undefined}
      />
      {members.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.slice(0, 8).map((m, i) => (
          <Reveal key={m.id} delay={(i % 4) * 70}>
            <SpotlightCard
              strength={0.14}
              className="h-full rounded-2xl border border-border/70 bg-card/70 transition-colors hover:border-primary/40"
            >
              <figure className="group flex h-full flex-col gap-3 p-6">
                <div className="relative w-fit">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="size-16 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-card transition-all duration-300 group-hover:ring-primary/60"
                    />
                  ) : (
                    <span className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xl font-bold text-white">
                      {m.name.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card bg-success" />
                </div>
                <figcaption className="flex flex-1 flex-col">
                  <div className="text-base font-semibold tracking-tight">{m.name}</div>
                  {m.role && (
                    <div className="mt-0.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-primary">
                      {m.role}
                    </div>
                  )}
                  {m.bio && (
                    <p className="mt-2.5 text-xs leading-5 text-muted-foreground">{m.bio}</p>
                  )}
                </figcaption>
                {m.email ? (
                  <a
                    href={`mailto:${m.email}`}
                    aria-label={`Email ${m.name}`}
                    className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                  >
                    <Mail className="size-3.5" />
                    Email
                  </a>
                ) : null}
              </figure>
            </SpotlightCard>
          </Reveal>
        ))}
      </div> : (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
          <p className="text-base font-medium">A focused team is taking shape.</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            We keep the team close to the work. Meet the people behind CodAstra Labs here as each role and profile is ready to share.
          </p>
        </div>
      )}
    </Section>
  );
}
