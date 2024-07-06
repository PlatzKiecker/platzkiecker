import InputField from "../components/input/InputField";
import Button from "../components/input/Button";

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
        <Button>Update booking</Button>
      </div>
    </div>
  );
}
