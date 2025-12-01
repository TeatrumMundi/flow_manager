interface DataPoint {
  label: string;
  value: number;
}

export function CostsBarChart({ data }: { data: DataPoint[] }) {
  const maxVal = 50; // Skala Y w tysiącach

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Koszty</h3>
      <div className="grow flex items-end relative pb-6 px-4">
        {/* Oś Y */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400">
          <span>$40K</span>
          <span>$30K</span>
          <span>$0</span>
        </div>

        <div className="flex justify-around w-full items-end h-full pl-8 gap-4">
          {data.map((item, index) => (
            <div
              key={item.label}
              className="flex flex-col items-center w-1/3 h-full justify-end group"
            >
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${
                  index === data.length - 1 ? "bg-blue-500" : "bg-blue-200"
                }`}
                style={{ height: `${(item.value / maxVal) * 100}%` }}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-around pl-8 text-xs text-gray-500 mt-2">
        {data.map((item) => (
          <span key={item.label}>{item.label}</span>
        ))}
      </div>
    </div>
  );
}
