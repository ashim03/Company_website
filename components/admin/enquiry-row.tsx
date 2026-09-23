"use client";

import { useActionState } from "react";
import type { ContactEnquiry } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { ENQUIRY_STATUS_LABELS } from "@/lib/constants";
import { updateEnquiryStatus, deleteEnquiry } from "@/app/admin/actions/enquiries";
import type { ActionState } from "@/components/admin/entity-form";

const STATUS_OPTIONS = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;

export function EnquiryRow({ enquiry }: { enquiry: ContactEnquiry }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateEnquiryStatus,
    undefined
  );

  return (
    <li className="border-b p-4 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">
            {enquiry.name}
            <span className="ml-2 text-sm font-normal text-muted-foreground">{enquiry.email}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {enquiry.company || "No company"} · {enquiry.service || "No service"} ·{" "}
            {enquiry.budget || "No budget"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form action={formAction}>
            <input type="hidden" name="id" value={enquiry.id} />
            <select
              name="status"
              defaultValue={enquiry.status}
              onChange={(e) => {
                const form = e.target.form;
                if (form) form.requestSubmit();
              }}
              className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {ENQUIRY_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </form>
          <DeleteButton
            id={enquiry.id}
            action={deleteEnquiry}
            label="Delete enquiry"
            confirmText="Delete this enquiry?"
          />
        </div>
      </div>
      {state?.error ? <p className="mt-2 text-xs text-destructive">{state.error}</p> : null}
      <details className="mt-2">
        <summary className="cursor-pointer text-sm text-primary">
          {enquiry.message.length > 120 ? "Read message" : "Message"}
        </summary>
        <p className="mt-2 whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm">
          {enquiry.message}
        </p>
      </details>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant={enquiry.status === "NEW" ? "warning" : "secondary"}>{enquiry.status}</Badge>
        <span className="text-xs text-muted-foreground">
          {enquiry.createdAt.toLocaleString()} · IP {enquiry.ip ?? "—"}
        </span>
      </div>
    </li>
  );
}