import { useState } from "react";

// Base URL of the backend
const BASE_URL = "http://localhost:8000";

export const useLogin = () => {
  const [error, setError] = useState<Error | null>(null);

  // Function to log in the user with the provided email and password
  const login = async (email: string, password: string) => {
    try {
      const requestData = { email, password };

      // Sending a POST request to the backend to log in the user
      const response = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      // Throw an error if registration fails
      if (!response.ok) {
        setError(data.message || "Failed to login");
      }
      return data;
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Expose the login function, along with SWR's data and error states
  return {
    login,
    error,
  };
};
