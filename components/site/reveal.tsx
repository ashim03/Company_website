"use client";

import * as React from "react";
import { useEntrance } from "@/components/site/use-entrance";
import { cn } from "@/lib/utils";

/**
 * Lightweight entrance reveal. No animation library — a single
 * IntersectionObserver toggles a short translation. Respects
 * prefers-reduced-motion via a media query in CSS.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  rise = false,
  from = "up",
  initialVisible = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Transform-only entrance (translate) that never hides content. */
  rise?: boolean;
  /** Scroll-entrance direction for the translation. */
  from?: "up" | "down" | "left" | "right";
  /**
   * Emit the visible state in the initial render so above-the-fold
   * content is fully painted even before JS hydration runs.
   */
  initialVisible?: boolean;
}) {
  const { ref, visible } = useEntrance<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        rise ? "motion-rise" : "motion-reveal",
        !rise && from !== "up" && `motion-reveal-${from}`,
        (visible || initialVisible) &&
          (rise ? "motion-rise-visible" : "motion-reveal-visible"),
        className
      )}
      style={delay ? { transitionDelay: `${Math.min(Math.max(delay, 0), 180)}ms` } : undefined}
    >
      {children}
    </div>
  );
}
