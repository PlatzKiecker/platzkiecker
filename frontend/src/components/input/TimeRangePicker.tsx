import InputField from "./InputField";
import { BookingPeriod } from "../../types/bookings";

export default function TimeRangePicker({ value }: { value: BookingPeriod }) {
  return (
    <div className="flex items-center">
      <InputField type="time" />
      <span className="mx-2 text-sm text-gray-700">to</span>
      <InputField type="time" />
    </div>
  );
}
