import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProgressTracker from "../components/layout/ProgressTracker";
import GuestCountDropdown from "../components/input/GuestCountDropdown";
import mySWR from "../utils/mySWR";

// Function to get today's date in "YYYY-MM-DD" format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month: string | number = today.getMonth() + 1;
  let day: string | number = today.getDate();
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
}

export default function TableDetails() {
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [bookableDays, setBookableDays] = useState<string[]>([]);
  const [bookableTimes, setBookableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  // Fetch bookable days and times
  const { data: bookableDaysData, error: bookableDaysError, loading: bookableDaysLoading } = bookablePeriods(guestCount);
  const { data: bookableTimesData, error: bookableTimesError, loading: bookableTimesLoading } = mySWR(
    selectedDate ? `/available-timeslots/1/?guest_count=${guestCount}&start_day=${selectedDate}` : null
  );

  useEffect(() => {
    if (bookableDaysData && bookableDaysData.available_days) {
      setBookableDays(bookableDaysData.available_days);
    }
  }, [bookableDaysData]);

  useEffect(() => {
    if (bookableTimesData && bookableTimesData.free_slots) {
      const startTimes = bookableTimesData.free_slots.map((slot: { start: string }) => slot.start);
      setBookableTimes(startTimes);
    } else {
      setBookableTimes([]);
    }
  }, [bookableTimesData]);

  const handleGuestCountChange = (count: number) => {
    setGuestCount(count);
  };

  const handleSubmit = () => {
    const combinedDateTime = combineDateTime(selectedDate, selectedTime);

    // Log the selected values for verification
    console.log("Guest Count:", guestCount);
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    console.log("Combined DateTime:", combinedDateTime);

    // Navigate to the '/guestbooking' route with the selected values
    navigate("/guestbooking", { state: { guestCount, combinedDateTime } });
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (bookableDays.includes(date)) {
      setSelectedDate(date);
      setErrorMessage(""); // Clear error message if the date is valid
      console.log("Fetching bookable times for date:", date);
    } else {
      setSelectedDate(""); // Clear the date if it's not bookable
      setErrorMessage("Selected date is not available for booking. Please select another day or minimize the number of guests."); // Set error message
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const combineDateTime = (date: string, time: string) => {
    if (!date || !time) return "";
    const dateTimeString = `${date}T${time}:00`;
    return dateTimeString;
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
                  min={getTodayDate()} // Only future dates are selectable
                  onChange={handleDateChange}
                />
                {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
              </dd>
            </div>
            {/* Time Selection */}
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Timeslots</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {bookableTimes.length > 0 ? (
                  <>
                    <p>{selectedDate ? `Timeslot for ${selectedDate}` : 'Select a date to see available timeslots'}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {bookableTimes.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelection(time)}
                          className={`p-2 border rounded ${selectedTime === time ? 'bg-indigo-500 text-white' : 'bg-white text-gray-900'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-red-500">No tables available for this date and number of guests. Please select another date or reduce the number of guests.</p>
                )}
              </dd>
            </div>
            {/* Table Details- Submit -Button */}
            <div className="flex justify-end mt-4">
              <button
                type="button" 
                onClick={handleSubmit} 
                className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
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
  const { data, error, loading } = mySWR(`/available-days/1/?guest_count=${count}&start_day=${startDate.toISOString().split('T')[0]}`);
  return { data, error, loading }; 
}
