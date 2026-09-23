import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPage, getPublishedPages } from "@/lib/queries";
import { SectionRenderer } from "@/components/site/section-renderer";
import { PageHeader } from "@/components/site/page-header";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const pages = await getPublishedPages();
  return pages.map((page) => ({ slug: [page.slug] }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug[0] === "home") return {};
  const page = await getPage(slug[0]);
  if (!page) return {};
  const title = page.metaTitle || `${page.title} — CodAstra Labs`;
  return {
    title,
    description: page.metaDescription ?? page.description ?? undefined,
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const key = slug[0];
  if (key === "home") redirect("/");
  const page = await getPage(key);
  if (!page) notFound();

  const heroSections = page.sections.filter((s) => s.sectionType === "hero");
  const contentSections = page.sections.filter((s) => s.sectionType !== "hero");
  const hero = heroSections[0];

  return (
    <>
      {hero ? (
        <SectionRenderer
          key={hero.id}
          sectionType={hero.sectionType}
          title={hero.title}
          subtitle={hero.subtitle}
          content={hero.content}
          settings={hero.settings}
          compactHero
        />
      ) : (
        <PageHeader title={page.title} description={page.description} breadcrumbs={[{ name: page.title }]} splitHeading />
      )}
      {contentSections.map((section) => (
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