import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border/80 bg-card/40 px-8 py-14 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      <h2 className="mt-5 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
      {cta ? (
        <Link
          href={cta.href}
          className={cn(buttonVariants({ variant: "outline", className: "mt-6" }))}
        >
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}