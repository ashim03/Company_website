import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs({
  items,
  className,
}: {
  items: { name: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-sm text-muted-foreground", className)}
    >
      <Link href="/" className="transition-colors hover:text-foreground">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.name} className="flex items-center gap-1.5">
          <ChevronRight className="size-3.5" />
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-foreground">
              {item.name}
            </Link>
          ) : (
            <span aria-current="page" className="text-foreground">
              {item.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}