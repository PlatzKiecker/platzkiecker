import React from "react";
import ProgressTracker from "../components/layout/ProgressTracker";

export default function GuestConfirmation() {
  // Retrieve booking information from sessionStorage
  const bookingResponse = sessionStorage.getItem('bookingResponse');
  const bookingData = bookingResponse ? JSON.parse(bookingResponse).data : null;

  // Function to format time to HH:mm
  const formatTime = (datetimeString: string) => {
    return new Date(datetimeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex items-center justify-center w-full h-screen p-4 bg-gray-100">
      <div className="p-6 w-full max-w-4xl h-auto max-h-screen overflow-auto bg-white rounded-lg shadow-md mx-auto">
        {/* Header */}
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-semibold text-gray-900">Online Reservation</h3>
          <p className="mt-2 text-sm text-gray-600">Thank you for your reservation. Please find your booking details below. If you'd like to make any changes, please contact us.</p>
        </div>

        {/* Form Section */}
        <div className="mt-6 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            {/* Guest Information */}
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium leading-6 text-gray-900">Guest Information</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2">
                <p><span className="font-medium">Name:</span> {bookingData?.guest_name || 'N/A'}</p>
                <p><span className="font-medium">Phone Number:</span> {bookingData?.guest_phone || 'N/A'}</p>
                <p><span className="font-medium">Comment:</span> {bookingData?.notes || 'N/A'}</p>
              </dd>
            </div>
            {/* Table Information */}
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium leading-6 text-gray-900">Table Information</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2">
                <p><span className="font-medium">Date:</span> {new Date(bookingData?.start).toLocaleDateString() || 'N/A'}</p>
                <p><span className="font-medium">Time:</span> {formatTime(bookingData?.start) || 'N/A'}</p>
                <p><span className="font-medium">Guest Count:</span> {bookingData?.guest_count || 'N/A'}</p>
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
