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
  const createBooking = async (bookingData: any) => {
    const url = `${baseUrl}/bookings`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    return response.json();
  };

  return { useCreateBooking };
};
