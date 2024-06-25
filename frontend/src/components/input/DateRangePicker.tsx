import { useState } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";

export default function DateRangePicker() {
  const [value, setValue] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleValueChange = (newValue: DateValueType) => {
    setValue(newValue);
  };

  return <Datepicker primaryColor="indigo" showShortcuts={false} value={value} onChange={handleValueChange} />;
}
