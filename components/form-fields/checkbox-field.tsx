import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface CheckboxFieldProps {
  field: {
    id: string;
    key: string;
    type: string;
    label: string;
    required: boolean;
  };
  value: unknown;
  onChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export function CheckboxField({ field, value, onChange, error, disabled }: CheckboxFieldProps) {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={field.id}
        checked={(value as boolean) || false}
        onCheckedChange={(checked) => onChange(checked === true)}
        disabled={disabled}
        aria-invalid={!!error}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={field.id}
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
