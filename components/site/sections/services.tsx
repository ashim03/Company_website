import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Inner, text, asRecord, stringArray } from "@/lib/types";
import { Section, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { SpotlightCard } from "@/components/site/spotlight-card";
import { ServiceIcon } from "@/components/site/service-icon";

interface Pillar {
  title: string;
  href?: string;
  icon?: string;
  points: string[];
}

const DEFAULT_ITEMS: Pillar[] = [
  {
    title: "Digital Marketing",
    href: "/services/digital-marketing-branding",
    icon: "trending-up",
    points: [
      "Social media marketing",
      "Social media strategy",
      "SEO",
      "Paid advertising",
      "Content marketing",
      "Digital campaigns",
    ],
  },
  {
    title: "Graphic Design & Creative Services",
    href: "/services/digital-marketing-branding",
    icon: "paintbrush",
    points: [
      "Brand identity",
      "Logo design",
      "Social media graphics",
      "Marketing creatives",
      "Promotional materials",
      "Visual content",
    ],
  },
  {
    title: "Social Media Management",
    href: "/services/digital-marketing-branding",
    icon: "globe",
    points: [
      "Facebook, Instagram & TikTok management",
      "Content planning",
      "Post & reel creation",
      "Community management",
      "Analytics and reporting",
    ],
  },
  {
    title: "Web & Software Solutions",
    href: "/services/web-apps",
    icon: "code",
    points: [
      "Website development",
      "Web apps",
      "Mobile apps",
      "Custom software",
      "SaaS",
      "Business automation",
    ],
  },
  {
    title: "IT & Digital Solutions",
    href: "/services/cloud-devops",
    icon: "shield",
    points: [
      "Cloud solutions",
      "API integration",
      "Technical support",
      "Network solutions",
      "Cybersecurity",
      "Technology consulting",
    ],
  },
  {
    title: "Professional Classes & Training",
    href: "/classes",
    icon: "rocket",
    points: [
      "IT and digital marketing classes",
      "Graphic design classes",
      "Web development classes",
      "Practical, hands-on training",
      "Career-oriented courses",
    ],
  },
];

export function ServicesSection({ content }: { content: Inner }) {
  const c = asRecord(content);
  const rawItems = Array.isArray(c.items) ? c.items : [];
  const items: Pillar[] = rawItems.length
    ? rawItems.map((item) => {
        const r = asRecord(item);
        return {
          title: text(r.title) || "Service",
          href: text(r.href).startsWith("/") && !text(r.href).startsWith("//") ? text(r.href) : "/services",
          icon: r.icon ? text(r.icon) : undefined,
          points: stringArray(r.points),
        };
      })
    : DEFAULT_ITEMS;

  return (
    <Section id="services" className="gradient-top border-t border-border/40">
      <div className="flex items-end justify-between gap-6">
        <SectionHeading
          align="left"
          className="!mb-10"
          splitAccent
          eyebrow={c.eyebrow ? text(c.eyebrow) : "What we do"}
          title={c.title ? text(c.title) : "Digital solutions, creative services, and professional training"}
          description={
            c.description
              ? text(c.description)
              : "Six service pillars covering everything your brand needs to grow — from marketing and design to software, IT, and hands-on classes."
          }
        />
        <Link
          href="/services"
          className="group hidden shrink-0 items-center gap-1.5 pb-1 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-primary/80 md:inline-flex"
        >
          All services
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((pillar, i) => (
          <Reveal key={pillar.title} delay={(i % 3) * 70} rise initialVisible>
            <SpotlightCard className="h-full rounded-2xl border border-border/70 bg-card/70 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_48px_-24px_rgba(59,130,246,0.45)]">
              <div className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl gradient-border bg-card text-primary">
                    <ServiceIcon icon={pillar.icon} className="size-6" />
                  </span>
                  <span className="font-mono text-sm font-bold tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{pillar.title}</h3>
                <ul className="grid gap-2 border-t border-border/60 pt-4">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Check className="size-2.5" />
                      </span>
                      <span className="text-sm leading-5 text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
                <Link href={pillar.href || "/services"} aria-label={`Explore ${pillar.title}`} className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                  Explore service
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
