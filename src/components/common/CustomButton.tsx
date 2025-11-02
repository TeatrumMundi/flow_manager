import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer whitespace-nowrap";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed",
    secondary:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
