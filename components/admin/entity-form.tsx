"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/admin/fields";

export type ActionState = { error?: string } | undefined;

export function EntityForm({
  action,
  submitLabel,
  children,
  cancelHref,
  hint,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  children: React.ReactNode;
  cancelHref: string;
  hint?: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="max-w-3xl space-y-5">
      {state?.error ? <FormError error={state.error} /> : null}
      {children}
      <div className="flex items-center gap-3 border-t pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {submitLabel}
        </Button>
        <Link
          href={cancelHref}
          className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Cancel
        </Link>
        {hint ? (
          <p className="ml-auto text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </form>
  );
}