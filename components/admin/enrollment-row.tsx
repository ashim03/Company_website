"use client";

import { useActionState } from "react";
import type { ClassEnrollment } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { ENROLLMENT_STATUS_LABELS } from "@/lib/constants";
import {
  updateEnrollmentStatus,
  deleteEnrollment,
} from "@/app/admin/actions/enrollments";
import type { ActionState } from "@/components/admin/entity-form";

const STATUS_OPTIONS = [
  "NEW",
  "REVIEWING",
  "ACCEPTED",
  "WAITLISTED",
  "REJECTED",
  "ARCHIVED",
] as const;

export function EnrollmentRow({ enrollment }: { enrollment: ClassEnrollment }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateEnrollmentStatus,
    undefined
  );

  return (
    <li className="border-b p-4 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium">
            {enrollment.name}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {enrollment.email}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Interested in:{" "}
            <span className="font-medium text-foreground/80">{enrollment.course}</span>
            {enrollment.experience ? ` · Level: ${enrollment.experience}` : ""}
            {enrollment.schedule ? ` · Schedule: ${enrollment.schedule}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form action={formAction}>
            <input type="hidden" name="id" value={enrollment.id} />
            <select
              name="status"
              defaultValue={enrollment.status}
              onChange={(e) => {
                const form = e.target.form;
                if (form) form.requestSubmit();
              }}
              className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {ENROLLMENT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </form>
          <DeleteButton
            id={enrollment.id}
            action={deleteEnrollment}
            label="Delete request"
            confirmText="Delete this enrollment request?"
          />
        </div>
      </div>
      {state?.error ? <p className="mt-2 text-xs text-destructive">{state.error}</p> : null}
      {enrollment.message ? (
        <details className="mt-2">
          <summary className="cursor-pointer text-sm text-primary">
            {enrollment.message.length > 120 ? "Read message" : "Message"}
          </summary>
          <p className="mt-2 whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm">
            {enrollment.message}
          </p>
        </details>
      ) : null}
      <div className="mt-2 flex items-center gap-2">
        <Badge variant={enrollment.status === "NEW" ? "warning" : "secondary"}>
          {enrollment.status}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {enrollment.createdAt.toLocaleString()} · IP {enrollment.ip ?? "—"} ·{" "}
          {enrollment.phone || "No phone"}
        </span>
      </div>
    </li>
  );
}