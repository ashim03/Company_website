import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/site/brand-mark";

export function Logo({
  logo,
  name = "CodAstra Labs",
  className,
  imageClassName,
  priority = false,
  variant = "header",
  darkLogo,
}: {
  logo?: string | null;
  name?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: "header" | "footer";
  darkLogo?: string | null;
}) {
  const mark = (source?: string | null) => !source || source === "/codastralabs-logo.jpeg"
    ? <BrandMark className={cn(variant === "footer" ? "w-16" : "w-12", imageClassName)} preload={priority} />
    : <Image src={source} alt="" width={64} height={44} preload={priority} className={cn("h-11 w-14 object-contain", imageClassName)} />;
  return (
    <Link
      href="/"
      className={cn("group inline-flex w-fit shrink-0 items-center gap-3 rounded-md", className)}
      aria-label={`${name} — home`}
    >
      {variant === "footer" ? mark(darkLogo || logo) : darkLogo && darkLogo !== logo ? <><span className="dark:hidden">{mark(logo)}</span><span className="hidden dark:block">{mark(darkLogo)}</span></> : mark(logo)}
      <span className={cn("flex flex-col leading-none text-foreground", variant === "footer" ? "gap-2 text-[1.7rem]" : "gap-1.5 text-[1.2rem]")}>
        <span className="font-semibold tracking-[-0.04em]">
        {name.replace(/\s*labs\s*$/i, "")}
        </span>
        <span className="pl-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.36em] text-primary">Labs</span>
      </span>
    </Link>
  );
}
