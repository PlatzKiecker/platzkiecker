import useSWR from "swr";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useCreateBooking = () => {
  const [error, setError] = useState<Error | null>(null);

  const newBooking = async (guest_name: string, guest_phone: string, start: string | Date, guest_count: number, notes: string) => {
    try {
      setError(null); // Fehler zurücksetzen, bevor die Anfrage gesendet wird.
      const startISO = start instanceof Date ? start.toISOString() : start;
      const bookingData = { guest_name, guest_phone, start: startISO, guest_count, notes };

      const response = await fetch(`${BASE_URL}/bookings/1/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();
      console.log(responseData);
      if (response.ok) return responseData;
      else setError(new Error(responseData.message || "Failed to create booking"));
    } catch (error) {
      setError(error as Error);
      throw error;
    }
  };

  return {
    newBooking,
    error,
  };
};
