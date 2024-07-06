import DateRangePicker from "../../input/DateRangePicker";
import { useState } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import Button from "../../input/Button";
import mySWR from "../../../utils/mySWR";
import { VacationPeriod } from "../../../types/vacations";

export default function VacationPeriodsSection() {
  const { data, error, loading } = mySWR(`/vacations/list/`);
  console.log(data, loading, error);

  const [periods, setPeriods] = useState<VacationPeriod[]>(data || []);

  const handleValueChange = (value: DateValueType, id: number) => {
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
