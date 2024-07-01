import { useState } from "react";

const BASE_URL = 'http://localhost:8000';

export const useRegister = () => {
  const [error, setError] = useState<Error | null>(null);

  // Function to register a new user with the provided email and password
  const register = async (email: string, password: string) => {
    try {
      setError(null); // Fehler zurücksetzen, bevor die Anfrage gesendet wird.
      const requestData = { email, password };


      // Sending a POST request to the backend to register the user
      const response = await fetch(`${BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      if (response.ok) return responseData;
      else setError(new Error(responseData.message || "Failed to register"));
    } catch (error) {
      throw error;
    }
  };

  // Expose the register function, along with SWR's data and error states
  return {
    register,
    error
  };
};