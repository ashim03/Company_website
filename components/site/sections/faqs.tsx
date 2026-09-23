import { Plus } from "lucide-react";
import { Inner, text, asRecord } from "@/lib/types";
import { getFaqs } from "@/lib/queries";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export async function FaqsSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const faqs = await getFaqs();
  if (!faqs.length) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow={c.eyebrow ? text(c.eyebrow) : "FAQ"}
        title={c.title ? text(c.title) : "Frequently asked questions"}
        description={c.description ? text(c.description) : undefined}
      />
      <Reveal>
        <div className="mx-auto max-w-3xl divide-y divide-border/60 rounded-2xl gradient-border bg-card/70 px-6 sm:px-8">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                <span className="transition-colors group-open:text-primary">
                  {faq.question}
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-300 group-open:rotate-45 group-open:border-primary/50 group-open:bg-gradient-to-br group-open:from-blue-500 group-open:to-cyan-500 group-open:text-white">
                  <Plus className="size-4" />
                </span>
              </summary>
              <p className="pb-6 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}