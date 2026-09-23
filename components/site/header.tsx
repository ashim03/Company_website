import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { getNavTree } from "@/lib/queries";
import { getSettings } from "@/lib/site-settings";
import { Logo } from "@/components/site/logo";
import { Container } from "@/components/site/container";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { MobileNav } from "@/components/site/mobile-nav";
import type { NavNode } from "@/lib/types";

export async function Header() {
  const [nav, settings] = await Promise.all([getNavTree(), getSettings()]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8EAF4] bg-white/98 shadow-[0_4px_20px_rgba(25,35,100,0.05)] backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo logo={settings.logo} name={settings.companyName} priority />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 lg:flex"
        >
          <NavItems items={nav} />
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
          <div className="lg:hidden">
            <MobileNav
              nav={nav}
              companyName={settings.companyName}
              logo={settings.logo}
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

function NavItems({ items }: { items: NavNode[] }) {
  if (!items.length) return null;
  return (
    <ul className="flex items-center">
      {items.map((item) => {
        if (item.children.length > 0) {
          return (
            <li key={item.id} className="group relative">
              <button
                type="button"
                className="flex h-16 items-center gap-1 px-3.5 text-[0.95rem] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-haspopup="true"
              >
                {item.label}
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-[opacity,visibility] group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <ul className="w-56 overflow-hidden rounded-xl border bg-popover/95 p-1.5 shadow-soft backdrop-blur-xl">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={child.url}
                        className="group/child flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      >
                        {child.label}
                        <ArrowUpRight className="size-3.5 -translate-x-1 translate-y-1 opacity-0 transition-all group-hover/child:translate-x-0 group-hover/child:translate-y-0 group-hover/child:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        }
        return (
          <li key={item.id} className="group">
            <Link
              href={item.url}
              className="relative flex h-16 items-center px-3.5 text-[0.95rem] font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-[1.05rem] after:left-1/2 after:h-[3px] after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-blue-500 after:to-cyan-400 after:transition-all after:duration-300 group-hover:after:w-5"
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}