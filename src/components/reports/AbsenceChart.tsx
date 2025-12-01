interface AbsenceData {
  present: number;
  vacation: number;
  sick: number;
}

export function AbsenceChart({ data }: { data: AbsenceData }) {
  // Obliczamy stopnie dla wykresu kołowego
  const presentDeg = (data.present / 100) * 360;
  const vacationDeg = (data.vacation / 100) * 360;

  // Funkcja pomocnicza do obliczania pozycji etykiety (x, y) na podstawie kąta
  const getLabelPosition = (
    startPercentage: number,
    slicePercentage: number,
  ) => {
    // Środek wycinka (w procentach całego koła)
    const midPercentage = startPercentage + slicePercentage / 2;
    // Zamiana na kąt w stopniach
    const angleDeg = (midPercentage / 100) * 360;
    // Zamiana na radiany (odejmujemy 90 stopni, bo CSS 0deg jest na górze, a w matematyce 0 to prawa strona)
    const angleRad = (angleDeg - 90) * (Math.PI / 180);

    const radius = 35; // Promień, na którym umieszczamy tekst (35% od środka)

    // Obliczamy współrzędne (50% to środek kontenera)
    const x = 50 + radius * Math.cos(angleRad);
    const y = 50 + radius * Math.sin(angleRad);

    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Absencja</h3>

      <div className="flex grow items-center justify-between">
        {/* Wykres Kołowy CSS */}
        <div
          className="w-32 h-32 rounded-full relative shadow-inner shrink-0"
          style={{
            background: `conic-gradient(
                    #3b82f6 0deg ${presentDeg}deg, 
                    #60a5fa ${presentDeg}deg ${presentDeg + vacationDeg}deg, 
                    #93c5fd ${presentDeg + vacationDeg}deg 360deg
                )`,
          }}
        >
          {/* Etykieta: Obecność (niebieski) */}
          {data.present > 5 && (
            <div
              className="absolute text-white font-bold text-xs drop-shadow-md -translate-x-1/2 -translate-y-1/2"
              style={getLabelPosition(0, data.present)}
            >
              {data.present}%
            </div>
          )}

          {/* Etykieta: Urlop (jasny niebieski) */}
          {data.vacation > 5 && (
            <div
              className="absolute text-white font-bold text-xs drop-shadow-md -translate-x-1/2 -translate-y-1/2"
              style={getLabelPosition(data.present, data.vacation)}
            >
              {data.vacation}%
            </div>
          )}

          {/* Etykieta: Choroba (najjaśniejszy) */}
          {data.sick > 5 && (
            <div
              className="absolute text-white font-bold text-xs drop-shadow-md -translate-x-1/2 -translate-y-1/2"
              style={getLabelPosition(data.present + data.vacation, data.sick)}
            >
              {data.sick}%
            </div>
          )}
        </div>

        {/* Legenda */}
        <div className="flex flex-col gap-2 text-sm text-gray-600 pl-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Obecność</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>Urlop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-300"></div>
            <span>Choroba</span>
          </div>
        </div>
      </div>
    </div>
  );
}
