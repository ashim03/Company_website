import Link from "next/link";
import { Mail, Phone, MapPin, Globe, Music2, MessageCircle, Code2 } from "lucide-react";
import { getServices } from "@/lib/queries";
import { getSettings } from "@/lib/site-settings";
import { companyMap } from "@/lib/company-map";
import { Logo } from "@/components/site/logo";
import { Container } from "@/components/site/container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YoutubeIcon,
  WhatsappIcon,
} from "@/components/site/social-icons";

export async function Footer() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const social = settings.social;
  const companyLinks = [
    { label: "About us", url: "/company" },
    { label: "Careers", url: "/careers" },
    { label: "How we work", url: "/process" },
    { label: "Our work", url: "/work" },
    { label: "Classes", url: "/classes" },
    { label: "Services", url: "/services" },
  ];
  const resourceLinks = [
    { label: "Insights", url: "/insights" },
    { label: "Products", url: "/products" },
    { label: "Contact", url: "/contact" },
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Terms & Conditions", url: "/terms" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[#21244f] bg-[linear-gradient(135deg,#070B20,#10153D_55%,#2B105B)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 8% -5%, rgba(59,130,246,0.10), transparent 70%), radial-gradient(45% 40% at 95% 105%, rgba(34,211,238,0.08), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative grid gap-12 py-16 md:py-20 lg:grid-cols-[1.3fr_1fr_0.9fr_1fr]">
        <div className="flex flex-col gap-5">
          <Logo logo={settings.logo} darkLogo={settings.darkLogo} name={settings.companyName} variant="footer" />
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            {settings.footer.about}
          </p>
          <SocialRow social={social} email={settings.email.primary} />
          <div className="mt-1 flex flex-col gap-2.5 text-sm">
            {settings.address ? (
              <div className="inline-flex items-center gap-2.5 text-muted-foreground">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><MapPin className="size-4" /></span>
                <address className="not-italic">{settings.mapPublished ? <a href={companyMap(settings.address, settings.mapUrl).directions} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{settings.address}</a> : settings.address}</address>
              </div>
            ) : null}
            {settings.phone.primary ? (
              <a
                href={`tel:${settings.phone.primary}`}
                className="inline-flex w-fit items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="size-4" />
                </span>
                {settings.phone.primary}
              </a>
            ) : null}
            {settings.email.primary ? (
              <a
                href={`mailto:${settings.email.primary}`}
                className="inline-flex w-fit items-center gap-2.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-4" />
                </span>
                {settings.email.primary}
              </a>
            ) : null}
          </div>
        </div>

        <FooterColumn title="Services">
          <ul className="grid grid-cols-1 gap-2.5">
            {services.slice(0, 8).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm text-muted-foreground transition-all hover:pl-1 hover:text-foreground"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Company">
          <ul className="grid grid-cols-1 gap-2.5">
            {companyLinks.map((l) => (
              <li key={l.url}>
                <Link
                  href={l.url}
                  className="text-sm text-muted-foreground transition-all hover:pl-1 hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Resources">
          <ul className="grid grid-cols-1 gap-2.5">
            {resourceLinks.map((l) => (
              <li key={l.url}>
                <Link
                  href={l.url}
                  className="text-sm text-muted-foreground transition-all hover:pl-1 hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="footer-consultation group mt-5 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-[transform,box-shadow,background] hover:-translate-y-0.5"
          >
            <span>Get a free consultation</span>
            <span className="text-primary transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </FooterColumn>
      </Container>

      <div className="relative border-t border-border/50">
        <Container className="flex flex-col items-start justify-between gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center">
          <p>{settings.footer.copyright}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {"// Designed by humans. Built with AI."}
          </p>
        </Container>
      </div>
    </footer>
  );
}

function SocialRow({
  social,
  email,
}: {
  email: string;
  social: {
    published?: boolean;
    hidden?: string[];
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
    extra?: { label: string; url: string; demo: boolean; published?: boolean }[];
  };
}) {
  if (social.published === false) return null;
  const standard = [
    { href: email ? `mailto:${email}` : undefined, icon: Mail, label: "Email CodAstra Labs" },
    { href: social.facebook, icon: FacebookIcon, label: "Facebook" },
    { href: social.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
    { href: social.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: social.youtube, icon: YoutubeIcon, label: "YouTube" },
    { href: social.whatsapp, icon: WhatsappIcon, label: "WhatsApp" },
  ].filter(item => !social.hidden?.includes(item.label.toLowerCase())).map(item => ({ ...item, demo: false }));
  const items = [...standard, ...(social.extra ?? []).filter(item => item.published !== false).map(item => ({
    href: item.url,
    label: item.label,
    demo: item.demo,
    icon: ({ facebook: FacebookIcon, instagram: InstagramIcon, linkedin: LinkedInIcon, youtube: YoutubeIcon, whatsapp: WhatsappIcon, tiktok: Music2, reddit: MessageCircle, github: Code2 } as Record<string, React.ComponentType<{ className?: string }>>)[item.label.toLowerCase()] ?? Globe,
  }))].filter((i) => i.href && /^(https?:\/\/|mailto:)/i.test(i.href));

  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <a
            key={`${item.label}-${index}`}
            href={item.href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.label}${item.demo ? " (demo link)" : ""}`}
            title={`${item.label}${item.demo ? " (demo link)" : ""}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-slate-200 transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:bg-white/10 hover:text-white"
          >
            <Icon className="size-4" />
            {item.demo ? <span className="sr-only">Demo</span> : null}
          </a>
        );
      })}
      {items.some(item => item.demo) ? <p className="w-full text-xs text-slate-400">Demo social links — company profiles coming soon.</p> : null}
    </div>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      {children}
    </div>
  );
}
