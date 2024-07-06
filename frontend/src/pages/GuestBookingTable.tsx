import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressTracker from "../components/layout/ProgressTracker";
import GuestCountDropdown from "../components/input/GuestCountDropdown";
import mySWR from "../utils/mySWR";

export default function GuestDetails() {
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(""); // State für ausgewähltes Datum
  const navigate = useNavigate();
  const { data, error, loading } = bookablePeriods(guestCount);

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
  };

  const handleSubmit = () => {
    // Perform any necessary form validation or data handling here

    // Navigate to the /guestbooking route
    navigate("/guestbooking");
  };

  // Funktion, um das heutige Datum im richtigen Format für das min-Attribut zu bekommen
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Füge führende Nullen hinzu, wenn der Monat oder der Tag einstellig ist
    // Funktioniert aus irgendeinem Grund nur wenn das hier als Fehler hinterlegt ist
    /*if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }*/

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (data) {
      const setbookableDays = data;
      console.log("Bookable days:", setbookableDays);
    }
  }, [data]);

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
              <dt className="text-sm font-medium leading-6 text-gray-900">Date</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="date"
                  id="bookingDate"
                  name="bookingDate"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter value"
                  value={selectedDate}
                  min={getTodayDate()} // Nur zukünftige Termine sind auswählbar
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </dd>
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

function bookablePeriods(count: number) {
  const startDate = new Date();
  const { data, error, loading } = mySWR(`/available-days/1/?guest_count=2&start_day=2024-07-06`);

  return { data, error, loading }; // Return these if needed
}
