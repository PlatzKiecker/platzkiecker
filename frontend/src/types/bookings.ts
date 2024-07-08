export type BookingPeriods = {
  monday: BookingPeriod[];
  tuesday: BookingPeriod[];
  wednesday: BookingPeriod[];
  thursday: BookingPeriod[];
  friday: BookingPeriod[];
  saturday: BookingPeriod[];
  sunday: BookingPeriod[];
};

export type BookingPeriod = {
  id: number;
  weekday: string;
  open: string;
  close: string;
};
