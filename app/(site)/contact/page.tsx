import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { getServices, getFaqs } from "@/lib/queries";
import { getSettings } from "@/lib/site-settings";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";
import { ContactForm } from "@/components/site/contact-form";
import { ContactNetwork } from "@/components/site/visuals/contact-network";
import { text } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact — CodAstra Labs",
  description:
    "Talk to the CodAstra Labs team about your project, product questions, or a partnership.",
};

export default async function ContactPage() {
  const [services, faqs, settings] = await Promise.all([
    getServices(),
    getFaqs(),
    getSettings(),
  ]);

  const serviceOptions = services.map((s) => ({ slug: s.slug, name: s.name }));

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        splitHeading
        title="Talk to CodAstraLabs."
        description="Contact us for BridgeLabs onboarding, future products, partnerships, or custom product work."
      />

      <Container size="wide" className="pt-0">
        <ContactNetwork className="min-h-[22rem]" />
      </Container>

      <Container className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.75fr]">
          <ContactForm services={serviceOptions} />

          <aside className="space-y-6">
            <div className="rounded-2xl gradient-border bg-card/80 p-6">
              <h2 className="text-lg font-semibold">Direct lines</h2>
              <ul className="mt-4 space-y-4">
                {settings.email.primary ? (
                  <li>
                    <a
                      href={`mailto:${settings.email.primary}`}
                      className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-primary transition-transform group-hover:scale-110">
                        <Mail className="size-5" />
                      </span>
                      {settings.email.primary}
                    </a>
                  </li>
                ) : null}
                {settings.phone.primary ? (
                  <li>
                    <a
                      href={`tel:${settings.phone.primary}`}
                      className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-primary transition-transform group-hover:scale-110">
                        <Phone className="size-5" />
                      </span>
                      {settings.phone.primary}
                    </a>
                  </li>
                ) : null}
                {settings.social.whatsapp ? (
                  <li>
                    <a
                      href={settings.social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-primary transition-transform group-hover:scale-110">
                        <MessageCircle className="size-5" />
                      </span>
                      WhatsApp
                    </a>
                  </li>
                ) : null}
                {settings.address ? (
                  <li className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/15 to-cyan-400/15 text-primary">
                      <MapPin className="size-5" />
                    </span>
                    {text(settings.address)}
                  </li>
                ) : null}
              </ul>
            </div>

            {faqs.length > 0 ? (
              <div className="rounded-2xl gradient-border bg-card/80 p-6">
                <h2 className="text-lg font-semibold">Before you write</h2>
                <ul className="mt-4 space-y-3">
                  {faqs.slice(0, 3).map((faq) => (
                    <li key={faq.id}>
                      <details className="group">
                        <summary className="cursor-pointer list-none text-sm font-medium [&::-webkit-details-marker]:hidden">
                          {faq.question}
                        </summary>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {faq.answer}
                        </p>
                      </details>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="tech-grid relative overflow-hidden rounded-2xl gradient-border bg-card/80 p-6">
              <div className="animate-scan pointer-events-none absolute inset-0 h-1/3 bg-gradient-to-b from-transparent via-primary/10 to-transparent" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Prefer to start with a call?</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Tell us a little about what you&apos;re trying to build and we&apos;ll set up a short,
                practical conversation — no sales pitch.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}