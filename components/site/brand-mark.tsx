import Image from "next/image";
import { cn } from "@/lib/utils";

/** Transparent vector version of the company monogram, crisp at every size. */
export function BrandMark({ className, preload = false }: { className?: string; preload?: boolean }) {
  return (
    <span className={cn("brand-mark relative block aspect-[555/378] w-14 shrink-0 overflow-hidden", className)}>
      <Image
        src="/codastra-mark.svg"
        alt=""
        width={555}
        height={378}
        preload={preload}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
