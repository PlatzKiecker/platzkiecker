import InputField from "./InputField";
import { BookingPeriod } from "../../types/bookings";

export default function TimeRangePicker({ value, onChange }: { value: BookingPeriod; onChange: (value: BookingPeriod) => void }) {
  const handleChange = (open: string, close: string) => {
    onChange({ ...value, open: new Date(`2000-01-01T${open}:00`), close: new Date(`2000-01-01T${close}:00`) });
  };

  return (
    <div className="flex items-center">
      <InputField type="time" value={value.open.toString()} onChange={(val) => handleChange} />
      <span className="mx-2 text-sm text-gray-700">to</span>
      <InputField type="time" value={value.close.toString()} onChange={(val) => handleChange} />
    </div>
  );
}
