import Page from "../components/layout/Page";
import SettingsLayout from "../components/layout/SettingsLayout";
import InputField from "../components/input/InputField";
import BookingPeriodsSection from "../components/pages/settings/BookingPeriodsSection";
import VacationPeriodsSection from "../components/pages/settings/VacationPeriodsSection";
import TableSection from "../components/pages/settings/TableSection";
import mySWR, { putRequest } from "../utils/mySWR";
import { useState, useEffect } from "react";

export default function Settings() {
  return (
    <Page title="Settings">
      <SettingsLayout>
        <SettingsLayout.Section title="Restaurant" description="Information about your restaurant">
          <RestaurantSection />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Tables & Zones" description="Set the tables & zones for your restaurants">
          <TableSection />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Booking periods" description="Set when your restaurant can be booked">
          <BookingPeriodsSection />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Vacations" description="Set when your restaurant is on vacation">
          <VacationPeriodsSection />
        </SettingsLayout.Section>
      </SettingsLayout>
    </Page>
  );
}
function RestaurantSection() {
  const { data: restaurant, error, loading, update: updateRestaurantName } = mySWR(`/restaurant/detail/`);
  const [restaurantName, setRestaurantName] = useState(restaurant?.name ?? "");

  useEffect(() => {
    if (restaurant) {
      setRestaurantName(restaurant.name);
    }
  }, [restaurant]);

  const handleRestaurantUpdate = async (value: string) => {
    setRestaurantName(value);
    updateRestaurantName({ name: value });
  };

  const { data: bookingDuration, error: bookingDurationError, loading: bookingDurationLoading, update: updateBookingDuration } = mySWR(`/default-duration/detail/`);
  const [defaultBookingDuration, setDefaultBookingDuration] = useState(bookingDuration?.duration || 0);

  useEffect(() => {
    if (bookingDuration) {
      setDefaultBookingDuration(parseInt(bookingDuration.duration));
      updateBookingDuration({ duration: parseInt(bookingDuration.duration) });
    }
    // PUT to backend
  }, [bookingDuration]);

  const handleBookingDurationUpdate = async (value: string) => {
    // TODO: fix
    const response = putRequest(`/default-duration/detail/`, { duration: parseInt(value) });
    setDefaultBookingDuration(value);
  };

  return (
    <div className="space-y-4">
      <InputField label="Name" value={restaurantName} onChange={handleRestaurantUpdate} />
      <InputField label="Default booking duration (in hours)" type="number" value={defaultBookingDuration.toString()} onChange={handleBookingDurationUpdate} />
    </div>
  );
}
