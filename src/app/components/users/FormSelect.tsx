import type { ChangeEvent } from "react";

export type SelectOption =
  | string
  | {
      label: string;
      value: string | number;
    };

export interface FormSelectProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  required?: boolean;
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: FormSelectProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      >
        {options.map((opt) => {
          const o = typeof opt === "string" ? { label: opt, value: opt } : opt;
          return (
            <option key={String(o.value)} value={o.value}>
              {o.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
