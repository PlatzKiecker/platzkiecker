import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputFieldLogin from '../components/input/InputFieldLogin';
import { Link } from 'react-router-dom';
import { postRequest } from '../utils/mySWR';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setError(null);
      const registerData = await postRequest('/register/', { email, password });

      if (registerData) {
        const loginData = await postRequest('/login/', { email, password });
        if (loginData) {
          console.log('Login successful after registration:', loginData);
          
          // Create Restaurant
          const restaurantData = await postRequest('/restaurant/', { name: "Restaurant-Name" });
          if (!restaurantData) {
            setError("Failed to create restaurant");
            return;
          }

          // Create Zone
          const zoneData = await postRequest('/zones/', { name: "Zone 1", bookable: true });
          if (!zoneData) {
            setError("Failed to create zone");
            return;
          }

          navigate('/settings');
        } else {
          setError("Failed to login after registration");
        }
      } else {
        setError("Failed to register");
      }
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      setError(error.message || "Failed to register");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputFieldLogin label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <InputFieldLogin label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <InputFieldLogin label="Confirm Password" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Register
              </button>
            </div>
          </form>
          {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
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
