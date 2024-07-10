import TimeRangePicker from "../../input/TimeRangePicker";
import { BookingPeriod, BookingPeriods } from "../../../types/bookings";
import mySWR, { postRequest, deleteRequest, putRequest } from "../../../utils/mySWR";
import { useEffect, useState } from "react";
import Button from "../../input/Button";
import { TrashIcon } from "@heroicons/react/16/solid";
import { TimeRangeValue } from "../../../types/input";

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

  const [newTimeRange, setNewTimeRange] = useState<{
    [key: string]: { open: string; close: string };
  }>({
    monday: { open: "12:00:00", close: "19:00:00" },
    tuesday: { open: "12:00:00", close: "19:00:00" },
    wednesday: { open: "12:00:00", close: "19:00:00" },
    thursday: { open: "12:00:00", close: "19:00:00" },
    friday: { open: "12:00:00", close: "19:00:00" },
    saturday: { open: "12:00:00", close: "19:00:00" },
    sunday: { open: "12:00:00", close: "19:00:00" },
  });

  useEffect(() => {
    if (data) {
      const transformedData: BookingPeriods = {
        monday: data.filter((period: BookingPeriod) => period.weekday === "MO") || [],
        tuesday: data.filter((period: BookingPeriod) => period.weekday === "TU") || [],
        wednesday: data.filter((period: BookingPeriod) => period.weekday === "WE") || [],
        thursday: data.filter((period: BookingPeriod) => period.weekday === "TH") || [],
        friday: data.filter((period: BookingPeriod) => period.weekday === "FR") || [],
        saturday: data.filter((period: BookingPeriod) => period.weekday === "SA") || [],
        sunday: data.filter((period: BookingPeriod) => period.weekday === "SU") || [],
      };
      setPeriods(transformedData);
    }
  }, [data]);

  const handleAddPeriod = async (day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday") => {
    const weekday = day.slice(0, 2).toUpperCase();
    const response = await postRequest("/booking-periods/", { weekday: weekday, open: newTimeRange[day].open, close: newTimeRange[day].close });

    setPeriods((prev) => {
      return { ...prev, [day]: [...prev[day], response.data] };
    });
  };

  const handleDeletePeriod = async (id: number) => {
    const response = await deleteRequest(`/booking-periods/${id}/`);
    setPeriods((prev) => {
      return {
        monday: prev.monday.filter((period: BookingPeriod) => period.id !== id),
        tuesday: prev.tuesday.filter((period: BookingPeriod) => period.id !== id),
        wednesday: prev.wednesday.filter((period: BookingPeriod) => period.id !== id),
        thursday: prev.thursday.filter((period: BookingPeriod) => period.id !== id),
        friday: prev.friday.filter((period: BookingPeriod) => period.id !== id),
        saturday: prev.saturday.filter((period: BookingPeriod) => period.id !== id),
        sunday: prev.sunday.filter((period: BookingPeriod) => period.id !== id),
      };
    });
  };

  const dayJSX = Object.entries(days).map(([day, value]) => {
    return (
      <div key={day} className="space-y-1">
        <h3 className="font-medium">{day}</h3>
        {value.map((period: BookingPeriod) => {
          if (!period.open && !period.close) return;
          return (
            <div className="flex gap-4 items-center">
              <p className="text-gray-600">
                {period.open.toString()} - {period.close.toString()}
              </p>
              <Button variant="secondary" onClick={() => handleDeletePeriod(period.id)}>
                <TrashIcon className="text-red-500 h-4 w-4" />
              </Button>
            </div>
          );
        })}
        <div className="flex items-end gap-4">
          <TimeRangePicker
            value={newTimeRange[day]}
            onChange={(value) => {
              setNewTimeRange((prev) => {
                return { ...prev, [day]: value };
              });
            }}
          />
          <Button variant="secondary" onClick={() => handleAddPeriod(day as keyof BookingPeriods)}>
            +
          </Button>
        </div>
      </div>
    );
  });

  return <div className="space-y-4">{dayJSX}</div>;
}
