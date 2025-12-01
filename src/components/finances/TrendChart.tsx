interface DataPoint {
    month: string;
    profit: number;
}

export function TrendChart({ data }: { data: DataPoint[] }) {
    // Prosta wizualizacja linii SVG
    const maxVal = 35; // Skala Y
    const points = data
        .map(
            (d, i) =>
                `${i * 25},${100 - (d.profit / maxVal) * 100}`
        )
        .join(" ");

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <h3 className="text-md font-bold text-gray-800 mb-4">Analiza trendów (Zyski w %)</h3>
            <div className="flex-grow relative flex items-end px-2 pb-6">
                {/* Linie siatki tła */}
                <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pointer-events-none pb-6 pr-2">
                    <span>30</span>
                    <span>20</span>
                    <span>10</span>
                </div>

                {/* Wykres SVG */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3"
                        points={points}
                        vectorEffect="non-scaling-stroke"
                    />
                    {data.map((d, i) => (
                        <circle
                            key={d.month}
                            cx={i * 25}
                            cy={100 - (d.profit / maxVal) * 100}
                            r="4" // Stały rozmiar punktu
                            fill="#2563eb"
                            stroke="white"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </svg>
            </div>
            {/* Oś X */}
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
                {data.map(d => <span key={d.month}>{d.month}</span>)}
            </div>
        </div>
    );
}