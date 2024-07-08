import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import mySWR from "../utils/mySWR";
import InputField from "../components/input/InputField";
import Button from "../components/input/Button";

export default function Booking() {
  const { id } = useParams(); // Get booking ID from route parameters
  const navigate = useNavigate();

  const { data: booking, loading, error, update, remove } = mySWR(`/bookings/detail/${id}/`);

  const [bookingData, setBookingData] = useState({
    guest_name: "",
    guest_phone: "",
    startDate: "",
    startTime: "",
    guestCount: 0,
    notes: "",
    table: 0,
    status: "PENDING",
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && !error && booking) {
      // Set data in the state when it has been loaded
      if (booking.start) {
        const startDate = new Date(booking.start);
        setBookingData({
          guest_name: booking.guest_name || "",
          guest_phone: booking.guest_phone || "",
          startDate: startDate.toISOString().split("T")[0], // Date as YYYY-MM-DD
          startTime: startDate.toISOString().split("T")[1].slice(0, 5), // Time as HH:mm
          guestCount: booking.guest_count || 0,
          notes: booking.notes || "",
          table: booking.table || 0,
          status: booking.status || "PENDING",
        });
      }
    }
  }, [loading, error, booking]);

  const handleInputChange = (value: string, name: string) => {
    if (name === "guest_name" || name === "guest_phone" || name === "notes" || name === "status") {
      setErrorMessage("");
      setBookingData({ ...bookingData, [name]: value });
    } else {
      setErrorMessage(`Cannot change ${name} field`);
    }
  };

  const handleUpdateBooking = () => {
    update(bookingData)
      .then(() => {
        // Optional: Feedback to the user that the booking has been updated
        console.log("Booking updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
        setErrorMessage("Failed to update booking. Please try again later.");
      });
  };

  // Delete the booking
  const handleDeleteBooking = () => {
    // Display popup for confirmation
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (confirmDelete) {
      // API call to delete the booking
      remove()
        .then(() => {
          // Navigate to the main page after deletion
          navigate("/");
        })
        .catch((error) => {
          console.error("Error deleting booking:", error);
          setErrorMessage("Failed to delete booking. Please try again later.");
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading indicator while data is being loaded
  }

  if (error) {
    return <div>Error loading booking details.</div>; // Error message if an error occurs
  }

  return (
    <div>
      {errorMessage && <div className="text-red-600 text-sm mb-4">{errorMessage}</div>}
      <header className="mb-10">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Edit booking</h1>
          <Button onClick={() => navigate("/")}>Back to Booking Overview</Button>
        </div>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">You can only change name, phone number, notes, and status</p>
      </header>
      {/* Form to edit booking details */}
      <div className="flex mb-4">
        <div className="mr-2">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <p>{bookingData.startDate}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <p>{bookingData.startTime}</p>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Guest Count</label>
        <p>{bookingData.guestCount}</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Table</label>
        <p>{bookingData.table}</p>
      </div>
      <div className="max-w-xl">
        <InputField label="Name" value={bookingData.guest_name} onChange={(value) => handleInputChange(value, "guest_name")} />
        <InputField label="Phone" value={bookingData.guest_phone} onChange={(value) => handleInputChange(value, "guest_phone")} />
        <InputField label="Notes" value={bookingData.notes} onChange={(value) => handleInputChange(value, "notes")} />
        {/* Status dropdown */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={bookingData.status}
            onChange={(e) => handleInputChange(e.target.value, "status")}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
      </div>
      {/* Update and delete buttons */}
      <div className="mt-6">
        <Button onClick={handleUpdateBooking}>Update booking</Button>
      </div>
      <div className="mt-4">
        <Button onClick={handleDeleteBooking} variant="danger">
          {" "}
          {/* Use "danger" (red) button */}
          Delete booking
        </Button>
      </div>
    </div>
  );
}
