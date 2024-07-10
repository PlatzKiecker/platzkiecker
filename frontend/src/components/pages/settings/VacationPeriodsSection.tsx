import DateRangePicker from "../../input/DateRangePicker";
import { useEffect, useState } from "react";
import { DateValueType } from "react-tailwindcss-datepicker";
import Button from "../../input/Button";
import mySWR from "../../../utils/mySWR";
import { VacationPeriod } from "../../../types/vacations";
import { postRequest, putRequest, deleteRequest } from "../../../utils/mySWR";

export default function VacationPeriodsSection() {
  const { data, error, loading } = mySWR(`/vacations/list/`);

  const [newPeriod, setNewPeriod] = useState({ startDate: "", endDate: "" });

  const [periods, setPeriods] = useState<VacationPeriod[]>([]);

  useEffect(() => {
    if (data) {
      setPeriods(data);
    }
  }, [data]);

  const handleValueChange = async (value: DateValueType, id: number) => {
    if (!value?.startDate || !value?.endDate) {
      const response = deleteRequest(`/vacations/${id}/`);
      setPeriods((prevPeriods: VacationPeriod[]) => {
        const updatedPeriods = prevPeriods.filter((period) => period.id !== id);
        return updatedPeriods;
      });
    } else {
      const response = await putRequest(`/vacations/${id}/`, { start: value.startDate?.toString().split("T")[0], end: value.endDate?.toString().split("T")[0] });
      setPeriods((prevPeriods: VacationPeriod[]) => {
        const updatedPeriods = prevPeriods.map((period) => {
          if (period.id === id && value)
            return {
              id: period.id,
              start: value.startDate,
              end: value.endDate,
              restaurant: period.restaurant,
            };
          return period;
        });
        return updatedPeriods;
      });
    }
  };

  const handleAddPeriod = async () => {
    const startDate = newPeriod.startDate.split("T")[0];
    const endDateString = newPeriod.endDate.split("T")[0];
    const response = await postRequest("/vacations/", { start: startDate, end: endDateString });
    setPeriods((prev) => {
      return [...prev, response.data];
    });
  };

  const periodJSX = periods?.map((period) => {
    return (
      <div key={period.id}>
        <DateRangePicker value={{ startDate: period.start, endDate: period.end }} onChange={(newValue) => handleValueChange(newValue, period.id)} />
      </div>
    );
  });

  return (
    <div className="space-y-4">
      {periodJSX}
      <p className="text-sm font-medium">Create new vacation</p>
      <div className="flex items-center gap-4">
        <DateRangePicker value={newPeriod} onChange={(value) => setNewPeriod({ startDate: value?.startDate?.toString() || "", endDate: value?.endDate?.toString() || "" })} />
        <Button variant="secondary" onClick={handleAddPeriod}>
          +
        </Button>
      </div>
    </div>
  );
}
