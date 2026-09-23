"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import type { NavNode } from "@/lib/types";

export function MobileNav({
  nav,
  companyName,
  logo,
}: {
  nav: NavNode[];
  companyName: string;
  logo?: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const openRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const triggerButton = openRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      triggerButton?.focus();
    };
  }, [open]);

  return (
    <>
      <Button
        ref={openRef}
        variant="ghost"
        size="icon"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-background shadow-soft">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <Logo logo={logo} name={companyName} />
              <Button
                ref={closeRef}
                variant="ghost"
                size="icon"
                aria-label="Close navigation menu"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {nav.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-secondary"
                    >
                      {item.label}
                    </Link>
                    {item.children.length > 0 ? (
                      <ul className="mt-1 space-y-1 border-l pl-4">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={child.url}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t p-4">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}