"use client";

import * as React from "react";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SafeProduct } from "@/lib/types";

/**
 * Hero "~/codastra" panel: a terminal that types the code out live, then
 * seamlessly switches to a mini product interface that cycles through the
 * real products one at a time. Content is always in the DOM (never blank) —
 * the animation only dims not-yet-typed characters and fades between views,
 * and is fully bypassed under reduced motion.
 */

const CODE_LINES = [
  { indent: 0, text: "const grow = (brand) => {" },
  { indent: 2, text: "const reach  = market(brand);" },
  { indent: 2, text: "const craft  = design(brand);" },
  { indent: 2, text: "const build  = ship(brand);" },
  { indent: 2, text: "const skills = train(people);" },
  { indent: 2, text: "return { reach, craft, build, skills };" },
  { indent: 0, text: "};" },
];

const TOTAL = CODE_LINES.reduce((n, l) => n + l.text.length, 0);

function getReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

const TABS = [
  { id: "code", label: "~/codastra", icon: LayoutDashboard },
  { id: "product", label: "products.live", icon: ShieldCheck },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PRODUCT_ROWS = [
  { name: "New enquiry — source: website", meta: "2m ago", status: "open", icon: Megaphone },
  { name: "Support ticket — onboarding", meta: "18m ago", status: "open", icon: Sparkles },
  { name: "Design revision — brand kit", meta: "1h ago", status: "done", icon: Palette },
  { name: "Class enrollment — digital skills", meta: "3h ago", status: "done", icon: GraduationCap },
];

const BARS = [44, 62, 38, 74, 55, 88, 66, 93, 71, 84];

function toMiniProduct(p: SafeProduct) {
  return {
    name: p.name,
    tagline: p.tagline ?? "",
    description: p.shortDescription,
    features: p.features.slice(0, 3),
    image: p.logo ?? p.screenshots[0] ?? "",
    url: p.websiteUrl ?? "",
  };
}

export function CodeTerminal({ products = [] }: { products?: SafeProduct[] }) {
  const reduced = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );
  const [typed, setTyped] = React.useState(Math.min(TOTAL, 4));
  const [tab, setTab] = React.useState<TabId>("code");
  const [productIndex, setProductIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const miniProducts = React.useMemo(() => products.map(toMiniProduct), [products]);

  const visibleTyped = reduced ? TOTAL : typed;
  const typingDone = visibleTyped >= TOTAL;

  React.useEffect(() => {
    if (reduced) return;
    const step = () =>
      setTyped((t) => {
        if (t >= TOTAL) {
          clearInterval(id);
          return t;
        }
        return t + 1;
      });
    const id = window.setInterval(step, 26);
    return () => clearInterval(id);
  }, [reduced]);

  React.useEffect(() => {
    if (reduced) return;
    if (!typingDone || paused) return;
    // Continuous cycle: code (2.2 s) -> product (4.2 s) -> code ...
    const delay = tab === "code" ? 2200 : 4200;
    const id = window.setTimeout(
      () => setTab((t) => (t === "code" ? "product" : "code")),
      delay
    );
    return () => clearTimeout(id);
  }, [reduced, typingDone, tab, paused]);

  React.useEffect(() => {
    if (reduced) return;
    if (miniProducts.length < 2 || paused) return;
    const id = window.setInterval(() => {
      setProductIndex((i) => (i + 1) % miniProducts.length);
    }, 3200);
    return () => clearInterval(id);
  }, [reduced, miniProducts.length, paused]);

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }} className="relative min-w-0">
      <div
        className="pointer-events-none absolute -inset-3 rounded-[2rem]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(59,130,246,0.16), transparent 75%)",
        }}
        aria-hidden="true"
      />
      <div className="gradient-border relative min-w-0 overflow-hidden rounded-2xl bg-card/90">
        <div className="relative flex items-center justify-between border-b border-border/70 px-5 py-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-error/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-success/70" />
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 p-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] transition-colors",
                  tab === t.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <t.icon className="size-3" />
                {t.label}
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px] text-muted-foreground">
            {tab === "code" ? "npm run dev" : "status: live"}
          </span>
        </div>

        <div className="relative grid min-h-[15rem] p-5 font-mono text-xs leading-relaxed">
          <div className="tech-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

          <div
            aria-hidden={tab !== "code"}
            inert={tab !== "code"}
            className={cn(
              "col-start-1 row-start-1 min-w-0 transition-opacity duration-500",
              tab !== "code" && "pointer-events-none opacity-0"
            )}
          >
            {CODE_LINES.map((line, li) => {
              const start = CODE_LINES.slice(0, li).reduce((n, l) => n + l.text.length, 0);
              return (
                <div key={`${li}-${line.text.slice(0, 12)}`} className="whitespace-pre">
                  <span className="select-none text-primary/55">{li + 1}</span>
                  <span className="ml-4 inline-block">
                    {`${"  ".repeat(line.indent)}`}
                    {line.text.split("").map((ch, ci) => {
                      const idx = start + ci;
                      return (
                        <span
                          key={ci}
                          className={cn(
                            "transition-colors duration-75",
                            idx < visibleTyped ? "text-foreground/90" : "text-muted-foreground/45"
                          )}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                </div>
              );
            })}
            <div className="mt-1 whitespace-pre">
              {typingDone ? (
                <span className="flex items-center gap-2 text-success/90">
                  <Check className="size-3.5" />
                  build passed
                </span>
              ) : (
                <span className="animate-blink text-primary">▌</span>
              )}
            </div>
          </div>

          <div
            aria-hidden={tab !== "product"}
            inert={tab !== "product"}
            className={cn(
              "col-start-1 row-start-1 min-w-0 transition-opacity duration-500",
              tab !== "product" && "pointer-events-none opacity-0"
            )}
          >
            {miniProducts.length > 0 ? (
              <div className="space-y-2">
                {miniProducts.map((p, i) => (
                  <div
                    key={p.name}
                    className={cn(
                      "rounded-xl border border-border/60 bg-background/50 p-3",
                      i === productIndex ? "" : "pointer-events-none absolute inset-0 opacity-0"
                    )}
                    aria-hidden={i !== productIndex}
                    inert={i !== productIndex}
                  >
                    <div className="flex items-start gap-2.5">
                      {p.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.image}
                          alt=""
                          className="size-9 shrink-0 rounded-lg border border-border/60 object-cover"
                        />
                      ) : (
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                          <LayoutDashboard className="size-4" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold text-foreground">{p.name}</p>
                        {p.tagline ? (
                          <p className="truncate font-mono text-[9px] text-primary">{p.tagline}</p>
                        ) : null}
                      </div>
                      <span className="flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[9px] text-success">
                        <span className="size-1 rounded-full bg-success" /> live
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-muted-foreground">
                      {p.description}
                    </p>
                    {p.features.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {p.features.map((f) => (
                          <span
                            key={f}
                            className="rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2.5 inline-flex items-center gap-1 font-mono text-[9.5px] text-primary hover:text-primary/80"
                      >
                        <ArrowUpRight className="size-3" /> open product website
                      </a>
                    ) : null}
                  </div>
                ))}
                {miniProducts.length > 1 ? (
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {miniProducts.map((p, i) => (
                      <button
                        key={p.name}
                        type="button"
                        aria-label={`Show ${p.name}`}
                        onClick={() => setProductIndex(i)}
                        className={cn(
                          "size-1.5 rounded-full transition-all",
                          i === productIndex ? "w-4 bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <ProductInterface />
            )}
          </div>
        </div>

        <div className="relative flex flex-wrap gap-2 border-t border-border/70 px-6 py-4">
          {["Digital marketing", "Social media", "Graphic design", "Web & software", "IT solutions", "Professional classes"].map(
            (chip) => (
              <span
                key={chip}
                className="rounded-md border border-border/70 bg-muted/40 px-2.5 py-1 font-sans text-[11px] font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {chip}
              </span>
            )
          )}
        </div>
      </div>
      <div className="animate-bob absolute -bottom-5 -left-5">
        <div className="gradient-border flex items-center gap-2 rounded-xl bg-background/90 px-4 py-3 shadow-soft">
          <span className="relative flex size-2">
            <span className="animate-ping-ring absolute inline-flex size-full rounded-full bg-success" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-foreground">
            hands-on training, real projects
          </span>
        </div>
      </div>
    </div>
  );
}

function ProductInterface() {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-3">
      <div className="flex flex-col gap-1.5 rounded-xl border border-border/60 bg-background/50 p-2">
        {[LayoutDashboard, Megaphone, BarChart3, Palette, GraduationCap, ShieldCheck].map((Icon, i) => (
          <span
            key={i}
            className={cn(
              "grid size-7 place-items-center rounded-lg",
              i === 0 ? "bg-primary/15 text-primary" : "text-muted-foreground/80"
            )}
          >
            <Icon className="size-3.5" />
          </span>
        ))}
      </div>

      <div className="space-y-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10.5px] font-semibold text-foreground">Operations · Dashboard</p>
            <p className="font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
              enquiries · support · training
            </p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[9.5px] text-success">
            <span className="size-1 rounded-full bg-success" /> live
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Enquiries", value: "128" },
            { label: "Open", value: "6" },
            { label: "Trained", value: "40" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border/50 bg-card/60 px-2 py-1.5">
              <p className="text-[13px] font-bold tabular-nums text-accent">{s.value}</p>
              <p className="font-mono text-[8.5px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex h-10 items-end gap-1">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="animate-bar-grow w-full rounded-sm bg-gradient-to-t from-blue-500/70 to-cyan-400/70"
              style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>

        <ul className="space-y-1">
          {PRODUCT_ROWS.map((row) => (
            <li key={row.name} className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-card/40 px-2 py-1">
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="text-primary"><row.icon className="size-3" /></span>
                <span className="truncate text-[10.5px] text-foreground/90">{row.name}</span>
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider",
                  row.status === "open"
                    ? "bg-warning/15 text-warning"
                    : "bg-success/15 text-success"
                )}
              >
                {row.status}
              </span>
            </li>
          ))}
        </ul>

        <span className="flex items-center gap-1 font-mono text-[9.5px] text-primary">
          <ArrowUpRight className="size-3" /> view live product
        </span>
      </div>
    </div>
  );
}
