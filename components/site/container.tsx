import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "narrow" | "wide";
}) {
  return (
    <div
      className={cn(
        "container-site",
        size === "narrow" && "max-w-3xl",
        size === "wide" && "max-w-[90rem]",
        className
      )}
      {...props}
    />
  );
}