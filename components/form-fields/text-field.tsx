import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TextFieldProps {
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

export function TextField({ field, value, onChange, error, disabled }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={field.id}
        type="text"
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
