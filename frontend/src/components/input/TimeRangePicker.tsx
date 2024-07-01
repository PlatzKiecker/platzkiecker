import InputField from "./InputField";

type BookingPeriod = {
  id: number;
  value: {
    startTime: Date;
    endTime: Date;
  };
};

export default function TimeRangePicker({ value }: { value: BookingPeriod }) {
  return (
    <div className="flex items-center">
      <InputField type="time" />
      <span className="mx-2">to</span>
      <InputField type="time" />
    </div>
  );
}
