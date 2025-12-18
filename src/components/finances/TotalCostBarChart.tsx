"use client";

interface CostData {
  amount: number;
  label: string;
}

export function TotalCostBarChart({ data }: { data: CostData }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col items-center text-center">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Koszty projektu
      </h3>

      <div className="text-2xl font-bold text-gray-900 mb-6">
        {formatCurrency(data.amount)}
      </div>

      <div className="grow w-full flex items-end justify-center pb-2">
        <div className="w-24 h-40 bg-blue-600 rounded-md"></div>
      </div>

      <span
        className="text-sm text-gray-600 mt-2 truncate w-full px-2"
        title={data.label}
      >
        {data.label}
      </span>
    </div>
  );
}
