import InputField from "../components/input/InputField";
import Page from "../components/Page";

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
        <button
          type="button"
          className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          New booking
        </button>
      </div>
    </Page>
  );
}
