"use client";

import * as React from "react";
import { Mail, Phone, MessageCircle, Send, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualFrame, NodeCanvas, FlowLine, GlowDot, type Point } from "./shared";

/**
 * Contact page visual: "Let's build something together". A tiny communication
 * network — you → ideas → CodAstraLabs → back to a solution — drawn with
 * marching-dot connectors, floating message/email/phone chips, and a soft
 * pulsing core. Static + complete under reduced motion.
 */

const NODES = [
  { label: "You", sub: "the brief", icon: User, point: { x: 15, y: 34 } },
  { label: "Ideas", sub: "what you want to build", icon: Sparkles, point: { x: 26, y: 72 } },
  { label: "CodAstraLabs", sub: "the team", icon: MessageCircle, point: { x: 50, y: 47 } },
  { label: "Solution", sub: "the product", icon: Send, point: { x: 78, y: 62 } },
  { label: "Launch", sub: "live & operated", icon: Mail, point: { x: 74, y: 26 } },
] as const;

export function ContactNetwork({ className }: { className?: string }) {
  const center: Point = { x: 50, y: 47 };
  const links: [string, Point][] = NODES.map((n) => [n.label, n.point]);

  return (
    <VisualFrame className={cn("w-full", className)}>
      <div className="relative min-h-[20rem] p-6 sm:min-h-[22rem] sm:p-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <div className="absolute inset-x-0 top-4 flex justify-center">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary/60">
            let&apos;s build something together
          </span>
        </div>

        <NodeCanvas>
          {links.map(([label, point]) => (
            <FlowLine key={`link-${label}`} from={center} to={point} />
          ))}
          <FlowLine from={{ x: 15, y: 34 }} to={{ x: 50, y: 47 }} dash="2 5" className="text-sky-400/60" />
          <FlowLine from={{ x: 50, y: 47 }} to={{ x: 78, y: 62 }} dash="2 5" className="text-cyan-400/60" />
        </NodeCanvas>

        {/* Core hub */}
        <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="relative grid size-20 place-items-center rounded-3xl gradient-border bg-card shadow-soft sm:size-24">
            <GlowDot className="absolute -top-2 left-1/2 -translate-x-1/2" />
            <MessageCircle className="size-9 text-primary sm:size-11" />
          </div>
          <div className="mt-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-foreground">
            a conversation
          </div>
        </div>

        {/* Satellites */}
        {NODES.map((n, i) => {
          const Icon = n.icon;
          return (
            <div
              key={n.label}
              className="animate-float absolute -translate-x-1/2 -translate-y-1/2 motion-reduce:animate-none"
              style={{ left: `${n.point.x}%`, top: `${n.point.y}%`, animationDelay: `${i * -0.8}s` }}
            >
              <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/85 px-3 py-2 shadow-card backdrop-blur sm:px-4 sm:py-2.5">
                <span className={cn(
                  "grid size-8 place-items-center rounded-lg sm:size-9",
                  n.label === "CodAstraLabs"
                    ? "bg-gradient-to-br from-blue-500/20 to-cyan-400/15 text-primary"
                    : "bg-primary/10 text-primary/80"
                )}>
                  <Icon className="size-4 sm:size-5" />
                </span>
                <span className="text-left">
                  <span className="block text-[0.68rem] font-bold tracking-tight text-foreground sm:text-xs">
                    {n.label}
                  </span>
                  <span className="block font-mono text-[0.54rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {n.sub}
                  </span>
                </span>
              </div>
            </div>
          );
        })}

        {/* Floating contact chips */}
        <div className="animate-bob absolute left-[8%] top-[12%] hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 shadow-card sm:flex motion-reduce:animate-none">
          <Mail className="size-3.5 text-primary" />
          <span className="font-mono text-[0.56rem] text-foreground">support@codastra…</span>
        </div>
        <div className="animate-bob absolute right-[6%] bottom-[8%] hidden items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 shadow-card sm:flex motion-reduce:animate-none" style={{ animationDelay: "-1.6s" }}>
          <Phone className="size-3.5 text-primary" />
          <span className="font-mono text-[0.56rem] text-foreground">+977 …</span>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <GlowDot tone="success" />
          <span className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            no pitch — just a practical first call
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}