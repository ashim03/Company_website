import { Globe, Layout, Smartphone, Workflow, Cloud, Shield, TrendingUp, Database, Code2, Bot, Palette, Rocket } from "lucide-react";
import type { ServiceIconKey } from "@/lib/constants";

const iconMap: Record<ServiceIconKey, typeof Globe> = {
  globe: Globe,
  layout: Layout,
  smartphone: Smartphone,
  workflow: Workflow,
  cloud: Cloud,
  shield: Shield,
  "trending-up": TrendingUp,
  database: Database,
  code: Code2,
  bot: Bot,
  paintbrush: Palette,
  rocket: Rocket,
};

export function ServiceIcon({
  icon,
  className,
  fallback = "code",
}: {
  icon?: string | null;
  className?: string;
  fallback?: ServiceIconKey;
}) {
  const key = (icon as ServiceIconKey) ?? fallback;
  const Icon = iconMap[key] ?? iconMap[fallback];
  return <Icon className={className} />;
}