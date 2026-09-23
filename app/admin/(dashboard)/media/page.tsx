import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { MediaUpload } from "@/components/admin/media-upload";
import { MediaAltEditor } from "@/components/admin/media-alt-editor";
import { CopyUrlButton } from "@/components/admin/copy-url-button";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMediaAction } from "@/app/admin/actions/media";

function isImage(type: string): boolean {
  return type.startsWith("image/");
}

export default async function AdminMediaPage() {
  const media = await getMedia();
  return (
    <div className="mx-auto max-w-5xl">
      <AdminPageHeader
        title="Media"
        description="Files uploaded to the site. Attach them to content with the “Library” button in any form."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,2fr)]">
        <div>
          <MediaUpload />
        </div>
        <div>
          {media.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">
              No files yet. Upload your first image above.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {media.map((item) => (
                <div key={item.id} className="overflow-hidden rounded-lg border bg-card">
                  <div className="flex h-28 items-center justify-center bg-muted">
                    {isImage(item.type) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.alt ?? item.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {item.type.split("/")[1]} · {(item.size / 1024).toFixed(0)} KB
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 p-2">
                    <p className="truncate text-[11px] font-medium" title={item.name}>
                      {item.name}
                    </p>
                    <CopyUrlButton url={item.url} />
                    <MediaAltEditor id={item.id} defaultValue={item.alt ?? ""} />
                    <div className="flex justify-end">
                      <DeleteButton
                        id={item.id}
                        action={deleteMediaAction}
                        label="Delete file"
                        confirmText={`Delete "${item.name}" (${(item.size / 1024).toFixed(0)} KB)? Files still used by content cannot be deleted.`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}