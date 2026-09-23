import Image from "next/image";
import { cn } from "@/lib/utils";

/** Display the original monogram without its surrounding wordmark or tile. */
export function BrandMark({ className, preload = false }: { className?: string; preload?: boolean }) {
  return (
    <span className={cn("brand-mark relative block aspect-[555/378] w-14 shrink-0 overflow-hidden", className)}>
      <Image
        src="/codastralabs-logo.jpeg"
        alt="CodAstra Labs"
        width={1254}
        height={1254}
        preload={preload}
        sizes="(max-width: 640px) 160px, 280px"
        className="absolute max-w-none"
        style={{ width: "225.95%", height: "auto", left: "-61.26%", top: "-78.04%" }}
      />
    </span>
  );
}
