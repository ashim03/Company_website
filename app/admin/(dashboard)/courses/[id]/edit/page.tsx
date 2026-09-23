import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMedia } from "@/lib/admin-queries";
import { asRecord, stringArray } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { CourseFields } from "@/components/admin/forms/course-fields";
import { updateCourse } from "@/app/admin/actions/content";
import { text } from "@/lib/types";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  const media = await getMedia();
  const record = asRecord(course);

  return (
    <div>
      <AdminPageHeader
        title={`Edit · ${course.name}`}
        back={{ href: "/admin/courses", label: "Courses" }}
      />
      <EntityForm
        action={updateCourse.bind(null, course.id)}
        submitLabel="Save changes"
        cancelHref="/admin/courses"
      >
        <CourseFields
          media={media}
          defaults={{
            name: course.name,
            slug: course.slug,
            category: text(record.category),
            level: text(record.level),
            duration: text(record.duration),
            mode: text(record.mode),
            shortDescription: course.shortDescription,
            description: text(record.description),
            syllabus: stringArray(course.syllabus),
            prerequisites: stringArray(course.prerequisites),
            price: text(record.price),
            coverImage: text(record.coverImage),
            status: course.status,
            sortOrder: course.sortOrder,
          }}
        />
      </EntityForm>
    </div>
  );
}