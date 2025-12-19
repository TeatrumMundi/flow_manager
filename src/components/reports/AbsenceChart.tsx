"use client";
// AbsenceChart – simple conic chart showing presence vs absence.
// Pure client component; labels are only rendered for >5% slices.

interface AbsenceData {
  present: number;
  absence: number;
}

export function AbsenceChart({ data }: { data: AbsenceData }) {
  const presentDeg = (data.present / 100) * 360;

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

  if (data.present === 0 && data.absence === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col justify-center items-center text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-6 self-start">
          Absencja
        </h3>
        <div className="w-40 h-40 rounded-full border-4 border-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Brak danych</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Absencja</h3>

      <div className="grow flex flex-col items-center justify-center">
        <div
          className="w-40 h-40 rounded-full relative shadow-inner shrink-0"
          style={{
            background: `conic-gradient(
                    #22c55e 0deg ${presentDeg}deg, 
                    #eab308 ${presentDeg}deg 360deg
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

          {data.absence > 5 && (
            <div
              className="absolute text-white font-bold text-xs drop-shadow-md -translate-x-1/2 -translate-y-1/2"
              style={getLabelPosition(data.present, data.absence)}
            >
              {data.absence}%
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6 mt-8 w-full text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600">Obecność</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600">Nieobecność</span>
          </div>
        </div>
      </div>
    </div>
  );
}
