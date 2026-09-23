"use client";

import { useState } from "react";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { uploadMediaAction } from "@/app/admin/actions/media";

function isImageUrl(url: string): boolean {
  return url.startsWith("data:image") || /\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(url);
}

function fileIsImage(item: { type: string }): boolean {
  return item.type.startsWith("image/");
}

export function MediaPicker({
  name,
  label,
  defaultUrl = "",
  media = [],
  folder = "general",
  className,
}: {
  name: string;
  label: string;
  defaultUrl?: string;
  media?: { id: string; name: string; type: string; url: string }[];
  folder?: string;
  className?: string;
}) {
  const [url, setUrl] = useState(defaultUrl);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(media);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-1.5 space-y-2">
        <div className="flex gap-2">
          <Input
            type="url"
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… or choose from the library"
          />
          <Button type="button" variant="outline" onClick={() => setOpen(true)}>
            <ImagePlus className="size-4" />
            Library
          </Button>
        </div>
        {url && isImageUrl(url) ? (
          <div className="relative h-28 w-full overflow-hidden rounded-md border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={label} className="h-full w-full object-cover" />
          </div>
        ) : null}
        {url && !isImageUrl(url) ? (
          <p className="truncate text-xs text-muted-foreground">{url}</p>
        ) : null}

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Media library"
          description="Upload a file, or click an existing one to use it."
          className="sm:max-w-2xl"
        >
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-accent">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? "Uploading…" : "Upload a new file"}
            <input
              type="file"
              className="sr-only"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                setUploading(true);
                setError(null);
                const result = await uploadMediaAction(file, folder);
                setUploading(false);
                if (result.ok) {
                  setUrl(result.url);
                  setItems((prev) => [
                    { id: result.id, name: file.name, type: file.type, url: result.url },
                    ...prev,
                  ]);
                } else {
                  setError(result.error);
                }
              }}
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="grid grid-cols-3 gap-2">
            {items.length === 0 ? (
              <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                Nothing uploaded yet.
              </p>
            ) : null}
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setUrl(item.url);
                  setOpen(false);
                }}
                className="group overflow-hidden rounded-md border text-left transition-colors hover:border-primary"
              >
                <div className="flex h-20 items-center justify-center bg-muted">
                  {fileIsImage(item) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs uppercase text-muted-foreground">
                      {item.type.split("/")[1]}
                    </span>
                  )}
                </div>
                <p className="truncate px-1.5 py-1 text-[11px] text-muted-foreground">
                  {item.name}
                </p>
              </button>
            ))}
          </div>
        </Dialog>
      </div>
    </div>
  );
}