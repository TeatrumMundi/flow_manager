"use client";

interface AbsenceData {
  present: number;
  vacation: number;
  sick: number;
}

export function AbsenceChart({ data }: { data: AbsenceData }) {
  // Obliczamy stopnie dla wykresu kołowego
  const presentDeg = (data.present / 100) * 360;
  const vacationDeg = (data.vacation / 100) * 360;

  const getLabelPosition = (
      startPercentage: number,
      slicePercentage: number,
  ) => {
    const midPercentage = startPercentage + slicePercentage / 2;
    const angleDeg = (midPercentage / 100) * 360;
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const radius = 35;
    const x = 50 + radius * Math.cos(angleRad);
    const y = 50 + radius * Math.sin(angleRad);
    return { top: `${y}%`, left: `${x}%` };
  };

  // Jeśli brak danych, wyświetl komunikat
  if (data.present === 0 && data.vacation === 0 && data.sick === 0) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col justify-center items-center">
          <h3 className="text-lg font-bold text-gray-800 mb-4 self-start">Absencja</h3>
          <p className="text-gray-400">Brak danych w wybranym okresie</p>
        </div>
    );
  }

  return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Absencja</h3>

        <div className="flex grow items-center justify-between">
          {/* Wykres Kołowy z nowymi kolorami */}
          <div
              className="w-32 h-32 rounded-full relative shadow-inner shrink-0"
              style={{
                background: `conic-gradient(
                    #22c55e 0deg ${presentDeg}deg, 
                    #eab308 ${presentDeg}deg ${presentDeg + vacationDeg}deg, 
                    #f97316 ${presentDeg + vacationDeg}deg 360deg
                )`,
              }}
          >
            {data.present > 5 && (
                <div
                    className="absolute text-white font-bold text-xs drop-shadow-md -translate-x-1/2 -translate-y-1/2"
                    style={getLabelPosition(0, data.present)}
                >
                  {data.present}%
                </div>
            )}

            {data.vacation > 5 && (
                <div
                    className="absolute text-white font-bold text-xs drop-shadow-md -translate-x-1/2 -translate-y-1/2"
                    style={getLabelPosition(data.present, data.vacation)}
                >
                  {data.vacation}%
                </div>
            )}

            {data.sick > 5 && (
                <div
                    className="absolute text-white font-bold text-xs drop-shadow-md -translate-x-1/2 -translate-y-1/2"
                    style={getLabelPosition(data.present + data.vacation, data.sick)}
                >
                  {data.sick}%
                </div>
            )}
          </div>

          {/* Legenda z nowymi kolorami */}
          <div className="flex flex-col gap-2 text-sm text-gray-600 pl-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Obecność</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Urlop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Choroba</span>
            </div>
          </div>
        </div>
      </div>
  );
}