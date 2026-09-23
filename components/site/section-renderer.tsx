import { HeroSection } from "@/components/site/sections/hero";
import { ClientsSection } from "@/components/site/sections/clients";
import { IntroSection } from "@/components/site/sections/intro";
import { ServicesSection } from "@/components/site/sections/services";
import { ProductsSection } from "@/components/site/sections/products";
import { ProjectsSection } from "@/components/site/sections/projects";
import { ProcessSection } from "@/components/site/sections/process";
import { TestimonialsSection } from "@/components/site/sections/testimonials";
import { TeamSection } from "@/components/site/sections/team";
import { FaqsSection } from "@/components/site/sections/faqs";
import { CtaSection } from "@/components/site/sections/cta";
import { StatsSection } from "@/components/site/sections/stats";
import { BlogSection } from "@/components/site/sections/blog";
import { WhySection } from "@/components/site/sections/why";
import { ContentSection } from "@/components/site/sections/content";
import { PromoSection } from "@/components/site/sections/promo";
import { ClassesSection } from "@/components/site/sections/classes";
import { JourneySection } from "@/components/site/sections/journey";
import { SECTION_TYPES } from "@/lib/constants";
import type { SectionRendererProps } from "@/lib/types";

export function SectionRenderer({
  sectionType,
  title,
  subtitle,
  content,
  compactHero = false,
}: SectionRendererProps & { compactHero?: boolean }) {
  if (!sectionType || !(SECTION_TYPES as readonly string[]).includes(sectionType)) {
    return null;
  }

  const merged = { ...content };
  if (title && !merged.title) merged.title = title;
  if (subtitle && !merged.subtitle) merged.subtitle = subtitle;

  switch (sectionType) {
    case "hero":
      return <HeroSection content={merged} compact={compactHero} />;
    case "clients":
      return <ClientsSection content={merged} />;
    case "intro":
      return <IntroSection content={merged} />;
    case "services":
      return <ServicesSection content={merged} />;
    case "products":
      return <ProductsSection content={merged} />;
    case "projects":
      return <ProjectsSection content={merged} />;
    case "process":
      return <ProcessSection content={merged} />;
    case "testimonials":
      return <TestimonialsSection content={merged} />;
    case "team":
      return <TeamSection content={merged} />;
    case "faqs":
      return <FaqsSection content={merged} />;
    case "cta":
      return <CtaSection content={merged} />;
    case "stats":
      return <StatsSection content={merged} />;
    case "blog":
      return <BlogSection content={merged} />;
    case "why":
      return <WhySection content={merged} />;
    case "content":
      return <ContentSection content={merged} />;
    case "promo":
      return <PromoSection content={merged} />;
    case "classes":
      return <ClassesSection content={merged} />;
    case "journey":
      return <JourneySection content={merged} />;
    default:
      return null;
  }
}