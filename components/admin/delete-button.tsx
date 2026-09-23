"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmText = "Delete this item? This cannot be undone.",
}: {
  action: (id: string) => Promise<void>;
  id: string;
  label?: string;
  confirmText?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={async () => {
          if (!window.confirm(confirmText)) return;
          setPending(true);
          setError(null);
          try {
            await action(id);
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed.");
          } finally {
            setPending(false);
          }
        }}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
        <span className="sr-only">{label}</span>
      </Button>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}