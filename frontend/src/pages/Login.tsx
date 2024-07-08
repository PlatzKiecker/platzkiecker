import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputFieldLogin from "../components/input/InputFieldLogin";
import { Link } from "react-router-dom";
import { postRequest } from "../utils/mySWR";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();

  // Send the login request to the server
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null); // Reset error state before sending the request.
      const requestData = { email: username, password };

      const response = await postRequest("/login/", requestData);
      if (response.data) {
        console.log("Login successful:", response.data);
        navigate("/");
      } else {
        setError("Failed to login"); // Set generic error message
      }
    } catch (error: any) { // Catch any type of error
      console.error("Login failed:", error.message);
      setError("Failed to login"); // Set generic error message
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
        </div>
        {/* Login form */}
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputFieldLogin label="Email" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <InputFieldLogin label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign in
              </button>
            </div>
          </form>
          {/* Error message */}
          {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
          {/* Register link */}
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
