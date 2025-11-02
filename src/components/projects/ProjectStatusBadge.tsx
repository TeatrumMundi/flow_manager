interface ProjectStatusBadgeProps {
    status: string;
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
    const getStatusClasses = () => {
        switch (status) {
            case "Aktywny":
                return "bg-green-100 text-green-800";
            case "W toku":
                return "bg-yellow-100 text-yellow-800";
            case "Zakończony":
                return "bg-blue-100 text-blue-800";
            case "Zarchiwizowany":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusClasses()}`}
        >
      {status}
    </span>
    );
}