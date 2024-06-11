import InputField from "../components/input/InputField";

export default function Booking() {
  return (
    <div>
      <header className="mb-10">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Edit booking</h1>
        </div>
      </header>
      <div className="max-w-xl">
        <InputField label="Name" />
        <InputField label="Guests" />
        <InputField label="Calendar" />
        <InputField label="Notes" />
      </div>

      <div className="mt-10">
        <button
          type="button"
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Update booking
        </button>
      </div>
    </div>
  );
}
