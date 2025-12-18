"use client";

interface ExecutionData {
    percentage: number;
    label: string; // np. "FlowManager" lub "wszystkie projekty"
}

export function ExecutionChart({ data }: { data: ExecutionData }) {
    // Ograniczamy pasek wizualnie do 100%, ale tekst pokazuje faktyczną wartość (może być > 100%)
    const barHeight = Math.min(data.percentage, 100);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col items-center text-center">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Wykonanie</h3>

            <div className="text-3xl font-bold text-blue-600 mb-6">
                {Math.round(data.percentage)}%
            </div>

            <div className="flex-grow w-full flex items-end justify-center pb-2">
                {/* Kontener paska */}
                <div className="w-24 h-40 bg-gray-100 rounded-md relative overflow-hidden flex items-end">
                    <div
                        className="w-full bg-blue-600 rounded-b-md transition-all duration-500"
                        style={{ height: `${barHeight}%` }}
                    ></div>
                </div>
            </div>

            <span className="text-sm text-gray-600 mt-2 truncate w-full px-2" title={data.label}>
        {data.label}
      </span>
        </div>
    );
}