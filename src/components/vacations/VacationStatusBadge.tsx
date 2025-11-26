interface VacationStatusBadgeProps {
  status: string;
}

export function VacationStatusBadge({ status }: VacationStatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case "Zaakceptowany":
        return "bg-green-100 text-green-800";
      case "Oczekujący":
        return "bg-yellow-100 text-yellow-800";
      case "Odrzucony":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-sm ${getStatusClasses()}`}
    >
      {status}
    </span>
  );
}
