import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import authService from "../services/authService";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    try {
      const response = await authService.resetPassword(token, password);
      setMessage(response.data.message || "Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Reset Password 🔐
          </h2>
          <p className="text-gray-600 mt-2">Set a strong new password below</p>
        </div>

        {message ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center bg-green-50 border border-green-200 rounded-xl p-5"
          >
            <p className="text-green-600 font-medium">{message}</p>
            <p className="mt-3 text-gray-600">
              Redirecting to{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-semibold hover:text-pink-500"
              >
                Login page
              </Link>
              ...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              Reset Password
            </motion.button>

            {error && (
              <p className="text-sm text-center text-red-600 bg-red-50 py-2 rounded-lg">
                ❌ {error}
              </p>
            )}
          </form>
        )}

        {/* Back to Login Link */}
        {!message && (
          <p className="text-center text-gray-700 mt-6 text-sm">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-pink-500 font-medium transition"
            >
              Back to Login
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
