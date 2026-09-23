import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  /** Route of the related doc, used for the cross-link in the header. */
  relatedHref: "/terms" | "/privacy";
  relatedLabel: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({
  eyebrow,
  title,
  effectiveDate,
  relatedHref,
  relatedLabel,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={`${intro} Effective date: ${effectiveDate}.`}
      />
      <Container size="narrow" className="pb-16 md:pb-24">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {title} · {effectiveDate}
            </p>
            <Link
              href={relatedHref}
              className="rounded-xl border border-border/70 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {relatedLabel}
            </Link>
          </div>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-semibold tracking-tight">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-pretty text-sm leading-7 text-muted-foreground">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
