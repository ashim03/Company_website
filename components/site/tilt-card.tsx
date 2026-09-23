"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 3D perspective tilt that follows the cursor. Falls back to a flat
 * hover lift when JS or pointer events are unavailable.
 */
export function TiltCard({
  children,
  className,
  max = 7,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = Math.round((0.5 - py) * max * 2 * 10) / 10;
    const ry = Math.round((px - 0.5) * max * 2 * 10) / 10;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`,
      transition: "transform 0.08s ease-out",
      ["--mx" as string]: `${px * 100}%`,
      ["--my" as string]: `${py * 100}%`,
    });
  };

  const onLeave = () => {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)",
      transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glare ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background:
              "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--primary) 16%, transparent), transparent 70%)",
          }}
        />
      ) : null}
    </div>
  );
}