import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getNavTree } from "@/lib/queries";
import { getSettings } from "@/lib/site-settings";
import { Logo } from "@/components/site/logo";
import { Container } from "@/components/site/container";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { MobileNav } from "@/components/site/mobile-nav";
import { DesktopNav } from "@/components/site/desktop-nav";

export async function Header() {
  const [nav, settings] = await Promise.all([getNavTree(), getSettings()]);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border text-foreground shadow-[0_4px_20px_rgba(15,23,42,0.05)]">
      <Container className="flex h-24 items-center justify-between gap-4">
        <Logo logo={settings.logo} darkLogo={settings.darkLogo} name={settings.companyName} priority />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 xl:flex"
        >
          <DesktopNav items={nav} />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/contact"
            className="group relative hidden overflow-hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_rgba(59,130,246,0.7)] transition-shadow hover:shadow-[0_14px_36px_-8px_rgba(34,211,238,0.6)] sm:inline-flex sm:items-center sm:gap-1.5"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative flex items-center gap-1.5">
              Start a project
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
          <div className="xl:hidden">
            <MobileNav
              nav={nav}
              companyName={settings.companyName}
              logo={settings.logo}
              darkLogo={settings.darkLogo}
            />
          </div>
        </div>
      </Container>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden="true"
      />
    </header>
  );
}


