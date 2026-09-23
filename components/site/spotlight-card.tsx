"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a cursor-following radial spotlight. Emits using the same
 * --mx/--my variables as TiltCard so both can be used together.
 */
export function SpotlightCard({
  children,
  className,
  innerClassName,
  radius = 460,
  strength = 0.16,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  radius?: number;
  strength?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    node.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("group relative overflow-hidden", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--primary) ${Math.round(
            strength * 100
          )}%, transparent), transparent 65%)`,
        }}
      />
      <div className={cn("relative z-10", innerClassName)}>{children}</div>
    </div>
  );
}