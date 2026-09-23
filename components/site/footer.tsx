import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { getServices } from "@/lib/queries";
import { getSettings } from "@/lib/site-settings";
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
    <footer className="relative overflow-hidden border-t border-border/60 bg-background/70 backdrop-blur-xl">
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
          <Logo logo={settings.logo} name={settings.companyName} />
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            {settings.footer.about}
          </p>
          <SocialRow social={social} />
          <div className="mt-1 flex flex-col gap-2.5 text-sm">
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
            className="group mt-5 flex items-center justify-between rounded-xl gradient-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5"
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
            {"// software, design & operations — Nepal & worldwide"}
          </p>
        </Container>
      </div>
    </footer>
  );
}

function SocialRow({
  social,
}: {
  social: {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
}) {
  const items = [
    { href: social.facebook, icon: FacebookIcon, label: "Facebook" },
    { href: social.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
    { href: social.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: social.youtube, icon: YoutubeIcon, label: "YouTube" },
    { href: social.whatsapp, icon: WhatsappIcon, label: "WhatsApp" },
  ].filter((i) => i.href);

  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.label}
            href={item.href!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            <Icon className="size-4" />
          </a>
        );
      })}
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