"use client";

import * as React from "react";
import {
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisualFrame, NodeCanvas, FlowLine, GlowDot, type Point } from "./shared";
import { ServiceIcon } from "@/components/site/service-icon";
import { BrandMark } from "@/components/site/brand-mark";

/**
 * Home hero visual: the CodAstraLabs digital ecosystem. A central identity
 * node ("CodAstraLabs") radiates to the six service pillars, which connect
 * onward to real products held in the satellite ring. Pure CSS animation —
 * soft pulses, floating chips, marching-dot connectors — all disabled under
 * reduced motion while the full diagram stays visible.
 */

const PILLARS = [
  { label: "Digital Marketing", icon: "trending-up", color: "text-primary" },
  { label: "Graphic Design", icon: "paintbrush", color: "text-sky-400" },
  { label: "Web Development", icon: "code", color: "text-cyan-400" },
  { label: "Software Solutions", icon: "layout", color: "text-blue-400" },
  { label: "Social Media", icon: "globe", color: "text-cyan-500" },
  { label: "Cloud & IT", icon: "cloud", color: "text-primary" },
  { label: "Training & Classes", icon: "rocket", color: "text-sky-300" },
] as const;

interface EcosystemNode {
  label: string;
  point: Point;
}

export function EcosystemScene({
  products = [],
  className,
}: {
  products?: { name: string; tagline?: string | null }[];
  className?: string;
}) {
  const nodeCount = Math.max(PILLARS.length, 1);

  const nodes: EcosystemNode[] = React.useMemo(() => {
    const cx = 50;
    const cy = 48;
    const rx = 32;
    const ry = 30;
    return PILLARS.map((pillar, i) => {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      return {
        label: pillar.label,
        point: {
          x: cx + rx * Math.cos(angle),
          y: cy + ry * Math.sin(angle),
        },
      };
    });
  }, [nodeCount]);

  // A quieter inner ring for product chips (labels only).
  const productNodes = React.useMemo(() => {
    const cx = 50;
    const cy = 48;
    const rx = 24;
    const ry = 23;
    const count = Math.min(products.length, 4);
    return products.slice(0, count).map((p, i) => {
      const angle = (i / Math.max(count, 1)) * Math.PI * 2 - Math.PI / 2 + 0.6;
      return {
        name: p.name,
        point: { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) },
      };
    });
  }, [products]);

  return (
    <VisualFrame className={cn("aspect-[4/4.6] w-full", className)}>
      <div className="absolute inset-0 p-4 sm:p-6">
        {/* Ring label */}
        <div className="absolute inset-x-0 top-3 flex justify-center sm:top-4">
          <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-primary/60">
            the codastra ecosystem
          </span>
        </div>

        <NodeCanvas>
          {/* Pillar spokes */}
          {nodes.map((n) => (
            <FlowLine key={`spoke-${n.label}`} from={{ x: 50, y: 48 }} to={n.point} />
          ))}
          {/* Product links */}
          {productNodes.map((n) => (
            <FlowLine
              key={`link-${n.name}`}
              from={{ x: 50, y: 48 }}
              to={n.point}
              dash="2 5"
              className="text-cyan-400/50"
            />
          ))}
        </NodeCanvas>

        {/* Rotating dashed outer orbit (elliptical to match node ring) */}
        <div
          className="pointer-events-none absolute left-1/2 top-[48%] h-[76%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/25 animate-spin-slow"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[48%] h-[48%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-400/25 animate-spin-slow"
          style={{ animationDirection: "reverse", animationDuration: "26s" }}
          aria-hidden="true"
        />

        {/* Center identity node */}
        <div className="brand-center absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
          <BrandMark className="mx-auto w-24 sm:w-28" />
        </div>

        {/* Service pillars */}
        {nodes.map((n, i) => {
          const pillar = PILLARS[i];
          return (
            <div
              key={n.label}
              className="animate-bob absolute -translate-x-1/2 -translate-y-1/2 motion-reduce:animate-none"
              style={{
                left: `${n.point.x}%`,
                top: `${n.point.y}%`,
                animationDelay: `${i * -0.9}s`,
                animationDuration: "7s",
              }}
            >
              <div className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 px-2.5 py-1.5 shadow-card backdrop-blur sm:gap-2 sm:px-3 sm:py-2">
                <ServiceIcon icon={pillar.icon} className={cn("size-3.5", pillar.color)} />
                <span className="text-[0.58rem] font-semibold tracking-tight text-foreground/85 sm:text-[0.68rem]">
                  {n.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Product chips */}
        {productNodes.map((p, i) => (
          <div
            key={p.name}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.point.x}%`, top: `${p.point.y}%` }}
            aria-hidden="true"
          >
            <div className="animate-bob flex items-center gap-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-2.5 py-1 backdrop-blur motion-reduce:animate-none" style={{ animationDelay: `${i * -1.2}s` }}>
              <span className="size-1 rounded-full bg-cyan-400" />
              <span className="font-mono text-[0.56rem] font-medium text-cyan-300/90 sm:text-[0.62rem]">
                {p.name}
              </span>
            </div>
          </div>
        ))}

        {/* Bottom status line */}
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center sm:bottom-4">
          <div className="gradient-border flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 shadow-card sm:px-4">
            <span className="flex items-center gap-1.5">
              <GlowDot tone="success" />
              <span className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.16em] text-foreground">
                digital growth, end to end
              </span>
            </span>
            <ArrowUpRight className="size-3.5 text-primary" />
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}
