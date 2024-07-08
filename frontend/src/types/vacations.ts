import { DateType } from "react-tailwindcss-datepicker";

export type VacationPeriod = {
  id: number;
  start: DateType;
  end: DateType;
  restaurant: number | null;
};
