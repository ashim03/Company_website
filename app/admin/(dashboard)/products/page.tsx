import Link from "next/link";
import { Plus } from "lucide-react";
import { getProducts } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminTable } from "@/components/admin/table";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteProduct } from "@/app/admin/actions/content";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Products"
        description="Products you build and maintain — shown on /products and the homepage."
        actions={
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New product
          </Link>
        }
      />
      <AdminTable
        columns={[
          { key: "name", label: "Name", cell: (p) => <span className="font-medium">{p.name}</span> },
          { key: "slug", label: "Slug", cell: (p) => <code className="text-xs">{p.slug}</code> },
          { key: "status", label: "Status", cell: (p) => <StatusBadge status={p.status} /> },
          { key: "sortOrder", label: "Order" },
        ]}
        rows={products}
        emptyLabel="No products yet. Create your first product."
        actions={{
          edit: (p) => `/admin/products/${p.id}/edit`,
          view: (p) => `/products/${p.slug}`,
          delete: (p) => p.name,
          onDelete: deleteProduct,
        }}
      />
    </div>
  );
}