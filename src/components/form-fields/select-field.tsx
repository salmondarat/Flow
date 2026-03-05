import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface SelectFieldProps {
  field: {
    id: string;
    key: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  };
  value: unknown;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function SelectField({ field, value, onChange, error, disabled }: SelectFieldProps) {
  const options = field.options || [];

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={(value as string) || ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger aria-invalid={!!error}>
          <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
