import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-4xl bg-[var(--color-accent)] text-white rounded-2xl 
  shadow-[0_0_20px_rgba(0,0,0,0.4)] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Logo */}
        <div className="md:w-2/5 bg-[var(--color-bg)] flex items-center justify-center p-6">
            <img
                src="/LCCG-Logo.png"
                alt="LCCG Logo"
                className="w-full max-w-sm object-contain"
            />
            </div>
        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-[var(--color-primary)]">Admin Login</h2>

          <form className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-[var(--color-primary)]">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)]"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[var(--color-primary)]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-primary)]"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded bg-[var(--color-primary)] text-[var(--color-accent)] font-semibold hover:bg-[var(--color-highlight)] transition"
            >
              Sign In
            </button>
          </form>

          {/* Sign-up Prompt */}
          <p className="mt-6 text-sm text-center text-[var(--color-primary)]">
            Don’t have an account?{' '}
            <Link to="/admin-signup" className="underline hover:text-[var(--color-highlight)]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
