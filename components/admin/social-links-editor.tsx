"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type SocialLink = { label: string; url: string; demo: boolean };
export function SocialLinksEditor({ initial }: { initial: SocialLink[] }) {
  const [links, setLinks] = useState(initial);
  const update = (index: number, value: Partial<SocialLink>) => setLinks(links.map((link, i) => i === index ? { ...link, ...value } : link));
  return <div className="space-y-4 sm:col-span-2">
    <div><h3 className="font-medium">Additional social platforms</h3><p className="mt-1 text-sm text-muted-foreground">Add TikTok, Reddit, GitHub, X, or any platform. Replace demo URLs with your company profiles and uncheck Demo.</p></div>
    <input type="hidden" name="social_extra" value={JSON.stringify(links)} />
    {links.map((link, i) => <div key={i} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
      <label className="space-y-1 text-sm">Platform name<Input value={link.label} required maxLength={40} onChange={e => update(i, { label: e.target.value })} /></label>
      <label className="space-y-1 text-sm">Profile URL<Input type="url" value={link.url} required onChange={e => update(i, { url: e.target.value })} /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={link.demo} onChange={e => update(i, { demo: e.target.checked })} />Demo link</label>
      <Button variant="outline" onClick={() => setLinks(links.filter((_, index) => index !== i))}>Remove {link.label || "link"}</Button>
    </div>)}
    <Button variant="outline" disabled={links.length >= 20} onClick={() => setLinks([...links, { label: "", url: "", demo: false }])}>Add social platform</Button>
  </div>;
}
