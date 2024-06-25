import InputField from "../components/input/InputField";
import Page from "../components/Page";
import Button from "../components/input/Button";

export default function NewBooking() {
  return (
    <Page title="Create booking">
      <div className="max-w-xl">
        <InputField label="Name" />
        <InputField label="Guests" />
        <InputField label="Calendar" />
        <InputField label="Notes" />
      </div>

      <div className="mt-10">
        <Button>Create booking</Button>
      </div>
    </Page>
  );
}
