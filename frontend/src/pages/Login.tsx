import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import InputFieldLogin from '../components/input/InputFieldLogin';
import { Link } from 'react-router-dom';

export default function Login() {
  // Local state variables for input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Custom hook for logging in and handling errors
  const { login, error } = useLogin();

  // Hook for navigation within the application
  const navigate = useNavigate();

  // Event handler for form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Attempt to log in using provided username and password
      const data = await login(username, password);
      console.log('Login successful:', data);
      
      // Store the token in localStorage or context for authenticated sessions
      localStorage.setItem('token', data.token);
      
      // Navigate to the dashboard page upon successful login
      navigate('/');
    } catch (err: any) {
      // Handle login failure and log the error message
      console.error('Login failed:', err.message);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Company logo */}
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          {/* Title */}
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Input fields for username (email) and password */}
            
            <InputFieldLogin label="Email" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputFieldLogin label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            {/* Sign-in button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign in
              </button>
            </div>
          </form>

          {/* Display error message if login fails */}
          {error && <p className="mt-2 text-center text-sm text-red-500">{error.message}</p>}

          {/* Link to register page for new users */}
          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
