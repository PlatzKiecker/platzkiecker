import Page from "../components/Layout/Page";
import SettingsLayout from "../components/Layout/SettingsLayout";
import InputField from "../components/input/InputField";
import DateRangePicker from "../components/input/DateRangePicker";
import { useState } from "react";
import { DateValueType, DateType } from "react-tailwindcss-datepicker";
import Button from "../components/input/Button";

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

function BookingPeriods() {
  const [days, setPeriods] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  const dayJSX = Object.entries(days).map(([day, value]) => {
    return (
      <div key={day}>
        <h3 className="font-medium">{day}</h3>
        <DateRangePicker
          value={{
            startDate: new Date(),
            endDate: new Date(),
          }}
          onChange={(newValue) => {}}
        />
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
      <Button onClick={handleAddPeriod}>Add period</Button>
    </div>
  );
}
