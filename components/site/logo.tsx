import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  logo,
  name = "CodAstra Labs",
  className,
  imageClassName,
  priority = false,
}: {
  logo?: string | null;
  name?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label={`${name} — home`}
    >
      {logo ? (
        <Image
          src={logo}
          alt={`${name} logo`}
          width={38}
          height={38}
          priority={priority}
          className={cn(
            "h-9 w-9 rounded-lg object-contain ring-1 ring-border",
            imageClassName
          )}
        />
      ) : (
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-400 text-sm font-bold tracking-tight text-white shadow-[0_8px_24px_-8px_rgba(59,130,246,0.7)] transition-transform duration-300 group-hover:scale-105">
          <span className="text-stroke absolute -bottom-1 left-0 text-[2rem] leading-none opacity-30" aria-hidden="true">
            C
          </span>
          CA
        </span>
      )}
      <span className="text-[1.05rem] font-semibold tracking-[-0.01em]">
        {name.split(" ")[0]}
        <span className="text-gradient"> Labs</span>
      </span>
    </Link>
  );
}