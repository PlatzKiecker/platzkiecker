import React, { useState } from "react";
import ProgressTracker from "../components/layout/ProgressTracker";
import InputFieldLogin from "../components/input/InputFieldLogin";
import { useNavigate } from "react-router-dom";
import { postRequest } from "../utils/mySWR";
import { useLocation } from "react-router-dom";

export default function GuestDetails() {
  const location = useLocation();
  const { guestCount, combinedDateTime } = location.state || {};
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationDetails, setReservationDetails] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const bookingData = {
        guest_name: fullName,
        guest_phone: phoneNumber,
        start: combinedDateTime,
        guest_count: guestCount,
        notes: reservationDetails,
      };
      const response = await postRequest("/bookings/1/", bookingData);
      console.log("Booking created:", response.data);

      // Direktes Navigieren zur Bestätigungsseite mit den Daten
      navigate("/confirmation", { state: { bookingData: response.data } });
    } catch (err: any) {
      console.error("Booking creation failed:", err.message);
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleReservationDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReservationDetails(e.target.value);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen p-4">
      <div className="bg-gray-100 p-6 w-full max-w-4xl h-auto max-h-screen overflow-auto mx-auto">
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Online Reservation</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Please fill in more details for your reservation.</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <InputFieldLogin label="" name="fullName" value={fullName} onChange={handleFullNameChange} />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <InputFieldLogin label="" name="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Comment/ Reservation Details</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <InputFieldLogin label="" name="reservationDetails" value={reservationDetails} onChange={handleReservationDetailsChange} />
              </dd>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Submit Guest Information
              </button>
            </div>
          </dl>
        </form>
        <div className="border-t border-gray-600 mt-6 pt-6"></div>
        <ProgressTracker progress={66.6} />
      </div>
    </div>
  );
}
