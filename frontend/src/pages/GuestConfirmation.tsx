import React from "react";
import ProgressTracker from "../components/layout/ProgressTracker";

export default function GuestConfirmation() {
  // Buchungsinformationen aus dem Session Storage abrufen
  const bookingResponse = sessionStorage.getItem('bookingResponse');
  const bookingData = bookingResponse ? JSON.parse(bookingResponse) : null;

  return (
    <div className="flex items-center justify-center w-full h-screen p-4">
      <div className="bg-gray-100 p-6 w-full max-w-4xl h-auto max-h-screen overflow-auto mx-auto">
        {/* Header */}
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Online Reservation</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Thank you for your reservation.
            Please find your booking details below.
            If you like to make any changes, please contact us.
          </p>
        </div>

        {/* Form Section */}
        <div className="mt-6 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            {/* Guest Information */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Guest Information</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                Name: {bookingData?.guest_name || 'N/A'} <br />
                Phone Number: {bookingData?.guest_phone || 'N/A'} <br />
                Comment: {bookingData?.notes || 'N/A'}
              </dd>
            </div>
            {/* Table Information */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Table Information</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                Date: {new Date(bookingData?.start).toLocaleDateString() || 'N/A'}
                <br />
                Time: {new Date(bookingData?.start).toLocaleTimeString() || 'N/A'}
                <br />
                Guest Count: {bookingData?.guest_count || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Progress Tracker */}
        <ProgressTracker progress={100} />
      </div>
    </div>
  );
}
