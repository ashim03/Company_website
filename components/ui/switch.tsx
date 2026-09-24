"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  defaultChecked,
  name,
  disabled,
  label,
  showLabel = true,
  className,
}: {
  checked?: boolean;
  onCheckedChange?: (value: boolean) => void;
  defaultChecked?: boolean;
  name?: string;
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
  className?: string;
}) {
  const [inner, setInner] = React.useState(Boolean(defaultChecked));
  const isControlled = checked !== undefined && onCheckedChange !== undefined;
  const on = isControlled ? Boolean(checked) : inner;

  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className
      )}
    >
      <input
        type="checkbox"
        role="switch"
        aria-checked={on}
        aria-label={label}
        name={name}
        checked={isControlled ? on : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={disabled}
        onChange={
          isControlled
            ? (e) => onCheckedChange(e.target.checked)
            : (e) => setInner(e.target.checked)
        }
        className="peer sr-only"
      />
      <span
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
          on ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform",
            on ? "translate-x-5" : "translate-x-0"
          )}
        />
      </span>
      {label && showLabel ? <span className="text-sm font-medium">{label}</span> : null}
    </label>
  );
}
