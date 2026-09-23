import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Shield } from "lucide-react";
import { getService, getServices } from "@/lib/queries";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { ServiceIcon } from "@/components/site/service-icon";
import { text } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ServiceStage } from "@/components/site/service-stage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};
  return {
    title: `${service.name} Services — CodAstra Labs`,
    description: text(service.shortDescription) || text(service.fullDescription) || undefined,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const others = (await getServices()).filter((s) => s.id !== service.id).slice(0, 4);

  return (
    <>
      <PageHeader
        breadcrumbs={[{ name: "Services", href: "/services" }, { name: service.name }]}
        eyebrow={text(service.shortDescription) || service.name}
        title={service.name}
        description={text(service.fullDescription)}
      />

      <Container size="wide" className="pt-0">
        <ServiceStage icon={service.icon} slug={service.slug} className="min-h-[22rem]" />
      </Container>

      <Container className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-10">
            {service.features.length > 0 ? (
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight">What&apos;s included</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm leading-6">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="size-3 text-primary" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {service.benefits.length > 0 ? (
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight">Benefits</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm leading-6">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <Check className="size-3 text-primary" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {service.technologies.length > 0 ? (
              <section>
                <h2 className="mb-4 text-xl font-semibold tracking-tight">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Reveal>
              <div className="tech-grid relative overflow-hidden rounded-2xl border bg-card p-8 shadow-soft">
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <ServiceIcon icon={service.icon} className="size-7" />
                </div>
                <h2 className="mt-5 text-xl font-bold tracking-tight">
                  Need {service.name.toLowerCase()}?
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Tell us about your operation and we&apos;ll map out the right approach — no obligation, no jargon.
                </p>
                <Link href="/contact" className={cn(buttonVariants({ className: "mt-5 w-full" }))}>
                  Start a conversation
                </Link>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="size-3.5" /> Security and data confidentiality by default
                </p>
              </div>
            </Reveal>

            {others.length > 0 ? (
              <Reveal>
                <div className="rounded-2xl border bg-card p-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Other services
                  </h3>
                  <ul className="space-y-2">
                    {others.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </aside>
        </div>
      </Container>
    </>
  );
}