import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { FaqFields } from "@/components/admin/forms/faq-fields";
import { createFaq } from "@/app/admin/actions/content";

export default function NewFaqPage() {
  return (
    <div>
      <AdminPageHeader title="New FAQ" back={{ href: "/admin/faqs", label: "FAQs" }} />
      <EntityForm action={createFaq} submitLabel="Create FAQ" cancelHref="/admin/faqs">
        <FaqFields />
      </EntityForm>
    </div>
  );
}