import { useState } from "react";

const BASE_URL = 'http://localhost:8000';

export const useRegister = () => {
  const [error, setError] = useState<Error | null>(null);

  // Function to register a new user with the provided email and password
  const register = async (email: string, password: string) => {
    try {
      const requestData = { email, password };

      // Sending a POST request to the backend to register the user
      const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // Überprüfe den Status der Antwort
      if (!response.ok) {
        const errorData = await response.json(); // Versuche, die Fehlermeldung zu extrahieren
        throw new Error(errorData.message || 'Failed to register');
      }

      // Überprüfe, ob die Antwort einen gültigen JSON-Body enthält
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
      return null; // Gib null zurück, um anzuzeigen, dass die Registrierung fehlgeschlagen ist
    }
  };

  // Expose the register function, along with SWR's data and error states
  return {
    register,
    error
  };
};