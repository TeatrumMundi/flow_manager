import type React from "react";

export interface StatusBadgeProps {
  status: string;
  type?: "project" | "expense" | "vacation" | "user" | string;
  className?: string;
}

const statusStyles: Record<string, Record<string, string>> = {
  project: {
    Aktywny: "bg-green-100 text-green-800",
    Wstrzymany: "bg-purple-100 text-purple-800",
    Zakończony: "bg-blue-100 text-blue-800",
    Zarchiwizowany: "bg-gray-200 text-gray-700",
    default: "bg-gray-100 text-gray-700",
  },
  expense: {
    Zaakceptowany: "bg-green-100 text-green-800",
    Odrzucony: "bg-red-100 text-red-800",
    Oczekujący: "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-700",
  },
  vacation: {
    Zaakceptowany: "bg-green-100 text-green-800",
    Odrzucony: "bg-red-100 text-red-800",
    Oczekujący: "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-700",
  },
  user: {
    Aktywny: "bg-green-100 text-green-800",
    Nieaktywny: "bg-gray-200 text-gray-700",
    default: "bg-gray-100 text-gray-700",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "project",
  className = "",
}) => {
  const styleMap = statusStyles[type] || statusStyles.project;
  const style = styleMap[status] || styleMap.default;

  return (
    <span
      className={`inline-block px-3 py-1 w-30 text-sm font-medium rounded-sm text-center ${style} ${className}`}
    >
      {status}
    </span>
  );
};
