import type { Metadata } from "next";
import { getPage } from "@/lib/queries";
import { SectionRenderer } from "@/components/site/section-renderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  return {
    title: page?.metaTitle || "CodAstraLabs — Software products with operational depth.",
    description:
      page?.metaDescription ||
      "CodAstraLabs builds practical SaaS products for business operations.",
  };
}

export default async function HomePage() {
  const page = await getPage("home");
  const sections = page?.sections ?? [];

  return (
    <>
      {sections.map((section) => (
        <SectionRenderer
          key={section.id}
          sectionType={section.sectionType}
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
          settings={section.settings}
        />
      ))}
    </>
  );
}