import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Pure-CSS infinite marquee. Duplicates children once for a seamless loop.
 * `reverse` flips direction, `duration` controls the loop speed.
 */
export function Marquee({
  children,
  reverse = false,
  duration = 32,
  className,
  childClassName,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
  childClassName?: string;
}) {
  return (
    <div className={cn("group overflow-hidden", className)}>
      <div
        className={cn(
          "animate-marquee flex w-max items-center group-hover:[animation-play-state:paused]",
          reverse && "animate-marquee-reverse"
        )}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className={cn("flex shrink-0 items-center", childClassName)}>{children}</div>
        <div
          aria-hidden="true"
          className={cn("flex shrink-0 items-center", childClassName)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}