import { Badge } from "@/components/ui/badge";
import {
  STATUS_LABELS,
  ENQUIRY_STATUS_LABELS,
  ENROLLMENT_STATUS_LABELS,
  ROLE_LABELS,
  USER_STATUS_LABELS,
} from "@/lib/constants";

export function StatusBadge({
  status,
  tone,
}: {
  status: string;
  tone?: "public" | "enquiry" | "enrollment" | "role" | "user";
}) {
  if (tone === "enquiry") {
    const label = ENQUIRY_STATUS_LABELS[status as keyof typeof ENQUIRY_STATUS_LABELS] ?? status;
    const variant =
      status === "NEW" ? "warning" : status === "REPLIED" ? "success" : "secondary";
    return <Badge variant={variant as "warning"}>{label}</Badge>;
  }
  if (tone === "enrollment") {
    const label =
      ENROLLMENT_STATUS_LABELS[status as keyof typeof ENROLLMENT_STATUS_LABELS] ?? status;
    const variant =
      status === "NEW"
        ? "warning"
        : status === "ACCEPTED"
          ? "success"
          : status === "REJECTED" || status === "ARCHIVED"
            ? "muted"
            : "secondary";
    return <Badge variant={variant as "warning"}>{label}</Badge>;
  }
  if (tone === "role") {
    return (
      <Badge variant={status === "ADMIN" ? "destructive" : "secondary"}>
        {ROLE_LABELS[status as keyof typeof ROLE_LABELS] ?? status}
      </Badge>
    );
  }
  if (tone === "user") {
    const label = USER_STATUS_LABELS[status as keyof typeof USER_STATUS_LABELS] ?? status;
    return (
      <Badge variant={status === "ACTIVE" ? "success" : "secondary"}>{label}</Badge>
    );
  }
  const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status;
  const variant =
    status === "PUBLISHED" ? "success" : status === "DRAFT" ? "secondary" : "muted";
  return <Badge variant={variant as "success"}>{label}</Badge>;
}