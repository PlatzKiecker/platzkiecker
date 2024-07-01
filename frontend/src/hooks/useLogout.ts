import useSWR, { mutate } from "swr";

// Base URL of the backend
const BASE_URL = 'http://localhost:8000';

// The fetcher function takes a URL and returns the response as JSON
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

// Hook for logging out the user
export const useLogout = () => {
  // Function to log out the user
  const logout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the token from local storage (or cookies)
        localStorage.removeItem('authToken'); // Adjust 'authToken' based on how you store your token
        
        // Invalidate the SWR cache for the user data endpoint after successful logout
        mutate('/api/userData'); // Assuming this is the endpoint for user data

      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to logout');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      throw error; // Continue to propagate the error for handling in components
    }
  };

  // Example usage of useSWR for fetching user data after logout
  const { data: userData, error: userError } = useSWR('/api/userData', fetcher);

  return {
    logout,
    userData,
    userError,
  };
};
