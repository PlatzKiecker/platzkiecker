import Page from "../components/layout/Page";
import SettingsLayout from "../components/layout/SettingsLayout";
import InputField from "../components/input/InputField";
import BookingPeriodsSection from "../components/pages/settings/BookingPeriodsSection";
import VacationPeriodsSection from "../components/pages/settings/VacationPeriodsSection";
import TableSection from "../components/pages/settings/TableSection";
import mySWR from "../utils/mySWR";
import { useState, useEffect } from "react";
import axios from 'axios';
import { mutate } from "swr";
import { getCookie } from "../utils/csrf";

export default function Settings() {
  return (
    <Page title="Settings">
      <SettingsLayout>
        <SettingsLayout.Section title="Restaurant" description="Information about your restaurant">
          <RestaurantSection />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Tables" description="Set the tables for your restaurants">
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
  const { data: restaurant, error, loading } = mySWR(`/restaurant/detail/`);
  const [restaurantName, setRestaurantName] = useState(restaurant?.name ?? "");

  useEffect(() => {
    if (restaurant) {
      setRestaurantName(restaurant.name);
    }
  }, [restaurant]);

  const handleRestaurantUpdate = async (value: string) => {
    setRestaurantName(value);
    const response = await axios.put(
      `http://localhost:8000/restaurant/detail/`,
      { name: value },
      {
        withCredentials: true,
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
      }
    );
    console.log(response);
    mutate(`/restaurant/detail/`, response.data, false); // false means revalidate the cache after updating
  };

  const { data: bookingDuration, error: bookingDurationError, loading: bookingDurationLoading } = mySWR(`/default-duration/1/`);
  const [defaultBookingDuration, setDefaultBookingDuration] = useState(bookingDuration?.duration || 0);

  useEffect(() => {
    if (bookingDuration) {
      setDefaultBookingDuration(parseInt(bookingDuration.duration));
    }
    // PUT to backend
  }, [bookingDuration]);

  const handleBookingDurationUpdate = (value: string) => {
    // TODO: PUT to backend
    setDefaultBookingDuration(value);
  };

  return (
    <div className="space-y-4">
      <InputField label="Name" value={restaurantName} onChange={handleRestaurantUpdate} />
      <InputField label="Default booking duration (in hours)" type="number" value={defaultBookingDuration.toString()} onChange={handleBookingDurationUpdate} />
    </div>
  );
}
