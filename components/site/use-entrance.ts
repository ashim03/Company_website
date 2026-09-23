"use client";

import { useEffect, useRef, useState } from "react";

/** One-shot motion enhancement; CSS keeps content visible even without JS. */
export function useEntrance<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let frame = 0;
    const finish = () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setVisible(true));
    };
    const onPreference = () => {
      if (preference.matches) finish();
    };

    if (preference.matches || node.getBoundingClientRect().top <= window.innerHeight + 80 ||
        typeof IntersectionObserver === "undefined") {
      finish();
    } else {
      observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) finish();
      }, { threshold: 0, rootMargin: "80px 0px" });
      observer.observe(node);
    }
    preference.addEventListener("change", onPreference);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", onPreference);
    };
  }, []);

  return { ref, visible };
}
