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
        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-gray-500 shadow-sm outline-none
                   ring-2 ring-transparent focus:ring-blue-500/60 focus:border-blue-500
                   transition duration-200 ease-out"
      />
    </div>
  );
}
