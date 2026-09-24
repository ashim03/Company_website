"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavNode } from "@/lib/types";

export function DesktopNav({ items }: { items: NavNode[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const ref = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(null); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  return <ul ref={ref} className="flex items-center gap-1" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(null); }} onKeyDown={e => { if (e.key === "Escape") { const button = ref.current?.querySelector<HTMLButtonElement>('button[aria-expanded="true"]'); setOpen(null); button?.focus(); } }}>
    {items.map(item => <li key={item.id} className="relative">
      {item.children.length ? <>
        <button type="button" aria-expanded={open === item.id} aria-controls={`nav-${item.id}`} onClick={() => setOpen(open === item.id ? null : item.id)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3.5 text-sm font-medium text-foreground hover:bg-secondary">{item.label}<ChevronDown className={`size-3.5 transition-transform ${open === item.id ? "rotate-180" : ""}`} /></button>
        <ul id={`nav-${item.id}`} hidden={open !== item.id} className="absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border bg-popover p-2 shadow-soft">
          {item.children.map(child => <li key={child.id}><Link href={child.url} target={child.isExternal ? "_blank" : undefined} rel={child.isExternal ? "noopener noreferrer" : undefined} onClick={() => setOpen(null)} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-popover-foreground hover:bg-secondary">{child.label}</Link></li>)}
        </ul>
      </> : <Link href={item.url} target={item.isExternal ? "_blank" : undefined} rel={item.isExternal ? "noopener noreferrer" : undefined} onClick={() => setOpen(null)} className="inline-flex min-h-11 items-center rounded-lg px-3.5 text-sm font-medium text-foreground hover:bg-secondary">{item.label}</Link>}
    </li>)}
  </ul>;
}
