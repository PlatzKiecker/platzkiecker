import useSWR, { mutate } from "swr";

// Basis-URL des Backends
const BASE_URL = 'http://localhost:8000';

// Die Fetcher-Funktion nimmt eine URL und Optionen entgegen und gibt die Antwort als JSON zurück
const fetcher = (url: string, options: any) => {
  return fetch(url, options).then(res => res.json());
};

export const useLogin = () => {
  const { data, error } = useSWR('/api/login', fetcher, { revalidateOnFocus: false });

  const login = async (email: string, password: string) => {
    try {
      const requestData = { email, password };
      console.log('Sending JSON data:', requestData); // Logging der zu sendenden Daten

      const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

    const data = await response.json();
    if (response.ok) {
      mutate('/api/login', data, false);
      return data;
    } else {
      throw new Error(data.message || 'Failed to login');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Weiterhin den Fehler nach außen werfen, damit er in der Komponente behandelt werden kann
  }
};

  return {
    login,
    data,
    error
  };
};