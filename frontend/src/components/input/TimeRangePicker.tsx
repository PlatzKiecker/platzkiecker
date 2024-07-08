import InputField from "./InputField";
import { BookingPeriod } from "../../types/bookings";

export default function TimeRangePicker({ value, onChange }: { value: BookingPeriod; onChange: (value: BookingPeriod) => void }) {
  const handleChange = ({ open, close }: { open?: string; close?: string }) => {
    onChange({ ...value, open: open ? open : value.open, close: close ? close : value.close });
  };

  return (
    <div className="flex items-center">
      <InputField type="time" value={value.open.toString()} onChange={(val) => handleChange({ open: val })} />
      <span className="mx-2 text-sm text-gray-700">to</span>
      <InputField type="time" value={value.close.toString()} onChange={(val) => handleChange({ close: val })} />
    </div>
  );
}
