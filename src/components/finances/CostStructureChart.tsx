"use client";

interface CategoryData {
    name: string | null;
    amount: number;
}

export function CostStructureChart({ data }: { data: CategoryData[] }) {
    const total = data.reduce((acc, item) => acc + item.amount, 0);

    if (total === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-6 self-start">Struktura kosztów</h3>
                <div className="w-32 h-32 rounded-full border-2 border-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Brak danych</span>
                </div>
            </div>
        );
    }

    // Paleta kolorów wzorowana na Twoim screenie (Infrastruktura, Usługi, Oprogramowanie...)
    // Kolejność: Niebieski, Błękitny, Zielony, Pomarańczowy, Beżowy, Szary
    const colors = [
        "#5b9bd5", // Niebieski (Infrastruktura)
        "#9dc3e6", // Jasny błękit (Usługi)
        "#8ebc8d", // Zielony (Oprogramowanie - zgaszony)
        "#a9d18e", // Jasny zielony (Zaopatrzenie)
        "#d98956", // Ceglasty/Pomarańczowy (Sprzęt)
        "#f4b183", // Beżowy/Jasny pomarańcz (Inne)
        "#bfbfbf"  // Szary (zapasowy)
    ];

    // Generowanie gradientu stożkowego z przerwami (białe linie symulowane przez border w CSS nie zadziałają na conic-gradient,
    // więc zostawiamy czysty gradient, a efekt "pizzy" jest trudny do uzyskania w czystym CSS bez SVG.
    // Zostawimy czysty gradient, który wygląda nowocześnie).
    let currentAngle = 0;
    const gradientParts = data.map((item, index) => {
        const percentage = item.amount / total;
        const degrees = percentage * 360;
        const start = currentAngle;
        const end = currentAngle + degrees;
        currentAngle = end;

        const color = colors[index % colors.length];
        // Dodajemy minimalną przerwę (0.5 stopnia) kolorem białym, jeśli chcesz "odcięcie",
        // ale w conic-gradient to może wyglądać poszarpane. Lepiej zostawić gładkie przejścia lub użyć SVG w przyszłości.
        return `${color} ${start}deg ${end}deg`;
    });

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Struktura kosztów</h3>

            <div className="flex-grow flex flex-col items-center justify-center">
                {/* Wykres Kołowy - Powiększony */}
                <div
                    className="w-40 h-40 rounded-full shrink-0 shadow-sm relative border-2 border-white"
                    style={{
                        background: `conic-gradient(${gradientParts.join(", ")})`,
                        // Opcjonalnie: cień wewnętrzny dla głębi
                        boxShadow: "inset 0 0 0 0px white"
                    }}
                >
                    {/* Opcjonalnie: Białe linie podziału (maska SVG) - trudne w czystym CSS */}
                </div>

                {/* Legenda - Na dole, siatka 2 kolumny */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6 w-full px-2 text-[11px] text-gray-600">
                    {data.slice(0, 6).map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: colors[index % colors.length] }}></div>
                            <div className="flex justify-between w-full overflow-hidden">
                                <span className="truncate mr-1" title={item.name || "Inne"}>{item.name || "Inne"}</span>
                                <span className="font-bold text-gray-800">{Math.round((item.amount / total) * 100)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}