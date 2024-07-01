import useSWR, { mutate } from "swr";

const BASE_URL = 'http://localhost:8000';

const fetcher = async (url: string, options: any) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch data');
  }

  return response.json();
};

export const useLogin = () => {
  const { data, error } = useSWR('/api/login', fetcher, { revalidateOnFocus: false });

  const login = async (email: string, password: string) => {
    try {
      const requestData = { email, password };

      const response = await fetch(`${BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // Überprüfe den Status der Antwort, bevor du versuchst, sie als JSON zu parsen
      const responseText = await response.text(); // Hole die Antwort als Text
      console.log('Server response:', responseText); // Logge die Antwort

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText); // Versuche die Fehlermeldung zu parsen
        } catch (e) {
          throw new Error('Failed to login: ' + responseText); // Gib den rohen Antworttext im Fehlerfall aus
        }
        throw new Error(errorData.message || 'Failed to login');
      }

      const responseData = JSON.parse(responseText); // Parse die Antwort nur wenn sie ok ist

      // Speichere den Token in localStorage
      localStorage.setItem('authToken', responseData.token);

      // Aktualisiere die SWR-Cache-Daten nach erfolgreichem Login
      mutate('/api/login', responseData, false);

      return responseData;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error; // Weitergabe des Fehlers für die Behandlung in Komponenten
    }
  };

  return {
    login,
    data,
    error,
  };
};
