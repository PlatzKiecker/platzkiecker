import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressTracker from "../components/Layout/ProgressTracker";
import GuestCountDropdown from "../components/input/GuestCountDropdown";

export default function GuestDetails() {
  const [guestCount, setGuestCount] = useState<number>(1);
  const navigate = useNavigate();

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
  };

  const handleSubmit = () => {
    // Perform any necessary form validation or data handling here

    // Navigate to the /guestbooking route
    navigate("/guestbooking");
  };

  return (
    <div className="flex items-center justify-center w-full h-screen p-4">
      <div className="bg-gray-100 p-6 w-full max-w-4xl h-auto max-h-screen overflow-auto mx-auto">
        {/* Header */}
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Online Reservation</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">For more than 10 guests please call us directly.</p>
        </div>

        {/* Form Section */}
        <div className="mt-6 border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            {/* Guest Count Dropdown */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Number Guest</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <GuestCountDropdown onChange={handleGuestCountChange} />
                <p>Guest Count: {guestCount} </p>
              </dd>
            </div>
            {/* Date Input */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Date and Time</dd>
            </div>
            {/* Table Details- Submit -Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button" // Change type to 'button'
                onClick={handleSubmit} // Call handleSubmit function on click
                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Submit Table Information
              </button>
            </div>
          </dl>
        </div>
        {/* Divider Line */}
        <div className="border-t border-gray-600 mt-6 pt-6"></div>
        {/* Progress Tracker */}
        <ProgressTracker progress={33.3} />
      </div>
    </div>
  );
}
