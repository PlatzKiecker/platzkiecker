import Datepicker, { DateValueType, DateType } from "react-tailwindcss-datepicker";

type DateRangePickerProps = {
  value: {
    startDate: DateType;
    endDate: DateType;
  };
  onChange: (value: DateValueType) => void;
};

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return <Datepicker primaryColor="indigo" showShortcuts={false} value={value} onChange={onChange} />;
}
