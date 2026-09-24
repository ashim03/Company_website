import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Aurora } from "@/components/site/aurora";
import { NetworkCanvas } from "@/components/site/network-canvas";
import { SiteWidgets } from "@/components/site/site-widgets";
import { getSettings } from "@/lib/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const whatsappNumber =
    settings.social.whatsapp?.match(/(?:wa\.me\/|api\.whatsapp\.com\/send\?phone=)(\d+)/)?.[1] ||
    settings.phone.primary;

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip">
      <Aurora className="fixed inset-0 -z-20" chips scan />
      <NetworkCanvas />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="relative flex-1">
        {children}
      </main>
      <Footer />
      <SiteWidgets
        whatsappUrl={settings.social.whatsapp || ""}
        whatsappNumber={whatsappNumber}
        phone={settings.phone.primary}
        email={settings.email.primary}
      />
    </div>
  );
}
