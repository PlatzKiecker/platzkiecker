import useSWR, { mutate } from "swr";

// Base URL of the backend
const BASE_URL = 'http://localhost:8000';

// The fetcher function takes a URL and options, returning the response as JSON
const fetcher = (url: string, options: any) => {
  return fetch(url, options).then(res => res.json());
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
  
          // Invalidate the SWR cache for the login endpoint after successful logout
          mutate('/api/login', null, false);
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to logout');
        }
      } catch (error) {
        console.error('Error logging out:', error);
        throw error; // Continue to propagate the error for handling in components
      }
    };
  
    return {
      logout,
    };
  };
  