import {
  Braces,
  Cloud,
  Cpu,
  Database,
  Globe,
  Server,
  Terminal,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ambience layer: drifting gradient orbs + optional grid + grain. Also hosts
 * the floating tech chips and scan sweep used site-wide, so all ambient
 * decoration lives in ONE layer instead of stacked duplicates. Completely
 * decorative; pointer-events none. Respects reduced motion.
 */
export function Aurora({
  className,
  orbs = 3,
  grid = true,
  chips = false,
  scan = false,
}: {
  className?: string;
  orbs?: number;
  grid?: boolean;
  chips?: boolean;
  scan?: boolean;
}) {
  const positions = [
    {
      size: "h-[34rem] w-[34rem]",
      color: "bg-blue-500/10 dark:bg-blue-500/25",
      cls: "-top-40 -left-32",
    },
    {
      size: "h-[30rem] w-[30rem]",
      color: "bg-cyan-600/8 dark:bg-cyan-400/20",
      cls: "top-1/4 -right-40",
    },
    {
      size: "h-[28rem] w-[28rem]",
      color: "bg-indigo-500/8 dark:bg-sky-400/20",
      cls: "-bottom-32 left-1/3",
    },
  ];

  const techChips = [
    { Icon: Wand2, cls: "left-[6%] top-[22%]", delay: "0s" },
    { Icon: Braces, cls: "left-[88%] top-[16%]", delay: "-1.4s" },
    { Icon: Database, cls: "left-[12%] top-[72%]", delay: "-2.6s" },
    { Icon: Cloud, cls: "left-[82%] top-[66%]", delay: "-3.2s" },
    { Icon: Cpu, cls: "left-[48%] top-[84%]", delay: "-1.8s" },
    { Icon: Server, cls: "left-[56%] top-[10%]", delay: "-4.1s" },
    { Icon: Globe, cls: "left-[24%] top-[40%]", delay: "-0.9s" },
    { Icon: Terminal, cls: "left-[70%] top-[38%]", delay: "-3.6s" },
  ];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 isolate overflow-hidden", className)}
    >
      {chips ? (
        <div
          className="absolute inset-0"
          style={{ maskImage: "radial-gradient(ellipse 120% 90% at 50% 10%, black 55%, transparent 100%)" }}
        >
          {techChips.map(({ Icon, cls, delay }, i) => (
            <div
              key={i}
              className={cn("animate-float absolute text-primary/14 motion-reduce:hidden", cls)}
              style={{ animationDelay: delay, animationDuration: "7s" }}
            >
              <Icon className="size-9 drop-shadow-[0_0_14px_rgba(59,130,246,0.35)]" />
            </div>
          ))}
        </div>
      ) : null}
      {grid ? (
        <div className="tech-grid animate-grid absolute inset-0 opacity-70" />
      ) : null}
      {positions.slice(0, orbs).map((orb, i) => (
        <div
          key={i}
          className={cn(
            "animate-drift absolute rounded-full blur-[110px] motion-reduce:hidden",
            orb.size,
            orb.color,
            orb.cls
          )}
          style={{ animationDelay: `${-i * 5}s` }}
        />
      ))}
      {scan ? (
        <div className="animate-scan absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-transparent via-primary/8 to-transparent motion-reduce:hidden" />
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, transparent, color-mix(in srgb, var(--background) 82%, transparent) 78%)",
        }}
      />
    </div>
  );
}
