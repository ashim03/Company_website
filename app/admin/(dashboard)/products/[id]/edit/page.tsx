import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMedia } from "@/lib/admin-queries";
import { asRecord, stringArray, text } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { ProductFields } from "@/components/admin/forms/product-fields";
import { updateProduct } from "@/app/admin/actions/content";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const [media] = await Promise.all([getMedia()]);
  const record = asRecord(product);

  return (
    <div>
      <AdminPageHeader
        title={`Edit · ${product.name}`}
        back={{ href: "/admin/products", label: "Products" }}
      />
      <EntityForm
        action={updateProduct.bind(null, product.id)}
        submitLabel="Save changes"
        cancelHref="/admin/products"
      >
        <ProductFields
          media={media}
          defaults={{
            name: product.name,
            slug: product.slug,
            logo: text(record.logo),
            tagline: text(record.tagline),
            shortDescription: product.shortDescription,
            detailedDescription: text(record.detailedDescription),
            screenshots: stringArray(product.screenshots),
            features: stringArray(product.features),
            technology: text(record.technology),
            websiteUrl: text(record.websiteUrl),
            ctaLabel: text(record.ctaLabel),
            status: product.status,
            sortOrder: product.sortOrder,
          }}
        />
      </EntityForm>
    </div>
  );
}