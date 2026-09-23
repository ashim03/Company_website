import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { RevealText } from "@/components/site/reveal-text";
import { SplitHeading } from "@/components/site/split-heading";

export function Section({
  className,
  containerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  containerClassName?: string;
}) {
  return (
    <section className={cn("scroll-mt-24 overflow-x-clip py-20 md:py-28", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  splitAccent = false,
}: {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  align?: "center" | "left";
  className?: string;
  /** Render the title as a two-cluster lateral slide (lead + accent). */
  splitAccent?: boolean;
}) {
  if (!eyebrow && !title && !description) return null;
  return (
    <Reveal
      className={cn(
        "mb-12 flex max-w-3xl flex-col gap-4 md:mb-16",
        align === "center" && "mx-auto items-center text-center",
        className
      )}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      {title ? (
        splitAccent ? (
          <SplitHeading
            text={title}
            className="text-title font-semibold text-foreground"
          />
        ) : (
          <RevealText
            text={title}
            className="text-title font-semibold text-foreground"
          />
        )
      ) : null}
      {description ? (
        <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}