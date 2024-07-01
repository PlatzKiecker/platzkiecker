import { useState } from "react";

// Basis-URL des Backends
const BASE_URL = "http://localhost:8000";

export const useLogin = () => {
  const [error, setError] = useState<Error | null>(null);

  const login = async (email: string, password: string) => {
    try {
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
