"use client";

import * as React from "react";
import { LayoutDashboard, TrendingUp, Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualFrame, GlowDot } from "./shared";

/**
 * Products page visual: a floating showcase of the real products. One
 * product is the large "in-focus" panel; the others float alongside at a
 * smaller scale. Focus auto-rotates (CSS + a light interval) and can be
 * pinned by hovering/clicking a panel. Under reduced motion everything
 * renders statically.
 */

export interface ShowcaseProduct {
  name: string;
  tagline?: string | null;
  logo?: string | null;
  features: string[];
}

const BARS = [52, 68, 44, 82, 61, 90, 73, 84];

export function ProductShowcase({
  products,
  className,
}: {
  products: ShowcaseProduct[];
  className?: string;
}) {
  const [front, setFront] = React.useState(0);

  React.useEffect(() => {
    if (products.length < 2) return;
    if (typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => setFront((f) => (f + 1) % products.length), 3400);
    return () => clearInterval(id);
  }, [products.length]);

  if (products.length === 0) return null;

  const focused = products[front];

  return (
    <VisualFrame className={cn("w-full", className)}>
      <div className="relative flex min-h-[24rem] flex-col gap-5 p-6 sm:p-8 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/3 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        {/* Focus panel */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setFront((f) => (f + 1) % products.length)}
            className="group w-full rounded-2xl gradient-border bg-card/90 p-5 text-left shadow-soft sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {focused.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={focused.logo}
                    alt=""
                    className="size-12 rounded-xl border border-border/60 object-cover sm:size-14"
                  />
                ) : (
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary sm:size-14">
                    <LayoutDashboard className="size-6" />
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {focused.name}
                  </h3>
                  {focused.tagline ? (
                    <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary sm:text-[0.68rem]">
                      {focused.tagline}
                    </p>
                  ) : null}
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-success">
                <GlowDot tone="success" /> live
              </span>
            </div>

            <div className="mt-5 flex h-16 items-end gap-1 sm:h-20">
              {BARS.map((h, bi) => (
                <span
                  key={bi}
                  className="animate-bar-grow w-full rounded-sm bg-gradient-to-t from-blue-500/70 to-cyan-400/70 motion-reduce:animate-none"
                  style={{ height: `${h}%`, animationDelay: `${bi * -0.18}s` }}
                />
              ))}
            </div>

            {focused.features.length > 0 ? (
              <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
                {focused.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="size-3.5 shrink-0 text-primary" />
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-primary">
              open product <ArrowUpRight className="size-3.5" />
            </span>
          </button>
        </div>

        {/* Floating mini panels */}
        <div className="relative hidden lg:block">
          {products
            .slice(0, 4)
            .filter((p) => p.name !== focused.name)
            .map((p, i) => {
              const pos = [
                "left-[4%] top-[2%]",
                "right-[2%] top-[30%]",
                "left-[6%] bottom-[2%]",
              ][i % 3];
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setFront(products.indexOf(p))}
                  className={cn(
                    "animate-bob absolute flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card/90 px-4 py-3 shadow-card backdrop-blur transition-all duration-300 hover:border-primary/50 motion-reduce:animate-none",
                    pos
                  )}
                  style={{ animationDelay: `${(i + 1) * -1.1}s` }}
                >
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.logo} alt="" className="size-7 rounded-lg border border-border/50 object-cover" />
                ) : (
                  <span className="grid size-7 place-items-center rounded-lg bg-primary/15 text-primary">
                    <LayoutDashboard className="size-3.5" />
                  </span>
                )}
                <span className="text-xs font-bold text-foreground">{p.name}</span>
                <span className="flex items-center gap-1 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-muted-foreground">
                  <TrendingUp className="size-3 text-success" /> shipped
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </VisualFrame>
  );
}