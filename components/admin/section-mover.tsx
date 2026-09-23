"use client";

import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moveSection } from "@/app/admin/actions/pages";

export function SectionMover({ id, direction }: { id: string; direction: "up" | "down" }) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={direction === "up" ? "Move section up" : "Move section down"}
      onClick={async () => {
        await moveSection(id, direction);
        router.refresh();
      }}
    >
      {direction === "up" ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
    </Button>
  );
}