"use client";

interface ProjectCostData {
  amount: number;
  projectName: string;
}

export function ProjectCostChart({ data }: { data: ProjectCostData }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-800 mb-2 w-full text-center">
        Koszty projektu
      </h3>

      <div className="text-2xl font-bold text-gray-900 mb-8">
        {formatCurrency(data.amount)}
      </div>

      {/* Słupek i nazwa */}
      <div className="grow flex flex-col justify-end items-center gap-4">
        {/* Niebieski blok */}
        <div className="w-24 h-48 bg-blue-600 rounded-md"></div>

        {/* Nazwa projektu */}
        <span className="text-lg text-gray-800 font-medium">
          {data.projectName}
        </span>
      </div>
    </div>
  );
}
