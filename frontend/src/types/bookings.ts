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

export type Booking = {
  guest_name: string;
  start: string;
  end: string;
  table: string;
  guest_count: string;
  notes: string;
  status: string;
  id: number; // Add the 'id' property
  guest_phone: string;
};
