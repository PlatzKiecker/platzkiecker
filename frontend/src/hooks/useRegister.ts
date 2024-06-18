import useSWR, { mutate } from 'swr';

// Die Fetcher-Funktion nimmt eine URL und Optionen entgegen und gibt die Antwort als JSON zurück
const fetcher = (url: string, options: any) => fetch(url, options).then(res => res.json());

// Custom Hook für die Registrierung
export const useRegister = () => {
  // Daten werden von '/api/register' abgerufen, erneute Validierung bei Fokuswechsel ist deaktiviert
  const { data, error } = useSWR('/api/register', fetcher, { revalidateOnFocus: false });

  // Asynchrone Funktion zur Registrierung eines neuen Benutzers
  const register = async (email: string, password: string) => {
    // Eine POST-Anfrage wird an '/api/register' mit den Benutzerdaten gesendet
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password}),
    });

    const data = await response.json();

    if (response.ok) {
      // Der SWR-Cache für '/api/register' wird aktualisiert
      mutate('/api/register');
      return data;
    } else {
      throw new Error(data.message || 'Failed to register');
    }
  };

  // Die register-Funktion, die abgerufenen Daten und eventuelle Fehler werden zurückgegeben
  return {
    register,
    data,
    error,
  };
};
