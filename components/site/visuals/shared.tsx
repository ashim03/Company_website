import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared decorative primitives for the page-visual system. Everything in
 * this file is lightweight: SVG connectors, pulsing glow dots, and the
 * panel frame used to host a diagram. Animation is CSS-only (marching-dot
 * dashes, soft pulses) and fully bypassed under prefers-reduced-motion —
 * the static layout remains complete either way.
 */

export interface Point {
  x: number;
  y: number;
}

/** Dashed connector between two normalized (0-100) viewBox points. */
export function FlowLine({
  from,
  to,
  className,
  dash = "3 7",
}: {
  from: Point;
  to: Point;
  className?: string;
  dash?: string;
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      strokeDasharray={dash}
      className={cn("animate-dash-flow text-primary/45 motion-reduce:animate-none", className)}
    />
  );
}

/** Soft pulsing status dot with an expanding ring. */
export function GlowDot({
  className,
  tone = "primary",
}: {
  className?: string;
  tone?: "primary" | "success";
}) {
  const ring =
    tone === "success" ? "bg-success/40" : "bg-primary/40";
  const dot = tone === "success" ? "bg-success" : "bg-primary";
  return (
    <span className={cn("relative inline-block size-2", className)} aria-hidden="true">
      <span
        className={cn(
          "animate-pulse-ring-soft absolute inline-flex size-full rounded-full motion-reduce:animate-none",
          ring
        )}
      />
      <span className={cn("relative inline-flex size-2 rounded-full", dot)} />
    </span>
  );
}

/** Full-size SVG canvas for normalized (0-100) diagram coordinates. */
export function NodeCanvas({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-primary"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {children}
    </svg>
  );
}

/** Host panel for a diagram: gradient border, soft card, tech grid. */
export function VisualFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl gradient-border bg-card/80 shadow-soft">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 70% at 18% 0%, rgba(59,130,246,0.12), transparent 70%), radial-gradient(60% 60% at 90% 100%, rgba(34,211,238,0.1), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="tech-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className={cn("relative", className)}>{children}</div>
    </div>
  );
}