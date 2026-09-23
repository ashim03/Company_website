import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { CourseFields } from "@/components/admin/forms/course-fields";
import { createCourse } from "@/app/admin/actions/content";

export default async function NewCoursePage() {
  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader title="New course" back={{ href: "/admin/courses", label: "Courses" }} />
      <EntityForm action={createCourse} submitLabel="Create course" cancelHref="/admin/courses">
        <CourseFields media={media} />
      </EntityForm>
    </div>
  );
}