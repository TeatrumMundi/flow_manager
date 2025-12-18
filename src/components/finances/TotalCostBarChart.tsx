"use client";

interface CostData {
    usedAmount: number;
    totalBudget: number;
    label: string;
}

export function TotalCostBarChart({ data }: { data: CostData }) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(val);

    const { usedAmount, totalBudget, label } = data;

    const isOverbudget = usedAmount > totalBudget && totalBudget > 0;
    const hasNoData = totalBudget === 0;

    if (hasNoData) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-6 self-start">Koszty projektu</h3>
                <div className="w-32 h-32 rounded-full border-2 border-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Brak budżetu<br/>lub danych</span>
                </div>
                <span className="text-sm text-gray-600 mt-6 truncate w-full px-2">{label}</span>
            </div>
        );
    }

    if (isOverbudget) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col items-center text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Koszty projektu</h3>

                <div className="text-2xl font-bold text-red-600 mb-2">
                    {formatCurrency(usedAmount)}
                </div>
                <div className="text-xs text-red-400 font-medium mb-4">
                    Budżet przekroczony! ({formatCurrency(totalBudget)})
                </div>

                <div className="flex-grow w-full flex items-end justify-center pb-2">
                    <div className="w-24 h-40 bg-red-600 rounded-md shadow-sm"></div>
                </div>

                <span className="text-sm text-gray-600 mt-2 truncate w-full px-2" title={label}>
                {label}
            </span>
            </div>
        );
    }

    const usagePercentage = Math.min((usedAmount / totalBudget) * 100, 100);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col items-center text-center">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Koszty projektu</h3>

            <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(usedAmount)}
            </div>
            <div className="text-xs text-gray-500 mb-4">
                z budżetu: {formatCurrency(totalBudget)}
            </div>

            <div className="flex-grow w-full flex items-end justify-center pb-2">
                <div className="w-24 h-40 bg-gray-200 rounded-md relative overflow-hidden flex items-end shadow-inner">
                    <div
                        className="w-full bg-blue-600 rounded-b-md transition-all duration-500"
                        style={{ height: `${usagePercentage}%` }}
                    ></div>
                </div>
            </div>

            <span className="text-sm text-gray-600 mt-2 truncate w-full px-2" title={label}>
        {label}
      </span>
        </div>
    );
}