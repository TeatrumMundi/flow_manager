interface ProjectStatusBadgeProps {
  status: string;
  className?: string;
}

export function ProjectStatusBadge({
  status,
  className,
}: ProjectStatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case "Aktywny":
        return "bg-green-100 text-green-800";
      case "Wstrzymany":
        return "bg-purple-100 text-purple-800";
      case "Zakończony":
        return "bg-blue-100 text-blue-800";
      case "Zarchiwizowany":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-sm text-center ${getStatusClasses()} ${className || ""}`}
    >
      {status}
    </span>
  );
}
