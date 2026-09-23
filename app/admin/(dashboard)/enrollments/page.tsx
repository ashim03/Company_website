import { getEnrollments } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EnrollmentRow } from "@/components/admin/enrollment-row";

export default async function AdminEnrollmentsPage() {
  const enrollments = await getEnrollments();
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Enrollment requests"
        description={`Class enrollment form submissions. ${enrollments.filter((e) => e.status === "NEW").length} new.`}
      />
      {enrollments.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
          No enrollment requests yet. They appear here when someone submits the form on the Classes
          page.
        </div>
      ) : (
        <ul className="rounded-lg border bg-card">
          {enrollments.map((enrollment) => (
            <EnrollmentRow key={enrollment.id} enrollment={enrollment} />
          ))}
        </ul>
      )}
    </div>
  );
}