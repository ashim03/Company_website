"use client";

import * as React from "react";
import { Lightbulb, PenTool, Code2, FlaskConical, Rocket, CheckCircle2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualFrame, GlowDot } from "./shared";

/**
 * Web & software service detail visual: the development environment.
 * Idea → UI/UX → Development → Testing → Deployment → Live, drawn as a
 * pipeline with a mini code terminal that "types" steps. Static + complete
 * under reduced motion.
 */

const STAGES = [
  { label: "Idea", icon: Lightbulb },
  { label: "UI/UX", icon: PenTool },
  { label: "Development", icon: Code2 },
  { label: "Testing", icon: FlaskConical },
  { label: "Deployment", icon: Rocket },
  { label: "Live", icon: CheckCircle2 },
] as const;

const TERMINAL_LINES = [
  "> codastra --flow web-software",
  "   idea ........ ready",
  "   ui/ux ....... delivered",
  "   develop ..... in progress",
  "   test ........ passing",
  "   deploy ...... ok",
  "→ build live · delivered",
];

export function DevFlow({ className }: { className?: string }) {
  return (
    <VisualFrame className={cn("w-full", className)}>
      <div className="relative min-h-[20rem] p-6 sm:min-h-[22rem] sm:p-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="absolute inset-x-0 top-4 flex justify-center">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary">
            from idea to live product
          </span>
        </div>

        {/* Stage pipeline */}
        <div className="relative mt-9 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {STAGES.map((stage, i) => {
            const Icon = stage.icon;
            const done = i < STAGES.length - 1 ? i % 3 !== 1 : true;
            return (
              <div key={stage.label} className="flex items-center gap-2 sm:gap-3">
                <div className="animate-float flex flex-col items-center gap-1.5 motion-reduce:animate-none" style={{ animationDelay: `${i * -0.6}s` }}>
                  <span className={cn(
                    "grid size-10 place-items-center rounded-xl border shadow-card sm:size-11",
                    done && i < STAGES.length - 1
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-400"
                      : i === STAGES.length - 1
                        ? "border-success/40 bg-success/10 text-success"
                        : "border-border/70 bg-card text-primary"
                  )}>
                    <Icon className="size-4" />
                  </span>
                  <span className="text-[0.58rem] font-bold tracking-tight text-foreground">{stage.label}</span>
                </div>
                {i < STAGES.length - 1 ? (
                  <span className="hidden h-px w-4 bg-gradient-to-r from-primary/40 to-transparent sm:block" aria-hidden="true" />
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Mini terminal */}
        <div className="mx-auto mt-5 max-w-md overflow-hidden rounded-2xl border border-border/70 bg-card/85 shadow-soft">
          <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-error/70" />
            <span className="size-2.5 rounded-full bg-warning/70" />
            <span className="size-2.5 rounded-full bg-success/70" />
            <span className="ml-2 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground">
              codastra · deploy
            </span>
          </div>
          <div className="px-4 py-3 font-mono text-[0.62rem] leading-relaxed">
            {TERMINAL_LINES.map((line, i) => (
              <p
                key={line}
                className={cn(
                  "whitespace-pre",
                  i === TERMINAL_LINES.length - 1
                    ? "flex items-center gap-2 text-success"
                    : line.startsWith(">") ? "text-primary" : "text-foreground/70",
                  i === 0 && "mb-1",
                  i >= 1 && i <= 5 && "pl-2"
                )}
              >
                {i === TERMINAL_LINES.length - 1 ? (
                  <>
                    <Terminal className="size-3" /> {line}
                  </>
                ) : (
                  line
                )}
              </p>
            ))}
            <p className="mt-1 flex items-center gap-1 text-foreground/40">
              <span className="text-primary">▌</span>
            </p>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <GlowDot tone="success" />
          <span className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            live delivered in small working pieces
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}