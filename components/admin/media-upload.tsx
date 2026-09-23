"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMediaAction } from "@/app/admin/actions/media";

export function MediaUpload() {
  const router = useRouter();
  const [folder, setFolder] = useState("general");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="space-y-3">
        <div>
          <Label htmlFor="media-folder">Upload to folder</Label>
          <Input
            id="media-folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g. services"
            className="mt-1.5 w-full sm:max-w-xs"
          />
        </div>
        <div>
          <Label htmlFor="media-file">File</Label>
          <input
            id="media-file"
            type="file"
            accept="image/*,application/pdf,video/mp4"
            disabled={pending}
            className="mt-1.5 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-foreground"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setPending(true);
              setError(null);
              const result = await uploadMediaAction(file, folder);
              setPending(false);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              router.refresh();
            }}
          />
        </div>
        {pending ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Uploading…
          </p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}