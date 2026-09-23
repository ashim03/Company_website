"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter(Boolean);
}

/**
 * Word-by-word staggered reveal with a blur + tilt entrance.
 * `highlight` marks the trailing N words with the brand gradient.
 */
export function RevealText({
  text,
  highlight = 0,
  className,
  wordClassName,
  rise = false,
  as: Tag = "h2",
  initialVisible = false,
  ...props
}: {
  text: string;
  highlight?: number;
  className?: string;
  wordClassName?: string;
  /** Transform-only word entrance — words stay visible throughout. */
  rise?: boolean;
  as?: React.ElementType;
  /**
   * Emit the visible state in the initial render so the heading is
   * fully painted even before JS hydration runs.
   */
  initialVisible?: boolean;
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, "children">) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const [visible, setVisible] = React.useState(false);

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
          setVisible(true);
          finish();
        }, 0);
      }
    };
    // Scroll/resize fallback so a stalled IntersectionObserver or an
    // interrupted animation can never leave a heading stuck invisible.
    const fallback = () => {
      const r = node.getBoundingClientRect();
      if (r.top < window.innerHeight - 60 && r.bottom > -80) reveal();
    };
    // Reveal immediately when already on screen so the first heading
    // (the hero title) can never stay blank waiting on an observer.
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
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setVisible(true);
              observer?.disconnect();
              finish();
            }
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
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

const words = splitWords(text);
  const count = words.length;
  const Heading = Tag as React.ElementType;

  return (
    <Heading
      ref={ref as React.Ref<unknown>}
      className={cn("text-balance", className)}
      {...props}
    >
      {words.map((word, i) => {
        const isHighlight = i >= count - Math.min(highlight, count);
        const gap = word.trim().length === 0;
        return (
          <span
            key={i}
            aria-hidden={gap}
            className={cn(
              !gap && (rise ? "rise-word" : "reveal-word"),
              (visible || initialVisible) && !gap &&
                (rise ? "rise-word-visible" : "reveal-word-visible"),
              isHighlight && "text-accent",
              wordClassName
            )}
            style={!gap ? { transitionDelay: `${i * 55}ms` } : undefined}
          >
            {gap ? " " : word}
          </span>
        );
      })}
    </Heading>
  );
}