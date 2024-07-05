import React, { useState } from "react";
import InputField from "../components/input/InputField";
import Page from "../components/layout/Page";
import InputFieldLogin from "../components/input/InputFieldLogin";
import { postRequest } from "../utils/mySWR";

export default function NewBooking() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationDetails, setReservationDetails] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [responseMsg, setResponseMsg] = useState<string | null>(null); // State to hold response message
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const bookingData = {
        guest_name: fullName,
        guest_phone: phoneNumber,
        start: "2024-07-10T14:15:00.000Z",
        guest_count: parseInt(guestCount),
        notes: reservationDetails,
      };
      const response = await postRequest(`/bookings/1/`, bookingData); // Ensure the URL is correct
      console.log("Booking created:", response.data);
      if (response.data.guest_count && response.data.guest_count.length > 0) {
        const errorMessage = response.data.guest_count[0];
        setResponseMsg(errorMessage); // Set response message
      } else {
        setResponseMsg("Booking created successfully"); // Set default success message
        setShowPopup(true); // Show popup on successful booking
      }
    } catch (err: any) {
      console.error("Navigation failed:", err.message);
      if (err.response && err.response.data.guest_count && err.response.data.guest_count.length > 0) {
        const errorMessage = err.response.data.guest_count[0];
        setResponseMsg(errorMessage); // Set response message from error JSON
      } else {
        setResponseMsg("Error occurred while creating booking"); // Set generic error message
      }
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFullName(e.target.value); };
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => { setPhoneNumber(e.target.value); };
  const handleReservationDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => { setReservationDetails(e.target.value); };
  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => { setGuestCount(e.target.value); };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <Page title="Create booking">
      <form onSubmit={handleBooking} className="max-w-xl">
        <InputFieldLogin label="Name" name="fullName" value={fullName} onChange={handleFullNameChange} /> <br />
        <InputFieldLogin label="Phonenumber" name="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} /><br />
        <InputFieldLogin label="Guests" name="guestCount" value={guestCount} onChange={handleGuestCountChange}  /><br /> 
        <InputField label="Calendar" /><br />
        <InputFieldLogin label="Notes" name="reservationDetails" value={reservationDetails} onChange={handleReservationDetailsChange} /><br />
        {responseMsg && <p className="text-red-600">{responseMsg}</p>} {/* Display response message */}
        <div className="mt-10">
          <button
            type="submit"
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            New Booking
          </button>
        </div>
      </form>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-xl font-semibold mb-4">Booking Successful!</p>
            <button onClick={closePopup} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 focus:outline-none">
              Close
            </button>
          </div>
        </div>
      )}
    </Page>
  );
}
