import { getSettings } from "@/lib/site-settings";
import { getMedia } from "@/lib/admin-queries";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EntityForm } from "@/components/admin/entity-form";
import { TextField, TextAreaField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/media-picker";
import { updateSettings } from "@/app/admin/actions/settings";

export default async function AdminSettingsPage() {
  const [settings, media] = await Promise.all([getSettings(), getMedia()]);

  return (
    <div>
      <AdminPageHeader
        title="Site settings"
        description="Brand, contact details, and SEO defaults. Changes apply immediately."
      />
      <EntityForm action={updateSettings} submitLabel="Save settings" cancelHref="/admin/settings">
        <section className="space-y-4 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Company</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Company name" name="companyName" defaultValue={settings.companyName} required />
            <TextField label="Legal name" name="legalName" defaultValue={settings.legalName} />
          </div>
          <TextField label="Tagline" name="tagline" defaultValue={settings.tagline} />
          <TextAreaField label="Description" name="description" defaultValue={settings.description} rows={3} />
        </section>

        <section className="space-y-4 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Branding</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <MediaPicker label="Logo" name="logo" defaultUrl={settings.logo} media={media} folder="brand" />
            <MediaPicker label="Dark-mode logo" name="darkLogo" defaultUrl={settings.darkLogo} media={media} folder="brand" />
            <MediaPicker label="Favicon" name="favicon" defaultUrl={settings.favicon} media={media} folder="brand" />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Primary email" name="email_primary" type="email" defaultValue={settings.email.primary} required />
            <TextField label="Secondary email" name="email_secondary" type="email" defaultValue={settings.email.secondary} />
            <TextField label="Primary phone" name="phone_primary" defaultValue={settings.phone.primary} />
            <TextField label="Secondary phone" name="phone_secondary" defaultValue={settings.phone.secondary} />
          </div>
          <TextAreaField label="Address" name="address" defaultValue={settings.address} rows={2} />
          <TextField label="Map URL" name="mapUrl" type="url" defaultValue={settings.mapUrl} />
        </section>

        <section className="space-y-4 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Social links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Facebook" name="social_facebook" type="url" defaultValue={settings.social.facebook} />
            <TextField label="LinkedIn" name="social_linkedin" type="url" defaultValue={settings.social.linkedin} />
            <TextField label="Instagram" name="social_instagram" type="url" defaultValue={settings.social.instagram} />
            <TextField label="YouTube" name="social_youtube" type="url" defaultValue={settings.social.youtube} />
            <TextField label="WhatsApp" name="social_whatsapp" type="url" defaultValue={settings.social.whatsapp} />
          </div>
        </section>

        <section className="space-y-4 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">SEO</h2>
          <TextField label="Default title" name="seo_title" defaultValue={settings.seo.title} />
          <TextAreaField label="Default description" name="seo_description" defaultValue={settings.seo.description} rows={3} />
          <MediaPicker
            label="Default social share image"
            name="seo_ogImage"
            defaultUrl={settings.seo.ogImage}
            media={media}
            folder="brand"
          />
        </section>

        <section className="space-y-4 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Footer</h2>
          <TextAreaField label="About text" name="footer_about" defaultValue={settings.footer.about} rows={3} />
          <TextField label="Copyright line" name="footer_copyright" defaultValue={settings.footer.copyright} />
        </section>

        <section className="space-y-4 rounded-lg border bg-card p-4">
          <h2 className="text-sm font-semibold">Design</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Primary color" name="design_primary" defaultValue={settings.design.primary} hint="CSS color value, e.g. #2563eb or a token name." />
            <TextField label="Border radius" name="design_radius" defaultValue={settings.design.radius} hint="CSS value, e.g. 0.5rem." />
          </div>
        </section>
      </EntityForm>
    </div>
  );
}