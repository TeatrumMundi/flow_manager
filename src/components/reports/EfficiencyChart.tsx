"use client";

interface DataPoint {
  label: string;
  value: number;
}

export function EfficiencyChart({ data }: { data: DataPoint[] }) {
  // Konfiguracja wykresu
  const maxY = 15; // Maksymalna wartość na osi Y
  const chartHeight = 200; // Wysokość obszaru rysowania (wirtualne jednostki)
  const chartWidth = 300; // Szerokość obszaru rysowania

  // Marginesy wewnętrzne, żeby kropki nie były ucinane
  const paddingX = 20;
  const paddingY = 20;

  // Funkcja obliczająca współrzędne X dla punktu (i = index)
  const getX = (i: number) => {
    return paddingX + i * ((chartWidth - 2 * paddingX) / (data.length - 1));
  };

  // Funkcja obliczająca współrzędne Y dla wartości
  const getY = (value: number) => {
    return (
      chartHeight - paddingY - (value / maxY) * (chartHeight - 2 * paddingY)
    );
  };

  // Generowanie ścieżki linii (path d)
  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" ");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-6">
        Wydajność{" "}
        <span className="text-sm font-normal text-gray-500">(Wzrost %)</span>
      </h3>

      <div className="grow relative flex">
        {/* Oś Y (Etykiety) */}
        <div className="flex flex-col justify-between text-xs text-gray-400 font-medium h-full pb-8 pt-2 pr-4">
          <span>12</span>
          <span>8</span>
          <span>4</span>
          <span className="opacity-0">0</span>{" "}
          {/* Ukrywamy 0, żeby nie nachodziło na oś X */}
        </div>

        {/* Obszar wykresu */}
        <div className="grow relative h-full w-full">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            aria-label="Efficiency chart showing percentage growth over months"
            role="img"
          >
            {/* Linia wykresu */}
            <polyline
              fill="none"
              stroke="#2563eb" // blue-600
              strokeWidth="3"
              points={points}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Punkty */}
            {data.map((d, i) => (
              <circle
                key={d.label}
                cx={getX(i)}
                cy={getY(d.value)}
                r="8" // Duże kropki jak na screenie
                className="fill-blue-600 stroke-white stroke-[3px] transition-all duration-200 hover:r-10"
              />
            ))}
          </svg>

          {/* Oś X (Etykiety) */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 mt-2 px-2.5">
            {" "}
            {/* px dopasowany do paddingu punktów */}
            {data.map((d) => (
              <span key={d.label} className="text-center w-8 -ml-4">
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
