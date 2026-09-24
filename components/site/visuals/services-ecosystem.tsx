"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/site/brand-mark";
import { cn } from "@/lib/utils";
import { VisualFrame, NodeCanvas, FlowLine, GlowDot, type Point } from "./shared";
import { ServiceIcon } from "@/components/site/service-icon";

/**
 * Services page visual: the services ecosystem. Each real service is a node
 * orbiting an "operations hub" core; hovering brightens and expands it while
 * dimming the rest. Marching-dot connectors + soft rotor stay CSS-only and
 * drop out under reduced motion (full diagram remains visible/static).
 */

interface ServiceNode {
  slug: string;
  name: string;
  icon?: string | null;
  short: string;
  point: Point;
}

export function ServicesEcosystem({
  services,
  className,
}: {
  services: { slug: string; name: string; icon?: string | null; shortDescription?: string | null }[];
  className?: string;
}) {
  const [active, setActive] = React.useState<number | null>(null);

  const nodes: ServiceNode[] = React.useMemo(() => {
    const cx = 50;
    const cy = 48;
    const rx = 32;
    const ry = 34;
    return services.map((s, i) => {
      const angle = ((i + 0.5) / Math.max(services.length, 1)) * Math.PI * 2 - Math.PI / 2;
      return {
        slug: s.slug,
        name: s.name,
        icon: s.icon,
        short: s.shortDescription ?? "",
        point: { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) },
      };
    });
  }, [services]);

  if (nodes.length === 0) return null;

  return (
<VisualFrame className={cn("overflow-hidden", className)}>
      <div className="relative min-h-[24rem] sm:min-h-[24rem]">
        <NodeCanvas>
          {nodes.map((n, i) => (
            <FlowLine
              key={`${n.name}-${i}`}
              from={{ x: 50, y: 48 }}
              to={n.point}
              className={cn(
                "transition-[opacity] duration-300",
                active !== null && active !== i && "opacity-20"
              )}
            />
          ))}
        </NodeCanvas>

        {/* Core hub */}
        <div className="brand-center absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-center">
          <BrandMark className="mx-auto w-20 sm:w-24" />
          <div className="absolute left-1/2 top-full mt-2 w-40 -translate-x-1/2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-foreground">
            your operations
          </div>
        </div>

        {/* Service nodes */}
        {nodes.map((n, i) => {
          const isActive = active === i;
          const dimmed = active !== null && !isActive;
          return (
            <div
              key={`${n.name}-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.point.x}%`, top: `${n.point.y}%`, zIndex: isActive ? 20 : 1 }}
            >
              <Link
                href={`/services/${n.slug}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={cn(
                  "group flex w-[7.5rem] flex-col items-center gap-1.5 rounded-2xl border px-3 py-2.5 text-center shadow-card backdrop-blur transition-all duration-300 sm:w-40",
                  isActive
                    ? "border-primary/60 bg-card shadow-[0_24px_48px_-24px_rgba(59,130,246,0.5)]"
                    : "border-border/70 bg-background/80",
                  dimmed && "opacity-35 saturate-50"
                )}
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-400/10 text-primary transition-transform duration-300 group-hover:scale-110 sm:size-10">
                  <ServiceIcon icon={n.icon} className="size-4 sm:size-5" />
                </span>
                <span className="text-[0.66rem] font-bold leading-tight tracking-tight text-foreground sm:text-xs">
                  {n.name}
                </span>
                <span
                  className={cn(
                    "max-w-[8rem] text-[0.58rem] leading-4 text-muted-foreground transition-opacity duration-300 sm:text-[0.62rem]",
                    isActive ? "opacity-100" : "hidden"
                  )}
                >
                  {n.short}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-primary",
                    isActive ? "opacity-100" : "hidden"
                  )}
                >
                  open <ArrowUpRight className="size-3" />
                </span>
              </Link>
            </div>
          );
        })}

        {/* Bottom status */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <GlowDot />
          <span className="font-mono text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            explore a service to learn more
          </span>
        </div>
      </div>
    </VisualFrame>
  );
}
