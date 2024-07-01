import { useState } from "react";
import ProgressTracker from "../components/layout/ProgressTracker";
import GuestCountDropdown from "../components/input/GuestCountDropdown";
import { useNavigate } from "react-router-dom";

export default function TableDetails() {
  const [guestCount, setGuestCount] = useState<number>(1);
  const navigate = useNavigate();

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      navigate("/GuestBooking"); // Navigate to '/GuestBooking'
    } catch (err: any) {
      console.error("Navigation failed:", err.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen p-4">
      <div className="bg-gray-100 p-6 w-full max-w-4xl h-auto max-h-screen overflow-auto mx-auto">
        {/* Header */}
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Online Reservation</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Please fill in more details for your reservation.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Add onSubmit to the form */}
          <div className="mt-6 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              {/* Guest Count Dropdown */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Anzahl Gaeste</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <GuestCountDropdown onChange={handleGuestCountChange} />
                  <p>Guest Count: {guestCount}</p>
                </dd>
              </div>

              {/* Date Input */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Date</dt>
              </div>

              {/* Time Input */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Time</dt>
              </div>

              {/* Table Details- Submit -Button */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Submit Table Information
                </button>
              </div>
            </dl>
          </div>
        </form>

        {/* Divider Line */}
        <div className="border-t border-gray-600 mt-6 pt-6"></div>

        {/* Progress Tracker */}
        <ProgressTracker progress={33.3} />
      </div>
    </div>
  );
}
