import { TextField, TextAreaField, SwitchField } from "@/components/admin/fields";

export type FaqDefaults = {
  question?: string;
  answer?: string;
  category?: string;
  sortOrder?: number;
  isVisible?: boolean;
};

export function FaqFields({ defaults = {} }: { defaults?: FaqDefaults }) {
  return (
    <>
      <TextField label="Question" name="question" defaultValue={defaults.question} required />
      <TextAreaField label="Answer" name="answer" defaultValue={defaults.answer} rows={6} required hint="Markdown supported." />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Category"
          name="category"
          defaultValue={defaults.category}
          hint="e.g. General, Billing, Delivery."
        />
        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={defaults.sortOrder != null ? String(defaults.sortOrder) : "0"}
        />
      </div>
      <SwitchField
        label="Visible on site"
        name="isVisible"
        defaultChecked={defaults.isVisible ?? true}
      />
    </>
  );
}