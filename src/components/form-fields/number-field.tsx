import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface NumberFieldProps {
  field: {
    id: string;
    key: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    validation?: {
      min?: number;
      max?: number;
    };
  };
  value: unknown;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

export function NumberField({ field, value, onChange, error, disabled }: NumberFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={field.id}
        type="number"
        placeholder={field.placeholder}
        value={(value as number) || ""}
        onChange={(e) => {
          const numValue = parseFloat(e.target.value);
          onChange(isNaN(numValue) ? 0 : numValue);
        }}
        disabled={disabled}
        min={field.validation?.min}
        max={field.validation?.max}
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
