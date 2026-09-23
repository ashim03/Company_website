import { SocialHub } from "@/components/site/visuals/social-hub";
import { CreativeDesk } from "@/components/site/visuals/creative-desk";
import { DevFlow } from "@/components/site/visuals/dev-flow";

/**
 * Picks the page-specific animated visual for a service detail page based
 * on the service's real icon/slug — marketing → social ecosystem, design →
 * creative workspace, everything technical (web, apps, automation, cloud,
 * security) → the development flow.
 */
export function ServiceStage({
  icon,
  slug,
  className,
}: {
  icon?: string | null;
  slug: string;
  className?: string;
}) {
  const key = (icon ?? "").toLowerCase();

  if (key === "trending-up" || (icon == null && slug === "digital-marketing-branding")) {
    return <SocialHub className={className} />;
  }
  if (key === "paintbrush") {
    return <CreativeDesk className={className} />;
  }
  return <DevFlow className={className} />;
}