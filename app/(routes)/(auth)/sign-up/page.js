'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    if (!form.email) return setError('Please enter your email first.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth-otp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setSuccess('OTP sent! Check your email.');
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (!otp) return setError('Please enter the OTP sent to your email.');

    setLoading(true);
    try {
      const res = await fetch('/api/auth-otp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
          otp,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Account created! Redirecting...');
        setTimeout(() => router.push('/sign-in'), 2000);
      } else {
        setError(data.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong during OTP verification.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decode = jwtDecode(token);
        if (decode.email || decode.username) router.replace('/dashboard');
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 max-w-md w-full border dark:border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-700 dark:text-blue-400">
          Create an Account
        </h1>

        {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-4 py-2 rounded mb-4">{success}</div>}

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* OTP Section */}
          {otpSent && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          )}

          {!otpSent && (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-300"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          )}

          <button
            type="submit"
            className={`w-full ${otpSent ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-semibold py-2 rounded-lg transition duration-300`}
            disabled={!otpSent || loading}
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
