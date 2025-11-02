import type { ChangeEvent, InputHTMLAttributes } from "react";

export interface CustomInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  name: string;
  type?: string;
  step?: string;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  hideLabel?: boolean;
  error?: string;
  helperText?: string;
}

export function CustomInput({
  label,
  name,
  type = "text",
  step,
  value,
  onChange,
  required,
  hideLabel = false,
  error,
  helperText,
  className = "",
  ...props
}: CustomInputProps) {
  // Set autocomplete based on input type if not provided
  const autoComplete =
    props.autoComplete ||
    (type === "email"
      ? "email"
      : type === "password"
        ? "current-password"
        : "on");

  return (
    <div>
      {label && !hideLabel && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        step={step}
        value={value}
        onChange={onChange as (event: ChangeEvent<HTMLInputElement>) => void}
        required={required}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        } text-gray-800 ${className}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error ? `${name}-error` : helperText ? `${name}-helper` : undefined
        }
        {...props}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${name}-helper`} className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

// Backward compatibility alias
export const FormInput = CustomInput;
