import Page from "../components/layout/Page";
import SettingsLayout from "../components/layout/SettingsLayout";
import InputField from "../components/input/InputField";
import BookingPeriodsSection from "../components/pages/settings/BookingPeriodsSection";
import VacationPeriodsSection from "../components/pages/settings/VacationPeriodsSection";

export default function Settings() {
  return (
    <Page title="Settings">
      <SettingsLayout>
        <SettingsLayout.Section title="Restaurant" description="Information about your restaurant">
          <InputField label="Name" />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Booking periods" description="Set when ypur restaurant can be booked">
          <BookingPeriodsSection />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Vacations" description="Set when your restaurant is on vacation">
          <VacationPeriodsSection />
        </SettingsLayout.Section>
      </SettingsLayout>
    </Page>
  );
}
