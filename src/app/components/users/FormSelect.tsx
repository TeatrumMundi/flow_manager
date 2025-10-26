export const FormSelect = ({
                      label,
                      name,
                      value,
                      onChange,
                      options,
                    }: {
  label: string;
  name: string;
  value: string;
  onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  options: string[];
}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      >
        {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
        ))}
      </select>
    </div>
);