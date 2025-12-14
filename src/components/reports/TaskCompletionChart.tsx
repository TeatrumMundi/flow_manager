"use client";

interface TaskData {
    completed: number;
    active: number;
    archived: number;
    paused: number;
}

export function TaskCompletionChart({ data }: { data: TaskData }) {
    const total = data.completed + data.active + data.archived + data.paused;

    // Obliczamy stopnie dla każdego segmentu (conic-gradient)
    const degCompleted = (data.completed / total) * 360;
    const degActive = (data.active / total) * 360;
    const degArchived = (data.archived / total) * 360;
    const degPaused = (data.paused / total) * 360;

    const end1 = degCompleted;
    const end2 = end1 + degActive;
    const end3 = end2 + degArchived;
    // end4 to 360

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Realizacja zadań</h3>

            <div className="flex-grow flex flex-col items-center justify-center">
                {/* Wykres Donut CSS */}
                <div
                    className="w-40 h-40 rounded-full relative"
                    style={{
                        background: `conic-gradient(
                    #3b82f6 0deg ${end1}deg, 
                    #4ade80 ${end1}deg ${end2}deg, 
                    #93c5fd ${end2}deg ${end3}deg,
                    #facc15 ${end3}deg 360deg
                )`
                    }}
                >
                    {/* Biały środek dla efektu Donut */}
                    <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-inner">
                        <span className="text-gray-500 text-xs font-medium">Ukończone:</span>
                        <span className="text-3xl font-bold text-gray-800">
                    {Math.round((data.completed / total) * 100)}%
                </span>
                        <span className="text-gray-400 text-[10px]">Zadań łącznie: {total}</span>
                    </div>
                </div>

                {/* Legenda (Grid 2x2) */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8 w-full px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                        <span className="text-xs text-gray-600 font-medium">Zakończony</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-blue-300"></div>
                        <span className="text-xs text-gray-600 font-medium">Zarchiwizowany</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-green-400"></div>
                        <span className="text-xs text-gray-600 font-medium">Aktywny</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm bg-yellow-400"></div>
                        <span className="text-xs text-gray-600 font-medium">Wstrzymany</span>
                    </div>
                </div>
            </div>
        </div>
    );
}