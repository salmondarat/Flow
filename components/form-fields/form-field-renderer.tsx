import type { FormField } from "@/types/form-config";
import { TextField } from "./text-field";
import { TextareaField } from "./textarea-field";
import { SelectField } from "./select-field";
import { CheckboxField } from "./checkbox-field";
import { NumberField } from "./number-field";
import { FileField } from "./file-field";

export interface FieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
}

const fieldComponents = {
  text: TextField,
  textarea: TextareaField,
  select: SelectField,
  checkbox: CheckboxField,
  number: NumberField,
  file: FileField,
};

export function FormFieldRenderer({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const Component = fieldComponents[field.type];

  if (!Component) {
    console.warn(`Unknown field type: ${field.type}`);
    return null;
  }

  return (
    <Component field={field} value={value} onChange={onChange} error={error} disabled={disabled} />
  );
}
