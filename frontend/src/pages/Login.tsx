import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import InputFieldLogin from '../components/input/InputFieldLogin';
import { Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useLogin();
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      console.log('Login successful:', data);
      // Speichere den Token im Local Storage oder im Kontext
      localStorage.setItem('token', data.token);     
      // Navigiere zur Dashboard-Seite
      navigate('/');
    } catch (err: any) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputFieldLogin label="Email" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputFieldLogin label="Passwort" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign in
              </button>
            </div>
          </form>

          {error && <p className="mt-2 text-center text-sm text-red-500">{error.message}</p>}

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
