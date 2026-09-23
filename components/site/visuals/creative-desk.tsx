"use client";

import * as React from "react";
import { Palette, PenTool, Layers, Frame, Circle, Square, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualFrame, GlowDot } from "./shared";

/**
 * Graphic design / branding service detail visual: a creative workspace.
 * A floating canvas with a color palette, tool rail, layers, and draft
 * shapes being composed — the "designer's desk". Static + complete under
 * reduced motion.
 */

const SWATCHES = ["#3b82f6", "#38bdf8", "#22d3ee", "#818cf8", "#34d399", "#fbbf24"];

const SHAPES = [
  { Icon: Circle, cls: "left-[6%] top-[20%]", rot: "rotate-0" },
  { Icon: Square, cls: "right-[16%] top-[16%]", rot: "rotate-[8deg]" },
  { Icon: Triangle, cls: "left-[38%] bottom-[16%]", rot: "rotate-[-6deg]" },
] as const;

export function CreativeDesk({ className }: { className?: string }) {
  return (
    <VisualFrame className={cn("w-full", className)}>
      <div className="relative min-h-[20rem] p-6 sm:min-h-[22rem] sm:p-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/3 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400/10 blur-3xl" />
        </div>

        <div className="absolute inset-x-0 top-4 flex justify-center">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary/60">
            creative workspace
          </span>
        </div>

        {/* Canvas */}
        <div className="relative mx-auto mt-8 max-w-md rounded-2xl border border-border/70 bg-card/75 p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground">
              <Frame className="size-3.5 text-primary" /> brand-artboard-01
            </span>
            <div className="flex items-center gap-1">
              {SWATCHES.map((c, i) => (
                <span
                  key={c}
                  className="animate-bob size-3 rounded-full border border-border/40 motion-reduce:animate-none"
                  style={{ background: c, animationDelay: `${i * -0.5}s` }}
                />
              ))}
            </div>
          </div>

          {/* Draft composition */}
          <div className="relative mt-4 grid aspect-[16/9] place-items-center overflow-hidden rounded-xl border border-border/50 bg-muted/30">
            <div className="tech-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="animate-float relative grid size-20 place-items-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/15 motion-reduce:animate-none">
              <span className="text-gradient text-2xl font-bold tracking-tight">Asp</span>
            </div>
            {SHAPES.map(({ Icon, cls, rot }, i) => (
              <span
                key={i}
                className={cn("animate-float absolute text-primary/50 motion-reduce:animate-none", rot, cls)}
                style={{ animationDelay: `${i * -1}s` }}
                aria-hidden="true"
              >
                <Icon className="size-7" />
              </span>
            ))}
          </div>

          {/* Tool rail */}
          <div className="mt-4 flex items-center gap-2">
            {[PenTool, Palette, Layers].map((Icon, i) => (
              <span
                key={i}
                className="grid size-9 place-items-center rounded-xl border border-border/60 bg-background/60 text-primary shadow-card transition-colors hover:border-primary/40"
              >
                <Icon className="size-4" />
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted-foreground">
              <GlowDot /> iterate until it&apos;s right
            </span>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <GlowDot tone="success" />
          <span className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            brand identity, logos & creatives
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}