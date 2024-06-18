import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import InputField from '../components/input/InputField';
import { Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const { register, error } = useRegister();
  const navigate = useNavigate(); // Hook für Navigation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const data = await register(username, password, email);
      console.log('Registration successful:', data);
      // Navigiere zur Login-Seite nach erfolgreicher Registrierung
      navigate('/login');
    } catch (err: any) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField label="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />

            <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <InputField label="Confirm Password" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Register
              </button>
            </div>
          </form>

          {error && <p className="mt-2 text-center text-sm text-red-500">{error.message}</p>}

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
