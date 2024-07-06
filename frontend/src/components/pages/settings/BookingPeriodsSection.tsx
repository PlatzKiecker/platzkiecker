import TimeRangePicker from "../../input/TimeRangePicker";
import { BookingPeriod, BookingPeriods } from "../../../types/bookings";
import mySWR from "../../../utils/mySWR";
import { useState } from "react";
import Button from "../../input/Button";
import { DateValueType } from "react-tailwindcss-datepicker";

export default function BookingPeriodsSection() {
  const { data, error, loading } = mySWR(`/booking-periods/list/`);
  const [days, setPeriods] = useState<BookingPeriods>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  const handleValueChange = (value: DateValueType, id: number) => {
    console.log(value);
  };

  const handleAddPeriod = (day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") => {
    setPeriods((prev) => {
      // POST to backend
      console.log("POST to backend", day);

      const newPeriod = { id: 1, value: { startTime: new Date(), endTime: new Date() } };
      return { ...prev, [day]: [...prev[day], newPeriod] };
    });
  };

  const dayJSX = Object.entries(days).map(([day, value]) => {
    return (
      <div key={day} className="space-y-1">
        <h3 className="font-medium">{day}</h3>
        {value.map((period: BookingPeriod) => period.value.startTime && period.value.endTime && <TimeRangePicker key={period.value.startTime.toLocaleString()} value={period} />)}
        <Button variant="secondary" onClick={() => handleAddPeriod(day as keyof BookingPeriods)}>
          +
        </Button>
      </div>
    );
  });

  return <div className="space-y-4">{dayJSX}</div>;
}
