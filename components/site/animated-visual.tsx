import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated gradient visual — replaces static photography with layered,
 * drift + rotation + scan-line motion built purely from existing CSS
 * keyframes (no JS runtime). Content is always rendered; decoration is
 * aria-hidden. Motion is disabled under prefers-reduced-motion by the
 * global media rule.
 */
export function AnimatedVisual({
  icon,
  label,
  className,
  seed = 0,
}: {
  icon?: ReactNode;
  label?: string;
  className?: string;
  /** Per-instance offset so repeated panels don't animate in lockstep. */
  seed?: number;
}) {
  const delay = {
    orb1: `${(-1 * seed) % 30}s`,
    orb2: `${(9 - seed * 2) % 30}s`,
    conic: `${(-3 - seed) % 20}s`,
    scan: `${(-2 - seed) % 6}s`,
  };

  return (
    <div
      className={cn(
        "gradient-border relative overflow-hidden rounded-2xl bg-card",
        className
      )}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-sky-400/40 via-blue-600/25 to-cyan-500/20"
        aria-hidden="true"
      />

      <div
        className="absolute -inset-1/3 animate-spin-slow opacity-70 blur-2xl"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, rgba(59,130,246,0.85), rgba(34,211,238,0.65), rgba(147,197,253,0.5), rgba(34,211,238,0.7), rgba(59,130,246,0.85))",
          animationDelay: delay.conic,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute -inset-10 animate-drift rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 45% at 30% 30%, rgba(59,130,246,0.7), transparent 70%), radial-gradient(40% 40% at 75% 65%, rgba(34,211,238,0.6), transparent 70%)",
          animationDelay: delay.orb1,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -inset-16 animate-drift rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 50% at 65% 25%, rgba(147,197,253,0.65), transparent 70%), radial-gradient(45% 45% at 20% 80%, rgba(103,232,249,0.55), transparent 70%)",
          animationDelay: delay.orb2,
        }}
        aria-hidden="true"
      />

      <div
        className="tech-grid animate-grid absolute inset-0 opacity-30"
        style={{ animationDuration: "3.2s" }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div
        className="animate-scan pointer-events-none absolute inset-x-0 h-1/3"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(56,189,248,0.16), transparent)",
          animationDelay: delay.scan,
        }}
        aria-hidden="true"
      />

      {icon || label ? (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-8">
          {icon ? (
            <span className="flex size-14 items-center justify-center rounded-2xl bg-background/60 text-primary backdrop-blur">
              {icon}
            </span>
          ) : null}
          {label ? (
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}