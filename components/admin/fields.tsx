import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

function FieldShell({
  htmlFor,
  label,
  hint,
  required,
  className,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required ? <span className="ml-0.5 text-destructive">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  label,
  name,
  defaultValue = "",
  placeholder,
  hint,
  required,
  type = "text",
  className,
  min,
  max,
}: FieldProps & {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
}) {
  return (
    <FieldShell htmlFor={name} label={label} hint={hint} required={required} className={className}>
      <Input
        id={name}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        max={max}
        step={type === "number" ? 1 : undefined}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue = "",
  placeholder,
  hint,
  required,
  rows = 5,
  className,
}: FieldProps & {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <FieldShell htmlFor={name} label={label} hint={hint} required={required} className={className}>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
      />
    </FieldShell>
  );
}

export function ListField({
  label,
  name,
  defaultValue = [],
  hint,
  className,
}: FieldProps & {
  name: string;
  defaultValue?: string[];
  hint?: string;
}) {
  return (
    <FieldShell
      htmlFor={name}
      label={label}
      required={false}
      hint={hint ?? "One item per line."}
      className={className}
    >
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue.join("\n")}
        rows={4}
        className="font-mono text-xs"
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue = "",
  hint,
  required,
  className,
}: FieldProps & {
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <FieldShell htmlFor={name} label={label} hint={hint} required={required} className={className}>
      <NativeSelect name={name} defaultValue={defaultValue} options={options} />
    </FieldShell>
  );
}

export function NativeSelect({
  name,
  defaultValue = "",
  options,
  className,
}: {
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <select
      id={name}
      name={name}
      defaultValue={defaultValue}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function SwitchField({
  label,
  name,
  defaultChecked = false,
  hint,
  className,
}: FieldProps & {
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3 rounded-lg border p-3", className)}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <Switch name={name} defaultChecked={defaultChecked} label={label} showLabel={false} />
    </div>
  );
}

export function FormError({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {error}
    </div>
  );
}
