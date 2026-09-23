import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { TestimonialFields } from "@/components/admin/forms/testimonial-fields";
import { createTestimonial } from "@/app/admin/actions/content";

export default async function NewTestimonialPage() {
  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader title="New testimonial" back={{ href: "/admin/testimonials", label: "Testimonials" }} />
      <EntityForm action={createTestimonial} submitLabel="Create testimonial" cancelHref="/admin/testimonials">
        <TestimonialFields media={media} />
      </EntityForm>
    </div>
  );
}