"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 text-[11px] text-primary hover:underline"
      title="Copy URL"
    >
      {copied ? <Check className="size-3" /> : <Link2 className="size-3" />}
      {copied ? "Copied" : "Copy URL"}
    </button>
  );
}