import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { useLogin } from '../hooks/useLogin';
import InputField from '../components/input/InputField';
import { Link } from 'react-router-dom';

// TODO: Meldung wenn Email Adresse schon existiert + Meldung wenn Passwort nicht lang genug

// Main component for the registration form
export default function Register() {
  // Local state variables for input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  //const [error, setError] = useState<Error | null>(null);

  // Custom hook for registering and handling errors
  const { register, error} = useRegister();
  const { login } = useLogin();

  // Hook for navigation after registration
  const navigate = useNavigate();

  // Event handler for the form submit event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      // Attempt to register the user
      const data = await register(email, password);

      // Attempt to login the user immediately after successful registration
      const loginData = await login(email, password);
      localStorage.setItem('token', loginData.token);

      // Navigate to home page after successful registration and login
      navigate('/');
    } catch (err: any) {
      // Error handling for failed registration
      console.error('Registration failed:', err.message);
    }
  };

  // Rendering the component
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Logo */}
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          {/* Title */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Registration form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Input fields for Email, Password, and Confirm Password */}
            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <InputField label="Confirm Password" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            {/* Registration button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Register
              </button>
            </div>
          </form>

          {/* Display error message if registration fails */}
          {error && (
            <p className="mt-2 text-center text-sm text-red-500">{error}</p>
          )}


          {/* Link to the login page for already registered members */}
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
