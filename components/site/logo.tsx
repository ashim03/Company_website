import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ logo, darkLogo, name = "CodAstra Labs", className, imageClassName, priority = false, variant = "header" }: {
  logo?: string | null; darkLogo?: string | null; name?: string; className?: string; imageClassName?: string; priority?: boolean; variant?: "header" | "footer";
}) {
  const official = !logo || ["/codastralabs-logo.jpeg", "/codastra-official-logo.png"].includes(logo);
  const source = official ? "/codastra-official-logo.png" : logo;
  const renderImage = (src: string, extra = "") => <Image src={src} alt="" width={1774} height={887} preload={priority} className={cn("h-full w-full object-contain", imageClassName, extra)} />;
  return <Link href="/" aria-label={`${name} — home`} className={cn("relative inline-block shrink-0 rounded-md", variant === "footer" ? "h-32 w-64" : "h-20 w-40 sm:h-22 sm:w-44", className)}>
    {official ? <>
      {renderImage(source)}
      <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0 [clip-path:inset(67%_0_0_0)]", variant === "footer" ? "block" : "hidden dark:block")}>{renderImage(source, "brightness-0 invert")}</span>
    </> : variant === "footer" ? renderImage(darkLogo || source) : <><span className="dark:hidden">{renderImage(source)}</span><span className="hidden dark:block">{renderImage(darkLogo || source)}</span></>}
  </Link>;
}
