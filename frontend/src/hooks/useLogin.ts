import { useState } from "react";

// Basis-URL des Backends
const BASE_URL = 'http://localhost:8000';

// Die Fetcher-Funktion nimmt eine URL und Optionen entgegen und gibt die Antwort als JSON zurück
const fetcher = (url: string, options: any) => {
  return fetch(url, options).then(res => res.json());
};

export const useLogin = () => {
  const [error, setError] = useState<Error | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const requestData = { email, password };
      console.log('Sending JSON data:', requestData); // Logging der zu sendenden Daten

      const response = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      if (response.ok) {
        // Benutzerdaten im localStorage speichern
        sessionStorage.setItem('userData', JSON.stringify(responseData));

        // SWR-Daten aktualisieren
        mutate('/api/login', responseData, false);
        return responseData;
      } else {
        throw new Error(responseData.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error; // Fehler weitergeben, um ihn in der Komponente behandeln zu können
    }
  };

  return {
    login,
    data,
    error
  };
};
