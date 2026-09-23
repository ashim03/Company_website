import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { ProductFields } from "@/components/admin/forms/product-fields";
import { createProduct } from "@/app/admin/actions/content";

export default async function NewProductPage() {
  const media = await getMedia();
  return (
    <div>
      <AdminPageHeader title="New product" back={{ href: "/admin/products", label: "Products" }} />
      <EntityForm action={createProduct} submitLabel="Create product" cancelHref="/admin/products">
        <ProductFields media={media} />
      </EntityForm>
    </div>
  );
}