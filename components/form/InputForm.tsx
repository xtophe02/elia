"use client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type FormInputProps = {
  name: string;
  type: string;
  label?: string;
  value?: string | number;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export default function InputForm({
  label,
  name,
  type,
  value,
  placeholder,
  defaultValue,
  onChange,
}: FormInputProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={name}>{label || name}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
