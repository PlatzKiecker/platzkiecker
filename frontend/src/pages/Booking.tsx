import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import mySWR from "../utils/mySWR";
import InputField from "../components/input/InputField";
import Button from "../components/input/Button";

export default function Booking() {
  const { id } = useParams(); // Buchungs-ID aus den Routenparametern holen
  const navigate = useNavigate(); // Hook zum Navigieren zwischen Routen

  const { data: booking, loading, error, remove } = mySWR(`/bookings/detail/${id}/`);

  const [bookingData, setBookingData] = useState({
    guestName: "",
    guestPhone: "",
    startDate: "",
    startTime: "",
    guestCount: 0,
    notes: "",
    table: 0,
  });

  useEffect(() => {
    if (!loading && !error && booking) {
      // Daten in den State setzen, wenn sie geladen wurden
      const startDate = new Date(booking.start);
      setBookingData({
        guestName: booking.guest_name,
        guestPhone: booking.guest_phone,
        startDate: startDate.toISOString().split('T')[0], // Datum als YYYY-MM-DD
        startTime: startDate.toISOString().split('T')[1].slice(0, 5), // Zeit als HH:mm
        guestCount: booking.guest_count,
        notes: booking.notes,
        table: booking.table,
      });
    }
  }, [loading, error, booking]);

  const handleUpdateBooking = () => {
    // Logik zum Aktualisieren der Buchung
    // Hier könntest du die update-Funktion aus mySWR verwenden oder eine andere Logik implementieren
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
          // Hier könntest du eine Fehlermeldung anzeigen
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
      <header className="mb-10">
        <div className="mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Edit booking</h1>
          <Button onClick={handleDeleteBooking}>
            Delete booking
          </Button>
        </div>
      </header>
      <div className="max-w-xl">
        <InputField label="Name" value={bookingData.guestName} />
        <InputField label="Phone" value={bookingData.guestPhone} />
        <div className="flex">
          <div className="mr-2">
            <InputField label="Date" type="date" value={bookingData.startDate} />
          </div>
          <div>
            <InputField label="Time" type="time" value={bookingData.startTime} />
          </div>
        </div>
        <InputField label="Guest Count" value={bookingData.guestCount.toString()} />
        <InputField label="Notes" value={bookingData.notes} />
        <InputField label="Table" value={bookingData.table.toString()} />
      </div>

      <div className="mt-10">
        <Button onClick={handleUpdateBooking}>Update booking</Button>
      </div>
    </div>
  );
}
