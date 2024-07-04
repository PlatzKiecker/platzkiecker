import { useState } from "react";

// Basis-URL des Backends
const BASE_URL = "http://localhost:8000";
//const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const useLogin = () => {
  const [error, setError] = useState<Error | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setError(null); // Fehler zurücksetzen, bevor die Anfrage gesendet wird.
      const requestData = { email, password };

      const response = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      if (response.ok) return responseData;
      else setError(new Error(responseData.message || "Failed to login"));
    } catch (error) {
      throw error;
    }
  };

  return {
    login,
    error,
  };
};
