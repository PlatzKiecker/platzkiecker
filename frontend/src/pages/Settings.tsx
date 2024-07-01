import Page from "../components/layout/Page";
import SettingsLayout from "../components/layout/SettingsLayout";
import InputField from "../components/input/InputField";
import DateRangePicker from "../components/input/DateRangePicker";
import { useState } from "react";
import { DateValueType, DateType } from "react-tailwindcss-datepicker";
import Button from "../components/input/Button";
import mySWR from "../utils/mySWR";
import TimeRangePicker from "../components/input/TimeRangePicker";

export default function Settings() {
  return (
    <Page title="Settings">
      <SettingsLayout>
        <SettingsLayout.Section title="Restaurant" description="Information about your restaurant">
          <InputField label="Name" />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Booking periods" description="Set when ypur restaurant can be booked">
          <BookingPeriods />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Vacations" description="Set when your restaurant is on vacation">
          <VacationPeriods />
        </SettingsLayout.Section>
      </SettingsLayout>
    </Page>
  );
}

type BookingPeriods = {
  monday: BookingPeriod[];
  tuesday: BookingPeriod[];
  wednesday: BookingPeriod[];
  thursday: BookingPeriod[];
  friday: BookingPeriod[];
  saturday: BookingPeriod[];
  sunday: BookingPeriod[];
};

type BookingPeriod = {
  id: number;
  value: {
    startTime: Date;
    endTime: Date;
  };
};

function BookingPeriods() {
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
      const newPeriod = { id: 1, value: { startDate: new Date(), endDate: new Date() } };
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

type Period = {
  id: number;
  value: {
    startDate: DateType;
    endDate: DateType;
  };
};
function VacationPeriods() {
  const { data, error, loading } = mySWR(`/vacations/list/`);
  console.log(data, loading, error);

  const [periods, setPeriods] = useState<Period[]>([
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
      setPeriods((prevPeriods: Period[]) => {
        const updatedPeriods = prevPeriods.filter((period) => period.id !== id);
        return updatedPeriods;
      });
    } else {
      // TODO: update period
      setPeriods((prevPeriods: Period[]) => {
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
