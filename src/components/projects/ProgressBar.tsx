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
    <div className="w-full bg-gray-200 rounded-full h-4 relative">
      <div
        className={`h-4 rounded-sm ${getProgressColor()} ${progress >= 20 ? "flex items-center justify-center" : ""}`}
        style={{ width: `${progress}%` }}
      >
        {progress >= 20 && (
          <span className="text-xs font-medium text-white px-2">
            {progress}%
          </span>
        )}
      </div>
      {progress < 20 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-black px-2">
            {progress}%
          </span>
        </div>
      )}
    </div>
  );
}
