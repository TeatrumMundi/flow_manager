interface BarData {
    name: string;
    profitability: number;
}

export function BarChart({ data }: { data: BarData[] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <h3 className="text-md font-bold text-gray-800 mb-4">Rentowność projektów</h3>
            <div className="flex-grow flex items-end justify-around gap-2 pb-2 relative">
                {/* Linie siatki tła (uproszczone) */}
                <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pointer-events-none pb-6 z-0">
                    <span>100%</span>
                    <span>50%</span>
                    <span>0%</span>
                </div>

                {data.map((item) => (
                    <div key={item.name} className="flex flex-col items-center w-1/4 h-full justify-end z-10 group relative">
                        <div
                            className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all duration-300"
                            style={{ height: `${item.profitability}%` }}
                        ></div>
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none">
                            {item.profitability}%
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-around text-xs text-gray-500 mt-2 text-center">
                {data.map((item) => (
                    <span key={item.name} className="w-1/4 truncate px-1" title={item.name}>{item.name}</span>
                ))}
            </div>
        </div>
    );
}