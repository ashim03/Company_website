import Image from "next/image";
import { Inner, text, asRecord } from "@/lib/types";
import { getClients } from "@/lib/queries";
import { Marquee } from "@/components/site/marquee";
import { SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export async function ClientsSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const clients = await getClients();
  const visible = clients.filter((item) => item.isVisible !== false);
  if (!visible.length) return null;

  return (
    <section className="gradient-top relative overflow-hidden border-y border-border/40 bg-background/40 py-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(59,130,246,0.08), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          splitAccent
          eyebrow={c.eyebrow ? text(c.eyebrow) : "Companies we work with"}
          title={c.title ? text(c.title) : "Trusted by organizations that value practical work"}
        />
      </div>

      <Reveal rise delay={100} initialVisible className="mt-10">
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background/90 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background/90 to-transparent"
            aria-hidden="true"
          />
          <Marquee duration={Math.max(20, visible.length * 6)}>
            {visible.map((client) => (
              <div
                key={client.id}
                className="group flex w-56 shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card/70 px-6 py-6 text-center transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_48px_-24px_rgba(59,130,246,0.35)]"
              >
                {client.logo ? (
                  <Image
                    src={client.logo}
                    alt={client.name}
                    width={120}
                    height={44}
                    className="max-h-9 w-auto max-w-full object-contain opacity-60 saturate-0 transition-[opacity,filter] duration-300 group-hover:opacity-100 group-hover:saturate-100"
                    sizes="120px"
                  />
                ) : (
                  <span className="flex size-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {client.name}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </Reveal>
    </section>
  );
}