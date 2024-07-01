import { DateType } from "react-tailwindcss-datepicker";

export type VacationPeriod = {
  id: number;
  value: {
    startDate: DateType;
    endDate: DateType;
  };
};
