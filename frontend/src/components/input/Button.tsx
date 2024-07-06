export default function Button({ onClick, variant, children }: { onClick?: () => void; variant?: "primary" | "secondary"; children: React.ReactNode }) {
  const variantStyle =
    variant === "secondary" ? "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50" : "text-white bg-indigo-600 hover:bg-indigo-500 ext-white focus-visible:outline-indigo-600";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`block rounded-md ${variantStyle} px-3 py-2 text-center text-sm font-semibold t shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 `}>
      {children}
    </button>
  );
}
