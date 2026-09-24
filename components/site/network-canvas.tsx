"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive neural-network backdrop drawn on a single <canvas>.
 *
 * - Nodes drift slowly and connect to neighbours within a threshold.
 * - On fine-pointer devices the cursor attracts a soft glow and links to
 *   nearby nodes, so the scene reacts to movement without stealing focus.
 * - Performance guardrails: capped device-pixel-ratio, paused while the tab
 *   is hidden, far fewer nodes on small screens, and cursor interaction is
 *   disabled for coarse pointers (touch).
 * - Respects `prefers-reduced-motion`: renders one static frame, no loop.
 *
 * Completely decorative: pointer-events none, aria-hidden, never interactive.
 */
export function NetworkCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas ? canvas.getContext("2d") : null;
    if (!canvas || !context) return;
    const el = canvas;
    const ctx = context;

    let dark = document.documentElement.classList.contains("dark");
    let ACCENT: readonly [number, number, number] = dark ? [0, 136, 255] : [44, 86, 152];
    const GLOW = [34, 211, 238] as const; // #22d3ee
    let NODE: readonly [number, number, number] = dark ? [148, 163, 184] : [62, 89, 130];
    const LINK_RANGE = 150;
    const CURSOR_RANGE = 190;
    const CURSOR_FORCE = 0.018;

    let width = 0;
    let height = 0;
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    let raf = 0;
    let running = false;
    let lastT = 0;

    const mouse = { x: -9999, y: -9999, active: false, fine: true };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    function nodeCount() {
      if (width < 768) return 26;
      if (width < 1100) return 46;
      return 70;
    }

    function seed() {
      const count = nodeCount();
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1 + Math.random() * 1.6,
      }));
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function wire(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      rgb: readonly [number, number, number],
      alpha: number
    ) {
      if (alpha <= 0.02) return;
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function draw(dt: number) {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx * dt * 60;
        n.y += n.vy * dt * 60;
        if (n.x < -20) n.x = width + 20;
        else if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        else if (n.y > height + 20) n.y = -20;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_RANGE * LINK_RANGE) {
            wire(a.x, a.y, b.x, b.y, ACCENT, (1 - Math.sqrt(d2) / LINK_RANGE) * (dark ? 0.32 : 0.46));
          }
        }
      }

      const hasCursor = mouse.active && mouse.fine;
      if (hasCursor) {
        const farthest = CURSOR_RANGE * CURSOR_RANGE;
        for (const n of nodes) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < farthest) {
            const d = Math.sqrt(d2);
            const t = 1 - d / CURSOR_RANGE;
            n.vx -= dx * t * CURSOR_FORCE * dt * 60;
            n.vy -= dy * t * CURSOR_FORCE * dt * 60;
            wire(n.x, n.y, mouse.x, mouse.y, GLOW, t * 0.28);
          }
        }
      }

      for (const n of nodes) {
        if (n.vx * n.vx + n.vy * n.vy > 0.9) {
          n.vx *= 0.96;
          n.vy *= 0.96;
        }
        const pulse = hasCursor ? 0.9 + 0.25 * Math.sin(n.x * 0.02 + n.y * 0.02) : 1;
        ctx.fillStyle = `rgba(${NODE[0]},${NODE[1]},${NODE[2]},0.75)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      if (hasCursor) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          CURSOR_RANGE
        );
        glow.addColorStop(0, `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},0.14)`);
        glow.addColorStop(1, `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, CURSOR_RANGE, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function staticFrame() {
      seed();
      draw(0);
    }

    function step(t: number) {
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      draw(dt);
      if (running) raf = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      lastT = performance.now();
      raf = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onPointerMove(e: PointerEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }

    function onPointerLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function onVisibilityChange() {
      if (document.hidden) stop();
      else if (!reduced.matches) start();
    }

    function applyMotionPreference() {
      mouse.fine = finePointer.matches;
      if (reduced.matches) {
        stop();
        staticFrame();
      } else {
        start();
      }
    }

    function onResize() {
      resize();
      if (reduced.matches) staticFrame();
    }

    mouse.fine = finePointer.matches;
    resize();
    if (reduced.matches) staticFrame();
    else start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    reduced.addEventListener("change", applyMotionPreference);
    finePointer.addEventListener("change", applyMotionPreference);
    const themeObserver = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      ACCENT = dark ? [0, 136, 255] : [44, 86, 152];
      NODE = dark ? [148, 163, 184] : [62, 89, 130];
      if (reduced.matches) draw(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      stop();
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      reduced.removeEventListener("change", applyMotionPreference);
      finePointer.removeEventListener("change", applyMotionPreference);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 -z-20", className)}
    />
  );
}
