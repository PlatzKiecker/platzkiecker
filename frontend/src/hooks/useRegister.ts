import useSWR, { mutate } from 'swr';

// Basis-URL des Backends
const BASE_URL = 'http://localhost:8000';

// Die Fetcher-Funktion nimmt eine URL und Optionen entgegen und gibt die Antwort als JSON zurück
const fetcher = (url: string, options: any) => {
  return fetch(url, options).then(res => res.json());
};

export const useRegister = () => {
  const { data, error } = useSWR('/api/register', fetcher, { revalidateOnFocus: false });

  const register = async (email: string, password: string) => {
    try {
      const requestData = { email, password };
      console.log('Sending JSON data:', requestData); // Logging der zu sendenden Daten

      const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      mutate('/api/register');
      return data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error; // Weiterhin den Fehler nach außen werfen, damit er in der Komponente behandelt werden kann
    }
  };

  return {
    register,
    data,
    error,
  };
};
