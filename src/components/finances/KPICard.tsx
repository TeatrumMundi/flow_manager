interface KPICardProps {
  label: string;
  value: string;
  subValue?: string; // Np. nazwa kategorii
}

export function KPICard({ label, value, subValue }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center h-28 border border-gray-100 text-center">
      <span className="text-sm text-gray-500 font-medium mb-1">{label}</span>

      {subValue && (
        <span className="text-sm font-bold text-gray-800 mb-1 truncate w-full px-2">
          {subValue}
        </span>
      )}

      <div
        className={`font-bold text-gray-900 ${subValue ? "text-xl" : "text-2xl"}`}
      >
        {value}
      </div>
    </div>
  );
}
