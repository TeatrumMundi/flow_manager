import type { ChangeEvent } from "react";

export interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  step?: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function FormInput({
  label,
  name,
  type = "text",
  step,
  value,
  onChange,
}: FormInputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      />
    </div>
  );
}
