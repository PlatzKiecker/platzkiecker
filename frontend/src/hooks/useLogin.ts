import useSWR, { mutate } from "swr";

// Base URL of the backend
const BASE_URL = 'http://localhost:8000';

// The fetcher function takes a URL and options, returning the response as JSON
const fetcher = (url: string, options: any) => {
  return fetch(url, options).then(res => res.json());
};

export const useLogin = () => {
  const { data, error } = useSWR('/api/login', fetcher, { revalidateOnFocus: false });

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
        mutate('/api/login', data, false);
        return data;
      } else {
        throw new Error(data.message || 'Failed to login');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw error; // Continue to propagate the error for handling in components
    }
  };

  // Expose the login function, along with SWR's data and error states
  return {
    login,
    data,
    error,
  };
};
