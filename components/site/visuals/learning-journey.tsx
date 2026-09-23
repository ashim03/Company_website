"use client";

import * as React from "react";
import { BookOpen, Repeat, Hammer, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlowDot } from "./shared";

/**
 * Classes section visual: the learning journey, Learn → Practice → Build →
 * Launch. A compact four-step path with a connecting spine and floating
 * level trophies. Static + complete under reduced motion.
 */

const STEPS = [
  { label: "Learn", detail: "concepts & tools", icon: BookOpen },
  { label: "Practice", detail: "guided exercises", icon: Repeat },
  { label: "Build", detail: "real projects", icon: Hammer },
  { label: "Launch", detail: "your portfolio", icon: Rocket },
] as const;

export function LearningJourney({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 10%, rgba(59,130,246,0.14), transparent 70%), radial-gradient(55% 55% at 85% 90%, rgba(34,211,238,0.12), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 gap-0">
        {/* Connecting spine */}
        <div className="absolute inset-y-6 left-7 w-px bg-gradient-to-b from-primary/60 via-cyan-400/50 to-primary/20" aria-hidden="true" />

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.label} className="relative flex items-start gap-4">
              <div className="relative z-10 shrink-0">
                <span className="grid size-14 place-items-center rounded-2xl gradient-border bg-card shadow-card">
                  <Icon className="size-6 text-primary" />
                </span>
                <GlowDot
                  className="absolute -right-0.5 -top-0.5"
                  tone={i === STEPS.length - 1 ? "success" : "primary"}
                />
              </div>
              <div className="pt-1.5">
                <p className="flex items-baseline gap-2">
                  <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-primary/60">
                    0{i + 1}
                  </span>
                  <span className="text-base font-semibold tracking-tight text-foreground">
                    {step.label}
                  </span>
                </p>
                <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 pl-[4.5rem]">
        <GlowDot tone="success" />
        <span className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          hands-on from day one
        </span>
      </div>
    </div>
  );
}