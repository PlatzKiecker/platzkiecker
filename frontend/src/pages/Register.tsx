import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { useLogin } from '../hooks/useLogin';
import InputFieldLogin from '../components/input/InputFieldLogin';
import { Link } from 'react-router-dom';

// Hauptkomponente für das Registrierungsformular
export default function Register() {
  // Lokale State-Variablen für die Eingabefelder
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  //const [error, setError] = useState<Error | null>(null);

  // Custom Hook zum Registrieren und Abfangen von Fehlern
  const { register, error } = useRegister();
  const { login } = useLogin();
  
  // Hook für die Navigation nach der Registrierung
  const navigate = useNavigate();

  // Event-Handler für das Fo nurrmular-Submit-Event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Überprüfen, ob die Passwörter übereinstimmen
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      // Versuche, den Benutzer zu registrieren
      const data = await register(email, password);
      console.log('Registration successful:', data);
      // Versuche, den Benutzer automatisch einzuloggen nach erfolgreicher Registrierung
      const loginData = await login(email, password);
      console.log('Login successful after registration:', loginData);
      // Speichere den Token im Local Storage oder im Kontext
      const token = loginData.token; // Annahme: loginData enthält das Token
      localStorage.setItem('token', token); // Speichern im Local Storage
      navigate('/');
    } catch (err: any) {
      // Fehlerbehandlung bei fehlgeschlagener Registrierung
      console.error('Registration failed:', err.message);
    }
  };

  // Rendering der Komponente
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Logo */}
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          {/* Titel */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Formular für die Registrierung */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Eingabefelder für Email, Passwort und Passwortbestätigung */}

            <InputFieldLogin label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <InputFieldLogin label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <InputFieldLogin label="Confirm Password" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            {/* Registrierungs-Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Register
              </button>
            </div>
          </form>

          {/* Anzeige einer Fehlermeldung, falls vorhanden */}
          {error && <p className="mt-2 text-center text-sm text-red-500">{error.message}</p>}

          {/* Link zur Login-Seite für bereits registrierte Benutzer */}
          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{" "}
            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
