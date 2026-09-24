import type { Metadata } from "next";
import { ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";
import { getVacancies } from "@/lib/careers";
import { isOpenVacancy } from "@/lib/careers-schema";
import { getSettings } from "@/lib/site-settings";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/site/container";

export const metadata: Metadata = { title: "Careers — CodAstra Labs", description: "Explore open roles at CodAstra Labs in Kathmandu. Help us build thoughtful software, design, and digital experiences." };
export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const [vacancies, settings] = await Promise.all([getVacancies(), getSettings()]);
  const open = vacancies.filter(v => isOpenVacancy(v));
  return <>
    <PageHeader eyebrow="Careers" title="Build your next chapter with us." description="Bring your curiosity, craft, and ideas to a team working across software, design, and digital growth in Kathmandu." />
    <Container className="pb-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3 border-b pb-6"><h2 className="text-2xl font-semibold">Open positions</h2><span className="text-sm text-muted-foreground">{open.length} {open.length === 1 ? "opportunity" : "opportunities"}</span></div>
      <div className="space-y-5">
        {open.map(v => <article key={v.id} className="rounded-2xl border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="mb-2 text-sm text-primary">{v.department || "CodAstra Labs"}</p><h3 className="text-xl font-semibold">{v.title}</h3><div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground"><span className="inline-flex items-center gap-1.5"><MapPin size={16} />{v.location}</span><span className="inline-flex items-center gap-1.5"><BriefcaseBusiness size={16} />{v.type}</span>{v.deadline && <span>Apply by {v.deadline}</span>}</div></div><a href={v.applicationUrl || `mailto:${settings.email.primary}?subject=${encodeURIComponent(`Application: ${v.title}`)}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">Apply for this role <ArrowUpRight size={16} /></a></div>
          <details className="group mt-6 border-t pt-4"><summary className="cursor-pointer py-2 font-medium text-primary">Role details and requirements</summary><p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{v.description}</p>{v.requirements && <><h4 className="mt-5 font-semibold">What you’ll bring</h4><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{v.requirements.split("\n").filter(Boolean).map((line, i) => <li key={i}>{line}</li>)}</ul></>}</details>
        </article>)}
        {!open.length && <div className="rounded-2xl border bg-card px-6 py-14 text-center"><BriefcaseBusiness className="mx-auto mb-5 size-9 text-primary" /><h3 className="text-xl font-semibold">No open positions right now</h3><p className="mx-auto mt-3 max-w-lg text-muted-foreground">We’ll post new opportunities here as our team grows. You’re welcome to introduce yourself and share your portfolio.</p><a href={`mailto:${settings.email.primary}?subject=Careers%20at%20CodAstra%20Labs`} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">Introduce yourself <ArrowUpRight size={16} /></a></div>}
      </div>
    </Container>
  </>;
}
