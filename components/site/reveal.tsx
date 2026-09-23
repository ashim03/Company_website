"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight entrance reveal. No animation library — a single
 * IntersectionObserver toggles a fade/translate. Respects
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
  /** Scroll-entrance direction for the fade variant. */
  from?: "up" | "down" | "left" | "right";
  /**
   * Emit the visible state in the initial render so above-the-fold
   * content is fully painted even before JS hydration runs.
   */
  initialVisible?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  // Mirrors `visible` so the mount-time safety timeout can read the real
  // state even though the effect only runs once with an empty dep array.
  const visibleRef = React.useRef(false);
  const markVisible = (next: boolean) => {
    visibleRef.current = next;
    setVisible(next);
  };

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let timer = 0;
    const finish = () => {
      window.removeEventListener("scroll", fallback);
      window.removeEventListener("resize", fallback);
    };
    const reveal = () => {
      if (!timer) {
        timer = window.setTimeout(() => {
          markVisible(true);
          finish();
        }, 0);
      }
    };
    // Scroll/resize fallback for when the IntersectionObserver stalls
    // (e.g. programmatic smooth-scrolling that never settles): content
    // becomes visible the moment it enters the viewport, so a failed or
    // slow animation can never leave a section blank.
    const fallback = () => {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight - 60 && r.bottom > -80) reveal();
    };
    // If the element is already on screen when it mounts, reveal it
    // immediately so above-the-fold content can never stay blank while
    // waiting on an observer. Below-fold elements keep the scroll reveal.
    let rect: DOMRect | undefined;
    try {
      rect = node.getBoundingClientRect();
    } catch {
      /* ignore */
    }
    if (rect && rect.top < window.innerHeight) {
      return reveal();
    }
    window.addEventListener("scroll", fallback, { passive: true });
        window.addEventListener("resize", fallback, { passive: true });
    if (typeof IntersectionObserver === "undefined") {
      return reveal();
    }
    // Absolute guarantee: on-screen content can never stay stuck below
    // full visibility, even if the observer never fires or both fallbacks
    // are defeated. Once the mount settle window passes, anything already
    // inside (or just above) the viewport is force-revealed.
    window.setTimeout(
      () => {
        const r = node.getBoundingClientRect();
        if (!visibleRef.current && r.top < window.innerHeight - 40 && r.bottom > -40) {
          reveal();
        }
      },
      900
    );
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              markVisible(true);
              observer?.disconnect();
              finish();
            }
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
      );
      observer.observe(node);
    } catch {
      return reveal();
    }
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener("scroll", fallback);
      window.removeEventListener("resize", fallback);
    };
  }, []);

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
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}