"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { updateMediaAlt } from "@/app/admin/actions/media";

export function MediaAltEditor({ id, defaultValue }: { id: string; defaultValue: string }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [saving, setSaving] = useState(false);

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex w-full items-center justify-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Pencil className="size-3" />
        {value ? value : "Add alt text"}
      </button>
    );
  }

  return (
    <form
      className="flex items-center gap-1.5 p-1"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        await updateMediaAlt(id, value);
        setSaving(false);
        setEditing(false);
        router.refresh();
      }}
    >
      <input
        className="w-full rounded border bg-background px-1.5 py-0.5 text-[11px]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <button
        type="submit"
        disabled={saving}
        className="rounded bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground"
      >
        Save
      </button>
    </form>
  );
}