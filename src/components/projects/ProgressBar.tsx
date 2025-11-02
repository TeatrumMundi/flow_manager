interface ProgressBarProps {
    progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    const getProgressColor = () => {
        if (progress < 50) return "bg-yellow-500";
        if (progress < 100) return "bg-blue-500";
        return "bg-green-500";
    };

    return (
        <div className="w-full bg-gray-200 rounded-full h-4">
            <div
                className={`h-4 rounded-full ${getProgressColor()} flex items-center justify-center`}
                style={{ width: `${progress}%` }}
            >
        <span className="text-xs font-medium text-white px-2">
          {progress}%
        </span>
            </div>
        </div>
    );
}