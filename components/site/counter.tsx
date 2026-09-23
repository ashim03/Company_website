"use client";

import * as React from "react";

/**
 * Counts up from 0 once the element scrolls into view. Accepts a raw
 * value string like "120+", "4.8", "1,200" and preserves prefix/suffix.
 */
export function Counter({
  value,
  duration = 1.4,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const match = value.match(/^(\D*)([\d.,]+)(\D*)$/);
    if (!match) {
      queueMicrotask(() => setDisplay(value));
      return;
    }
    const [, prefix, num, suffix] = match;
    const decimals = (num.split(".")[1] ?? "").length;
    const target = parseFloat(num.replace(/,/g, ""));

    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setDisplay(`${prefix}${num}${suffix}`));
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      queueMicrotask(() => setDisplay(`${prefix}${num}${suffix}`));
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      setDisplay(
        `${prefix}${decimals
          ? current.toFixed(decimals)
          : Math.round(current).toLocaleString("en-US")}${suffix}`
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    let observer: IntersectionObserver | null = null;
    const startWhenVisible = () => {
      raf = requestAnimationFrame(tick);
    };
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              startWhenVisible();
              observer?.disconnect();
            }
          }
        },
        { threshold: 0.4 }
      );
      observer.observe(node);
    } catch {
      startWhenVisible();
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {display}
    </span>
  );
}