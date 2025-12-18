"use client";

interface WorkHoursData {
    totalHours: number;
}

interface WorkHoursChartProps {
    data: WorkHoursData;
    projectName: string;
    dateFrom: string;
    dateTo: string;
}

export function WorkHoursChart({ data, projectName, dateFrom, dateTo }: WorkHoursChartProps) {
    // Formatowanie daty (np. 2025-05 -> maj 2025)
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(date);
    };

    const formattedDateRange = `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;

    const isZero = data.totalHours === 0;

    if (isZero) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-6 self-start">Liczba przepracowanych godzin</h3>
                <div className="w-40 h-40 rounded-full border-4 border-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Brak danych</span>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-sm font-semibold text-gray-700">{projectName}</p>
                    <p className="text-xs text-gray-500 mt-1">{formattedDateRange}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Liczba przepracowanych godzin</h3>

            <div className="flex-grow flex flex-col items-center justify-center">

                {/* Nazwa Projektu nad wykresem */}
                <p className="text-sm font-semibold text-gray-700 mb-4 text-center px-4 truncate w-full" title={projectName}>
                    {projectName}
                </p>

                {/* Wykres Donut */}
                <div
                    className="w-40 h-40 rounded-full relative shrink-0"
                    style={{
                        background: `conic-gradient(
                    #3b82f6 0deg 360deg
                )`
                    }}
                >
                    {/* Biały środek */}
                    <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-3xl font-bold text-gray-800">
                    {Math.round(data.totalHours)}
                </span>
                        <span className="text-gray-500 text-sm">godz.</span>
                    </div>
                </div>

                {/* Zakres dat pod wykresem */}
                <p className="text-xs text-gray-500 mt-6 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {formattedDateRange}
                </p>
            </div>
        </div>
    );
}