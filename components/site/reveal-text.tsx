"use client";

import * as React from "react";
import { useEntrance } from "@/components/site/use-entrance";
import { cn } from "@/lib/utils";

function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter(Boolean);
}

/**
 * Short word entrances that keep text fully opaque.
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
  const { ref, visible } = useEntrance<HTMLHeadingElement>();

  const words = splitWords(text);
  const count = words.filter((word) => word.trim()).length;
  const Heading = Tag as React.ElementType;

  return (
    <Heading
      ref={ref as React.Ref<unknown>}
      className={cn("text-balance", className)}
      {...props}
    >
      {words.map((word, i) => {
        const isHighlight = Math.floor(i / 2) >= count - Math.min(highlight, count);
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
            style={!gap ? { transitionDelay: `${Math.min(Math.floor(i / 2) * 25, 150)}ms` } : undefined}
          >
            {gap ? " " : word}
          </span>
        );
      })}
    </Heading>
  );
}
