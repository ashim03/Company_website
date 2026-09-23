import Link from "next/link";
import { Plus } from "lucide-react";
import { getCourses } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteCourse } from "@/app/admin/actions/content";

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Courses"
        description="The class catalog shown on /classes. Visitors enroll directly from this list."
        actions={
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New course
          </Link>
        }
      />
      <AdminTable
        columns={[
          { key: "name", label: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
          { key: "category", label: "Category", cell: (c) => c.category || "—" },
          { key: "level", label: "Level", cell: (c) => c.level || "—" },
          { key: "price", label: "Fee", cell: (c) => c.price || "—" },
          { key: "status", label: "Status", cell: (c) => <StatusBadge status={c.status} /> },
          { key: "sortOrder", label: "Order" },
        ]}
        rows={courses}
        emptyLabel="No courses yet. Create your first course."
        actions={{
          edit: (c) => `/admin/courses/${c.id}/edit`,
          view: () => `/classes`,
          delete: (c) => c.name,
          onDelete: deleteCourse,
        }}
      />
    </div>
  );
}