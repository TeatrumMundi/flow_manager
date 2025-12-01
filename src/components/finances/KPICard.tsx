interface KPICardProps {
  label: string;
  value: string;
  unit?: string;
}

export function KPICard({ label, value, unit }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center h-28 border border-gray-100">
      <span className="text-gray-500 font-medium mb-1">{label}</span>
      <div className="text-2xl font-bold text-gray-800">
        {value} {unit && <span className="text-lg font-normal">{unit}</span>}
      </div>
    </div>
  );
}
