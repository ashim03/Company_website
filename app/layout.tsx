import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { defaultSiteSettings } from "@/lib/default-content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const settings = defaultSiteSettings;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: settings.seo.title,
    template: `%s | ${settings.companyName}`,
  },
  description: settings.seo.description,
  icons: {
    icon: settings.favicon || "/codastralabs-logo.jpeg",
  },
  openGraph: {
    type: "website",
    siteName: settings.companyName,
    title: settings.seo.title,
    description: settings.seo.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem('codastra-theme');var d=t?t==='dark':true;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

const jsInit = "document.documentElement.classList.add('js');";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsInit }} />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}