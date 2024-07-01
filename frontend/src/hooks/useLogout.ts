import { useState } from "react";

const BASE_URL = 'http://localhost:8000';

// Hook for logging out the user
export const useLogout = () => {
  const [error, setError] = useState<Error | null>(null);

  // Function to log out the user
  const logout = async () => {
    try {
      setError(null);

      const response = await fetch(`${BASE_URL}/logout/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Important for sending cookies
      });

      if (response.ok) {
        // Clear authentication data from storage
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('auth');
        localStorage.removeItem('authToken');
        document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      } else {
        const responseData = await response.json();
        setError(new Error(responseData.message || "Failed to logout"));
      }
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return {
    logout,
    error,
  };
};
