import Page from "../components/layout/Page";
import SettingsLayout from "../components/layout/SettingsLayout";
import InputField from "../components/input/InputField";
import BookingPeriodsSection from "../components/pages/settings/BookingPeriodsSection";
import VacationPeriodsSection from "../components/pages/settings/VacationPeriodsSection";
import TableSection from "../components/pages/settings/TableSection";
import mySWR, { putRequest } from "../utils/mySWR";
import { useState, useEffect } from "react";

export default function Settings() {
  const { data, error, loading } = mySWR(`/restaurant/detail/`);

  const currentDomain = window.location.origin;
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
        <SettingsLayout.Section title="Booking Portal" description="Use this link to allow users to book online">
          <div className="bg-gray-800 text-gray-300 py-4 px-8 rounded-lg shadow">
            {currentDomain}/tableReservation?id={data?.id}
          </div>
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
  const [defaultBookingDuration, setDefaultBookingDuration] = useState(0);

  function transformDurationIntoFloat(duration: string) {
    const [hours, minutes] = duration.split(":");
    return parseFloat(hours) + parseFloat(minutes) / 60;
  }

  useEffect(() => {
    if (bookingDuration) {
      setDefaultBookingDuration(transformDurationIntoFloat(bookingDuration.duration));
    }
  }, [bookingDuration]);

  const handleBookingDurationUpdate = async (value: string) => {
    const totalMinutes = parseFloat(value) * 60;

    const hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    //await postRequest(`/default-duration/`, { duration: `${hours}:${minutes}:00` });
    const response = putRequest(`/default-duration/detail/`, { duration: `${hours}:${minutes}:00` });

    setDefaultBookingDuration(parseFloat(value));
  };

  return (
    <div className="space-y-4">
      <InputField label="Name" value={restaurantName} onChange={handleRestaurantUpdate} />
      <InputField label="Default booking duration (in hours)" type="number" value={defaultBookingDuration.toString()} onChange={handleBookingDurationUpdate} />
    </div>
  );
}
