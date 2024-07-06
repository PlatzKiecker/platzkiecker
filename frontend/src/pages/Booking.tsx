import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import mySWR from "../utils/mySWR";
import InputField from "../components/input/InputField";
import Button from "../components/input/Button";

export default function Booking() {
  const { id } = useParams(); // Buchungs-ID aus den Routenparametern holen
  const navigate = useNavigate(); // Hook zum Navigieren zwischen Routen

  const { data: booking, loading, error, update, remove } = mySWR(`/bookings/detail/${id}/`);

  const [bookingData, setBookingData] = useState({
    guest_name: "",
    guest_phone: "",
    startDate: "",
    startTime: "",
    guestCount: 0,
    notes: "",
    table: 0,
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && !error && booking) {
      // Daten in den State setzen, wenn sie geladen wurden
      if (booking.start) {
        const startDate = new Date(booking.start);
        setBookingData({
          guest_name: booking.guest_name || "",
          guest_phone: booking.guest_phone || "",
          startDate: startDate.toISOString().split('T')[0], // Datum als YYYY-MM-DD
          startTime: startDate.toISOString().split('T')[1].slice(0, 5), // Zeit als HH:mm
          guestCount: booking.guest_count || 0,
          notes: booking.notes || "",
          table: booking.table || 0,
        });
      }
    }
  }, [loading, error, booking]);

  const handleInputChange = (value, name) => {
    if (name === "startDate" || name === "startTime" || name === "table") {
      setErrorMessage(`Cannot change ${name} field`);
    } else {
      setErrorMessage("");
    }
  };

  const handleNameChange = (value) => {
    setBookingData({ ...bookingData, guest_name: value });
  };

  const handlePhoneChange = (value) => {
    setBookingData({ ...bookingData, guest_phone: value });
  };

  const handleNotesChange = (value) => {
    setBookingData({ ...bookingData, notes: value });
  };

  const handleUpdateBooking = () => {
    // Logik zum Aktualisieren der Buchung
    update(bookingData)
      .then(() => {
        // Optional: Feedback an den Benutzer, dass die Buchung aktualisiert wurde
        console.log("Booking updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating booking:", error);
        setErrorMessage("Failed to update booking. Please try again later.");
      });
  };

  const handleDeleteBooking = () => {
    // Popup zur Bestätigung anzeigen
    const confirmDelete = window.confirm("Are you sure you want to delete this booking?");
    if (confirmDelete) {
      // API-Aufruf zum Löschen der Buchung
      remove()
        .then(() => {
          // Nach dem Löschen zur Hauptseite navigieren
          navigate("/");
        })
        .catch((error) => {
          console.error("Error deleting booking:", error);
          setErrorMessage("Failed to delete booking. Please try again later.");
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Ladeanzeige, solange die Daten geladen werden
  }

  if (error) {
    return <div>Error loading booking details.</div>; // Fehlermeldung, falls ein Fehler auftritt
  }

  return (
    <div>
      {errorMessage && (
        <div className="text-red-600 text-sm mb-4">{errorMessage}</div>
      )}
      <header className="mb-10">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Edit booking</h1>
          <Button onClick={() => navigate("/")}>Back to Booking Overview</Button>
        </div>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">You can only change name, phonenumber and notes</p>
      </header>
      <div className="max-w-xl">
        <InputField
          label="Name"
          name="guest_name"
          value={bookingData.guest_name}
          onChange={handleNameChange}
        />
        <InputField
          label="Phone"
          name="guest_phone"
          value={bookingData.guest_phone}
          onChange={handlePhoneChange}
        />
        <div className="flex">
          <div className="mr-2">
            <InputField
              label="Date"
              type="date"
              name="startDate"
              value={bookingData.startDate}
              onChange={(value) => handleInputChange(value, "startDate")}
            />
          </div>
          <div>
            <InputField
              label="Time"
              type="time"
              name="startTime"
              value={bookingData.startTime}
              onChange={(value) => handleInputChange(value, "startTime")}
            />
          </div>
        </div>
        <InputField
          label="Guest Count"
          name="guestCount"
          value={bookingData.guestCount}
          onChange={(value) => handleInputChange(value, "guestCount")}
        />
        <InputField
          label="Notes"
          name="notes"
          value={bookingData.notes}
          onChange={handleNotesChange}
        />
        <InputField
          label="Table"
          name="table"
          value={bookingData.table}
          onChange={(value) => handleInputChange(value, "table")}
        />
      </div>
      <div className="mt-6">
        <Button onClick={handleUpdateBooking}>Update booking</Button>
      </div>
      <div className="mt-4">
        <Button onClick={handleDeleteBooking} variant="danger"> {/* Verwendung des "danger" (rot) Button */}
          Delete booking
        </Button>
      </div>
    </div>
  );
}
