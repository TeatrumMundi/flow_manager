import { FaCheck, FaTimes } from "react-icons/fa";

interface OvertimeBadgeProps {
    isOvertime: boolean;
}

export function OvertimeBadge({ isOvertime }: OvertimeBadgeProps) {
    if (isOvertime) {
        return (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                <FaCheck size={14} />
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600">
            <FaTimes size={14} />
        </div>
    );
}