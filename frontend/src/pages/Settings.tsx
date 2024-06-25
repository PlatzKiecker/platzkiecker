import Page from "../components/Layout/Page";
import SettingsLayout from "../components/Layout/SettingsLayout";
import InputField from "../components/input/InputField";
import DateRangePicker from "../components/input/DateRangePicker";

export default function Settings() {
  return (
    <Page title="Settings">
      <SettingsLayout>
        <SettingsLayout.Section title="Restaurant" description="Information about your restaurant">
          <InputField label="Name" />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Booking periods" description="Set when ypur restaurant can be booked">
          <DateRangePicker label="Select date" date={new Date()} />
        </SettingsLayout.Section>
        <SettingsLayout.Section title="Vacations" description="Set when your restaurant is on vacation">
          test
        </SettingsLayout.Section>
      </SettingsLayout>
    </Page>
  );
}
