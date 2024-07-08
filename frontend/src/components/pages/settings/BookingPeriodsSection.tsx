import TimeRangePicker from "../../input/TimeRangePicker";
import { BookingPeriod, BookingPeriods } from "../../../types/bookings";
import mySWR, { postRequest } from "../../../utils/mySWR";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (data) {
      const periods: BookingPeriods = {
        monday: data.filter((period: BookingPeriod) => period.weekday === "MO") || [],
        tuesday: data.filter((period: BookingPeriod) => period.weekday === "TU") || [],
        wednesday: data.filter((period: BookingPeriod) => period.weekday === "WE") || [],
        thursday: data.filter((period: BookingPeriod) => period.weekday === "TH") || [],
        friday: data.filter((period: BookingPeriod) => period.weekday === "FR") || [],
        saturday: data.filter((period: BookingPeriod) => period.weekday === "SA") || [],
        sunday: data.filter((period: BookingPeriod) => period.weekday === "SU") || [],
      };
      setPeriods(periods);
    }
  }, [data]);

  const handleValueChange = (value: DateValueType, id: number) => {
    console.log(value);
  };

  const handleAddPeriod = async (day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") => {
    const response = await postRequest("/booking-periods/", { weekday: "MO", open: "12:00:00", close: "19:00:00" });
    console.log(response);

    setPeriods((prev) => {
      const newPeriod = { id: 1, value: { open: new Date(), close: new Date() } };
      return { ...prev, [day]: [...prev[day], newPeriod] };
    });
  };

  const dayJSX = Object.entries(days).map(([day, value]) => {
    return (
      <div key={day} className="space-y-1">
        <h3 className="font-medium">{day}</h3>
        {value.map((period: BookingPeriod) => period.open && period.close && <TimeRangePicker key={period.open.toString()} value={period} />)}
        <Button variant="secondary" onClick={() => handleAddPeriod(day as keyof BookingPeriods)}>
          +
        </Button>
      </div>
    );
  });

  return <div className="space-y-4">{dayJSX}</div>;
}
