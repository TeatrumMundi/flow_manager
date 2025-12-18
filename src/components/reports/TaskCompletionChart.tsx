"use client";

interface TaskData {
  todo: number; // Szary (jasny)
  inProgress: number; // Niebieski
  inReview: number; // Żółty
  done: number; // Zielony
  blocked: number; // Czerwony
  canceled: number; // Szary (ciemny)
}

export function TaskCompletionChart({ data }: { data: TaskData }) {
  const total =
    data.todo +
    data.inProgress +
    data.inReview +
    data.done +
    data.blocked +
    data.canceled;

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col justify-center items-center text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-6 self-start">
          Realizacja zadań
        </h3>
        <div className="w-40 h-40 rounded-full border-4 border-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Brak danych</span>
        </div>
      </div>
    );
  }

  // Obliczanie stopni dla każdego segmentu
  const degTodo = (data.todo / total) * 360;
  const degInProgress = (data.inProgress / total) * 360;
  const degInReview = (data.inReview / total) * 360;
  const degDone = (data.done / total) * 360;
  const degBlocked = (data.blocked / total) * 360;

  // Punkty końcowe dla gradientu
  const end1 = degTodo;
  const end2 = end1 + degInProgress;
  const end3 = end2 + degInReview;
  const end4 = end3 + degDone;
  const end5 = end4 + degBlocked;
  // end6 to 360 (canceled)

  // Kolory zgodne z Twoim screenem
  const colors = {
    todo: "#e5e7eb", // Szary jasny
    inProgress: "#3b82f6", // Niebieski
    inReview: "#fbbf24", // Żółty/Bursztynowy
    done: "#22c55e", // Zielony
    blocked: "#ef4444", // Czerwony
    canceled: "#4b5563", // Szary ciemny (Slate-600)
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Realizacja zadań</h3>

      <div className="grow flex flex-col items-center justify-center">
        {/* Wykres Donut */}
        <div
          className="w-40 h-40 rounded-full relative shrink-0"
          style={{
            background: `conic-gradient(
                    ${colors.todo} 0deg ${end1}deg, 
                    ${colors.inProgress} ${end1}deg ${end2}deg, 
                    ${colors.inReview} ${end2}deg ${end3}deg,
                    ${colors.done} ${end3}deg ${end4}deg,
                    ${colors.blocked} ${end4}deg ${end5}deg,
                    ${colors.canceled} ${end5}deg 360deg
                )`,
          }}
        >
          {/* Biały środek */}
          <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-inner">
            <span className="text-gray-500 text-xs font-medium">
              Ukończone:
            </span>
            <span className="text-3xl font-bold text-gray-800">
              {Math.round((data.done / total) * 100)}%
            </span>
            <span className="text-gray-400 text-[10px]">
              Zadań łącznie: {total}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6 w-full text-xs">
          {/* Kolumna 1 */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: colors.todo }}
            ></div>
            <span className="text-gray-600">Do zrobienia</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: colors.inProgress }}
            ></div>
            <span className="text-gray-600">W trakcie</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: colors.inReview }}
            ></div>
            <span className="text-gray-600">W przeglądzie</span>
          </div>

          {/* Kolumna 2 */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: colors.done }}
            ></div>
            <span className="text-gray-600">Ukończone</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: colors.blocked }}
            ></div>
            <span className="text-gray-600">Zablokowane</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: colors.canceled }}
            ></div>
            <span className="text-gray-600">Anulowane</span>
          </div>
        </div>
      </div>
    </div>
  );
}
