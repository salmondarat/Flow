import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface TextareaFieldProps {
  field: {
    id: string;
    key: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
  };
  value: unknown;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function TextareaField({ field, value, onChange, error, disabled }: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={field.id}
        placeholder={field.placeholder}
        value={(value as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
      />
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
