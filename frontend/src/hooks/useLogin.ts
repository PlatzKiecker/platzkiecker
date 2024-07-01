import useSWR, { mutate } from "swr";
<<<<<<< Updated upstream
=======
import { useState } from "react";
>>>>>>> Stashed changes

// Base URL of the backend
const BASE_URL = 'http://localhost:8000';

// The fetcher function takes a URL and options, returning the response as JSON
const fetcher = (url: string, options: any) => {
  return fetch(url, options).then(res => res.json());
};

export const useLogin = () => {
  const { data, error } = useSWR('/api/login', fetcher, { revalidateOnFocus: false });
<<<<<<< Updated upstream
=======
  const [loginError, setLoginError] = useState<string | null>(null);
>>>>>>> Stashed changes

  // Function to log in the user with the provided email and password
  const login = async (email: string, password: string) => {
    try {
      const requestData = { email, password };

      // Sending a POST request to the backend to log in the user
      const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      // Invalidate the SWR cache for the login endpoint after successful login
      if (response.ok) {
<<<<<<< Updated upstream
        mutate('/api/login', data, false);
        return data;
      } else {
        throw new Error(data.message || 'Failed to login');
      }
    } catch (error) {
=======
        setLoginError(null); // Clear any previous errors
        localStorage.setItem('authToken', data.token); // Store the token
        mutate('/api/login', data, false);
        return data;
      } else {
        throw new Error(data.non_field_errors?.[0] || data.message || 'Failed to login');
      }
    } catch (error: any) {
      setLoginError(error.message); // Set the error message
>>>>>>> Stashed changes
      console.error('Error logging in:', error);
      throw error; // Continue to propagate the error for handling in components
    }
  };

  // Expose the login function, along with SWR's data and error states
  return {
    login,
    data,
    error,
    loginError,
  };
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
        localStorage.removeItem('authToken'); // Adjust this line if you are using cookies or another method to store the token

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
