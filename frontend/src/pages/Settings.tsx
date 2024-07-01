import Page from "../components/layout/Page";
import SettingsLayout from "../components/layout/SettingsLayout";
import InputField from "../components/input/InputField";
import DateRangePicker from "../components/input/DateRangePicker";
import { useState } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import Button from "../components/input/Button";
import mySWR from "../utils/mySWR";
import TimeRangePicker from "../components/input/TimeRangePicker";
import { BookingPeriod, BookingPeriods } from "../types/bookings";
import { VacationPeriod } from "../types/vacations";

export default function Settings() {
  return (
    <Page title="Settings">
      <SettingsLayout>
        <SettingsLayout.Section title="Restaurant" description="Information about your restaurant">
          <InputField label="Name" />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Booking periods" description="Set when ypur restaurant can be booked">
          <BookingPeriodsSection />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Vacations" description="Set when your restaurant is on vacation">
          <VacationPeriodsSection />
        </SettingsLayout.Section>
      </SettingsLayout>
    </Page>
  );
}

function BookingPeriodsSection() {
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

function VacationPeriodsSection() {
  const { data, error, loading } = mySWR(`/vacations/list/`);
  console.log(data, loading, error);

  const [periods, setPeriods] = useState<VacationPeriod[]>([
    {
      id: 1,
      value: {
        startDate: new Date(),
        endDate: new Date(),
      },
    },
    {
      id: 2,
      value: {
        startDate: new Date(),
        endDate: new Date(),
      },
    },
  ]);

  const handleValueChange = (value: DateValueType, id: number) => {
    console.log(value);

    if (!value?.startDate || !value?.endDate) {
      // TODO: delete period
      setPeriods((prevPeriods: VacationPeriod[]) => {
        const updatedPeriods = prevPeriods.filter((period) => period.id !== id);
        return updatedPeriods;
      });
    } else {
      // TODO: update period
      setPeriods((prevPeriods: VacationPeriod[]) => {
        const updatedPeriods = prevPeriods.map((period) => {
          if (period.id === id && value)
            return {
              id: period.id,
              value: {
                startDate: value.startDate,
                endDate: value.endDate,
              },
            };
          return period;
        });
        return updatedPeriods;
      });
    }
  };

  const handleAddPeriod = () => {
    setPeriods((prev) => {
      const newPeriod = { id: prev.length + 1, value: { startDate: new Date(), endDate: new Date() } };
      return [...prev, newPeriod];
    });
  };

  const periodJSX = periods.map((period) => {
    return (
      <div key={period.id}>
        <DateRangePicker value={period.value} onChange={(newValue) => handleValueChange(newValue, period.id)} />
      </div>
    );
  });

  return (
    <div className="space-y-4">
      {periodJSX}
      <Button variant="secondary" onClick={handleAddPeriod}>
        +
      </Button>
    </div>
  );
}
