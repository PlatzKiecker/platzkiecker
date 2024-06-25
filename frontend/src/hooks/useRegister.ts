import { useState } from "react";

// Base URL of the backend
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

      const data = await response.json();

      // Throw an error if registration fails
      if (!response.ok) {
        setError(data.message || 'Failed to register');
      }



      return data;
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Expose the register function, along with SWR's data and error states
  return {
    register,
    error
  };
};
