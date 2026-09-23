import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMedia } from "@/lib/admin-queries";
import { text } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { TestimonialFields } from "@/components/admin/forms/testimonial-fields";
import { updateTestimonial } from "@/app/admin/actions/content";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader
        title="Edit testimonial"
        back={{ href: "/admin/testimonials", label: "Testimonials" }}
      />
      <EntityForm
        action={updateTestimonial.bind(null, testimonial.id)}
        submitLabel="Save changes"
        cancelHref="/admin/testimonials"
      >
        <TestimonialFields
          media={media}
          defaults={{
            quote: testimonial.quote,
            author: text(testimonial.author),
            role: text(testimonial.role),
            company: text(testimonial.company),
            avatar: text(testimonial.avatar),
            source: text(testimonial.source),
            sortOrder: testimonial.sortOrder,
            isVisible: testimonial.isVisible,
          }}
        />
      </EntityForm>
    </div>
  );
}