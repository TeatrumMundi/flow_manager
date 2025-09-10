interface InputProps {
  id: string;
  type: string;
  label: string;
}

export default function Input({ id, type, label }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
      />
    </div>
  );
}