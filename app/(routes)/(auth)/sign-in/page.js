'use client';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import { jwtDecode } from 'jwt-decode';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const {setEmail} = useGlobalContextProvider();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email:userEmail, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      setEmail(userEmail)
      router.push('/dashboard');
    } else {
      setError(data.message || 'Login failed');
    }
    //setIsLoading(false)
  };

  // if user is alreay logged in then redirect user to dashbaord
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      try {
        const decode = jwtDecode(token);
        if (decode.email || decode.username) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        // Optional: localStorage.removeItem("token"); // to clear bad token
      }
    }
  }, []);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Login</h1>
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUserEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition text-center"
            disabled={isLoading}
          >
            {isLoading ? ('Authernticating...') : ("Login")}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/sign-up" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
