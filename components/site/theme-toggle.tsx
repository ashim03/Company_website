"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem("codastra-theme", theme);
  } catch {
    // private mode — ignore
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("dark");

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("codastra-theme");
      const next: Theme =
        stored === "dark" || stored === "light"
          ? stored
          : "dark";
      const timer = window.setTimeout(() => setTheme(next), 0);
      return () => window.clearTimeout(timer);
    } catch {
      // ignore
    }
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}