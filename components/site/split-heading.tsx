"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

function accentCount(words: string[]): number {
  return words.length <= 3 ? 1 : 2;
}

/**
 * Two-beat headline reveal: the lead cluster slides in from the left
 * while the trailing accent cluster slides in from the right. Content
 * renders visible by default; hidden states only apply once JS marks
 * <html class="js">. `rise` is transform-only for above-the-fold copy.
 */
export function SplitHeading({
  text,
  className,
  accentClassName = "italic",
  rise = false,
  stagger = 130,
  as: Tag = "h2",
  ...props
}: {
  text: string;
  className?: string;
  accentClassName?: string;
  /** Transform-only entrance — content stays visible throughout. */
  rise?: boolean;
  /** Delay between the lead and accent clusters. */
  stagger?: number;
  as?: React.ElementType;
} & Omit<React.HTMLAttributes<HTMLHeadingElement>, "children">) {
  const ref = React.useRef<HTMLHeadingElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let timer = 0;
    const reveal = () => {
      if (!timer) timer = window.setTimeout(() => setVisible(true), 0);
    };
    // Reveal immediately when already on screen so above-the-fold
    // headings can never stay hidden waiting on an observer.
    let rect: DOMRect | undefined;
    try {
      rect = node.getBoundingClientRect();
    } catch {
      /* ignore */
    }
    if (rect && rect.top < window.innerHeight) {
      return reveal();
    }
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
    };
  }, []);

  const words = splitWords(text);
  const split = Math.max(0, words.length - accentCount(words));
  const start = words.slice(0, split).join(" ");
  const accent = words.slice(split).join(" ").trim();
  const Heading = Tag as React.ElementType;

  return (
    <Heading
      ref={ref as React.Ref<unknown>}
      className={cn("text-balance", className)}
      {...props}
    >
      {start ? (
        <span
          className={cn(
            rise ? "rise-head" : "split-head",
            rise ? "rise-head-left" : "split-head-left",
            visible && "split-head-visible"
          )}
        >
          {start}
          {"\u00A0"}
        </span>
      ) : null}
      <span
        className={cn(
          rise ? "rise-head" : "split-head",
          rise ? "rise-head-right" : "split-head-right",
          "text-accent",
          visible && "split-head-visible",
          accentClassName
        )}
        style={start ? { transitionDelay: `${stagger}ms` } : undefined}
      >
        {accent || text}
      </span>
    </Heading>
  );
}