"use client";

import * as React from "react";
import { useEntrance } from "@/components/site/use-entrance";
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
 * stays fully opaque before hydration and throughout the entrance.
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
  const { ref, visible } = useEntrance<HTMLHeadingElement>();

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
        style={start ? { transitionDelay: `${Math.min(Math.max(stagger, 0), 150)}ms` } : undefined}
      >
        {accent || text}
      </span>
    </Heading>
  );
}