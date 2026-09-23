import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { text } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { FaqFields } from "@/components/admin/forms/faq-fields";
import { updateFaq } from "@/app/admin/actions/content";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit FAQ" back={{ href: "/admin/faqs", label: "FAQs" }} />
      <EntityForm
        action={updateFaq.bind(null, faq.id)}
        submitLabel="Save changes"
        cancelHref="/admin/faqs"
      >
        <FaqFields
          defaults={{
            question: faq.question,
            answer: faq.answer,
            category: text(faq.category),
            sortOrder: faq.sortOrder,
            isVisible: faq.isVisible,
          }}
        />
      </EntityForm>
    </div>
  );
}