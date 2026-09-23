import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getServices } from "@/lib/queries";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { ServiceIcon } from "@/components/site/service-icon";
import { ServicesEcosystem } from "@/components/site/visuals/services-ecosystem";
import { text } from "@/lib/types";

export const metadata: Metadata = {
  title: "Services — CodAstra Labs",
  description:
    "Websites, web apps, mobile apps, automation, cloud & DevOps, security, and digital marketing — full-stack services for real operations.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        splitHeading
        title="Software services for the whole product lifecycle"
        description="From a marketing website to an internal operations tool, we design, build, and run software that fits how your operation actually works."
      />
      {services.length > 0 ? (
        <Container size="wide" className="pt-0">
          <ServicesEcosystem services={services} className="min-h-[24rem]" />
        </Container>
      ) : null}
      <Container className="py-16 md:py-24">
        {services.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Services are being prepared — check back soon.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 70}>
                <SpotlightCard className="h-full rounded-2xl border border-border/70 bg-card/70 transition-colors hover:border-primary/40">
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex h-full flex-col gap-5 p-7"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex size-12 items-center justify-center rounded-xl gradient-border bg-card text-primary">
                        <ServiceIcon icon={s.icon} className="size-6" />
                      </span>
                      <span className="font-mono text-sm font-bold tabular-nums text-primary/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col gap-2">
                      <h2 className="text-lg font-semibold tracking-tight">{s.name}</h2>
                      {s.shortDescription ? (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {text(s.shortDescription)}
                        </p>
                      ) : null}
                    </div>
                    {s.features.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {s.features.slice(0, 3).map((f) => (
                          <span
                            key={f}
                            className="rounded-full border border-border/70 bg-muted/40 px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <span className="mt-auto inline-flex items-center gap-1.5 border-t border-border/60 pt-4 text-sm font-semibold text-primary">
                      Explore service
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}