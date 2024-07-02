export default function Select({
  label,
  value,
  options,
  onChange,
  placeholder = "Select value",
}: {
  label?: string;
  value?: string;
  options: [string, string][];
  onChange?: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      {label && (
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          {label}
        </label>
      )}
      <div className="mt-2">
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          name={label}
          id={label}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(([key, value]) => (
            <option key={key} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
