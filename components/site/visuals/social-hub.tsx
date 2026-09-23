"use client";

import * as React from "react";
import { Share2, Camera, Video, Search, Globe, Heart, Eye, UserPlus, TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualFrame, FlowLine, GlowDot, type Point } from "./shared";

/**
 * Marketing / social service detail visual: the social media ecosystem.
 * Channels (Facebook, Instagram, TikTok, Google, Website) feed Content,
 * which compounds into Engagement → Reach → Leads → Growth. Contains a
 * mini analytics strip. Static + complete under reduced motion.
 */

const CHANNELS = [
  { label: "Facebook", icon: Share2 },
  { label: "Instagram", icon: Camera },
  { label: "TikTok", icon: Video },
  { label: "Google", icon: Search },
  { label: "Website", icon: Globe },
] as const;

const FLOW: { label: string; icon: typeof Heart; point: Point }[] = [
  { label: "Content", icon: Globe, point: { x: 36, y: 26 } },
  { label: "Engagement", icon: Heart, point: { x: 51, y: 42 } },
  { label: "Reach", icon: Eye, point: { x: 66, y: 58 } },
  { label: "Leads", icon: UserPlus, point: { x: 79, y: 74 } },
];

const BARS = [38, 55, 49, 70, 64, 88, 78, 95];

export function SocialHub({ className }: { className?: string }) {
  return (
    <VisualFrame className={cn("w-full", className)}>
      <div className="relative min-h-[20rem] p-6 sm:min-h-[22rem] sm:p-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="absolute inset-x-0 top-4 flex justify-center">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary/60">
            social media ecosystem
          </span>
        </div>

        {/* Channels row */}
        <div className="relative flex flex-wrap items-center justify-center gap-2 pt-10 sm:gap-3">
          {CHANNELS.map((ch) => {
            const Icon = ch.icon;
            return (
              <span
                key={ch.label}
                className="animate-float flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/85 px-3 py-2 shadow-card backdrop-blur motion-reduce:animate-none"
                style={{ animationDelay: `${CHANNELS.indexOf(ch) * -0.7}s` }}
              >
                <Icon className="size-4 text-primary" />
                <span className="text-[0.62rem] font-semibold text-foreground">{ch.label}</span>
              </span>
            );
          })}
        </div>

        {/* Funnel */}
        <div className="relative mt-4 hidden items-center justify-center sm:flex">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <FlowLine from={{ x: 30, y: 20 }} to={{ x: 36, y: 26 }} />
            <FlowLine from={{ x: 36, y: 26 }} to={{ x: 51, y: 42 }} />
            <FlowLine from={{ x: 51, y: 42 }} to={{ x: 66, y: 58 }} />
            <FlowLine from={{ x: 66, y: 58 }} to={{ x: 79, y: 74 }} />
            <FlowLine from={{ x: 79, y: 74 }} to={{ x: 88, y: 80 }} dash="2 5" className="text-success/70" />
          </svg>
          <div className="flex items-center gap-2">
            {FLOW.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="relative flex flex-col items-center gap-1 rounded-2xl border border-border/60 bg-card/80 px-3 py-2.5 shadow-card"
                >
                  <Icon className="size-5 text-primary" />
                  <span className="text-[0.6rem] font-bold text-foreground">{f.label}</span>
                </div>
              );
            })}
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br from-blue-500/15 to-cyan-400/10 px-3 py-2.5">
              <TrendingUp className="size-5 text-cyan-400" />
              <span className="text-[0.6rem] font-bold text-cyan-300">Growth</span>
            </div>
          </div>
        </div>

        {/* Analytics strip */}
        <div className="mt-5 rounded-2xl border border-border/60 bg-card/70 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground">
              <Heart className="size-3 text-primary" /> engagement over 12 weeks
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-success">
              <ArrowRight className="size-3" /> compounding
            </span>
          </div>
          <div className="mt-2.5 flex h-12 items-end gap-1">
            {BARS.map((h, i) => (
              <span
                key={i}
                className="animate-bar-grow w-full rounded-sm bg-gradient-to-t from-blue-500/70 to-cyan-400/70 motion-reduce:animate-none"
                style={{ height: `${h}%`, animationDelay: `${i * -0.16}s` }}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <GlowDot tone="success" />
          <span className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            content, managed end to end
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}