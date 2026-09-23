"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setTeamSectionVisibility } from "@/app/admin/actions/team-section";
import { cn } from "@/lib/utils";

export function TeamSectionControl({ initialVisible }: { initialVisible: boolean }) {
  const [visible, setVisible] = useState(initialVisible);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const toggle = (next: boolean) => {
    setError(null);
    startTransition(async () => {
      const result = await setTeamSectionVisibility(next);
      setVisible(result.visible);
      if (result.error) setError(result.error);
    });
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-5",
        visible ? "border-primary/30" : "border-border"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-2.5 rounded-full",
                visible ? "bg-success" : "bg-muted-foreground/40"
              )}
            />
            <p className="font-medium">
              Team section is{" "}
              <span className={visible ? "text-success" : "text-muted-foreground"}>
                {visible ? "Published" : "Unpublished"}
              </span>
            </p>
          </div>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
            {visible
              ? "The “Meet the team” section currently appears on the public site. Members manage their own profiles from the Team list below."
              : "The “Meet the team” section is hidden from the public site. Toggle it on when you are ready for members to appear."}
          </p>
          {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
        </div>
        <Button
          type="button"
          variant={visible ? "outline" : "default"}
          size="sm"
          disabled={pending}
          onClick={() => toggle(!visible)}
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {visible ? "Unpublish section" : "Publish section"}
        </Button>
      </div>
    </div>
  );
}