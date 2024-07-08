import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../components/layout/Page";
import InputFieldLogin from "../components/input/InputFieldLogin";
import { postRequest } from "../utils/mySWR";
import mySWR from "../utils/mySWR";

// Function to get today's date in "YYYY-MM-DD" format
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  return `${year}-${month}-${day}`;
}

function bookablePeriods(count: number) {
  const startDate = new Date();
  const { data, error, loading } = mySWR(`/available-days/1/?guest_count=${count}&start_day=${startDate.toISOString().split('T')[0]}`);
  return { data, error, loading };
}

export default function NewBooking() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reservationDetails, setReservationDetails] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [responseMsg, setResponseMsg] = useState<string | null>(null); // State to hold response message
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [bookableDays, setBookableDays] = useState<string[]>([]);
  const [bookableTimes, setBookableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  // Fetch bookable days and times
  const { data: bookableDaysData } = bookablePeriods(Number(guestCount));
  const { data: bookableTimesData } = mySWR(
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

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate guest count
    if (isNaN(Number(guestCount)) || guestCount.trim() === "") {
      setResponseMsg("Please enter a valid number for the guest count.");
      return;
    }

    const combinedDateTime = combineDateTime(selectedDate, selectedTime);

    try {
      const bookingData = {
        guest_name: fullName,
        guest_phone: phoneNumber,
        start: combinedDateTime,
        guest_count: parseInt(guestCount),
        notes: reservationDetails,
      };
      const response = await postRequest(`/bookings/1/`, bookingData);
      console.log("Booking created:", response.data);
      if (response.data.guest_count && response.data.guest_count.length > 0) {
        const errorMessage = response.data.guest_count[0];
        setResponseMsg(errorMessage);
      } else {
        setResponseMsg("Booking created successfully"); 
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
  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (bookableDays.includes(date)) {
      setSelectedDate(date);
      setErrorMessage(""); // Clear error message if the date is valid
      console.log("Fetching bookable times for date:", date);
    } else {
      setSelectedDate(""); // Clear the date if it's not bookable
      setErrorMessage("Selected date is not available for booking.");
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

  const closePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <Page title="Create booking">  
      <form onSubmit={handleBooking} className="max-w-xl">
        <div className="grid grid-cols-1 gap-4">
        
          {/* Booking Details */}
          <InputFieldLogin label="Number of guests*" name="guestCount" value={guestCount} onChange={handleGuestCountChange} />
          <div>
            <label className="text-sm font-medium leading-6 text-gray-900">Date of Reservation*</label>
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
          </div>
          <div>
            <label className="text-sm font-medium leading-6 text-gray-900">Available Timeslots</label>
            {bookableTimes.length > 0 ? (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {bookableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelection(time)}
                      className={`p-2 border rounded ${selectedTime === time ? 'bg-indigo-500 text-white' : 'bg-white text-gray-900'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-red-500">
                {guestCount.trim() === "" ? "Please enter the number of guests." : "No tables available for this date and number of guests."}
              </p>
            )}
          </div>
          {/* Table Details */}
          <InputFieldLogin label="Name*" name="fullName" value={fullName} onChange={handleFullNameChange} />
          <InputFieldLogin label="Phone number*" name="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} />
          <InputFieldLogin label="Notes" name="reservationDetails" value={reservationDetails} onChange={handleReservationDetailsChange} nonRequired/>
          {responseMsg && <p className="text-red-600">{responseMsg}</p>} {/* Display response message */}
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">*required fields</p>
           {/* Submit button */}
          <div className="mt-4">
            <button
              type="submit"
              className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Create Booking
            </button>
          </div>
        </div>
      </form>
      {/* Popup to show booking success */}
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
