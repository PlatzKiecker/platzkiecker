import useSWR, { mutate } from 'swr';

// Fetcher-Funktion, die eine URL und Optionen entgegennimmt und die Antwort als JSON zurückgibt
const fetcher = (url: string, options: any) => fetch(url, options).then(res => res.json());

// Custom Hook für die Registrierung
export const useRegister = () => {
  // Hole Daten von '/api/register' und deaktiviere die erneute Validierung bei Fokuswechsel
  const { data, error } = useSWR('/api/register', fetcher, { revalidateOnFocus: false });

  // Asynchrone Funktion zur Registrierung eines neuen Benutzers
  const register = async (username: string, password: string, email: string) => {
    // Sende POST-Anfrage an '/api/register' mit den Benutzerdaten
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    const data = await response.json();

    if (response.ok) {
      // Aktualisiere den SWR-Cache für '/api/register'
      mutate('/api/register');
      return data;
    } else {
      throw new Error(data.message || 'Failed to register');
    }
  };

  // Gebe die register-Funktion, die abgerufenen Daten und Fehler zurück
  return {
    register,
    data,
    error,
  };
};
