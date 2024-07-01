import useSWR from 'swr';

const baseUrl = 'http://localhost:8000';  // Setze hier deine API-Basis-URL ein

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useCreateBooking = () => {
  // Platzhalter-Funktion, die keine Aktion ausführt
  const createBooking = async (bookingData: any) => {
    // Hier könnte normalerweise eine API-Aufruf-Logik stehen, aber es wird nichts getan.
    console.log('bookingData:', bookingData); // Hier wird bookingData zumindest ausgegeben
  };

  // Hier wird useSWR ohne tatsächliche Verwendung initialisiert
  const { data, error } = useSWR(`${baseUrl}/bookings`, fetcher);

  return { createBooking, bookings: data, bookingsError: error };
};
