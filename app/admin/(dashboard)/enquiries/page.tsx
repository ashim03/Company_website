import { getEnquiries } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EnquiryRow } from "@/components/admin/enquiry-row";

export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();
  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Enquiries"
        description={`Contact form submissions. ${enquiries.filter((e) => e.status === "NEW").length} new.`}
      />
      {enquiries.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
          No enquiries yet. They appear here when someone submits the contact form.
        </div>
      ) : (
        <ul className="rounded-lg border bg-card">
          {enquiries.map((enquiry) => (
            <EnquiryRow key={enquiry.id} enquiry={enquiry} />
          ))}
        </ul>
      )}
    </div>
  );
}