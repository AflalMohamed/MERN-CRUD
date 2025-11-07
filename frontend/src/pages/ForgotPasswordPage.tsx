import React, { useState } from 'react';
import authService from '../services/authService';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.data.message);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setMessage('If an account with that email exists, a password reset link has been sent.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Forgot Password
        </h2>

        <p className="mt-3 text-center text-gray-600">
          Enter your registered email address to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-green-600 font-medium bg-green-50 p-2 rounded-lg border border-green-200">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 text-center text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline hover:text-blue-800 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
