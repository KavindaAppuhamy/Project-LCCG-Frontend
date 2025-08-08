import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../index.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
        { email, password }
      );

      const { token, user } = res.data;

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminDetails', JSON.stringify(user));

      toast.success('Login successful');
      navigate('/admin/dashboard'); // Adjust route as needed
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4 py-10">
      <div className="w-full max-w-4xl bg-[var(--color-accent)] text-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.4)] flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Logo */}
        <div className="md:w-2/5 bg-[var(--color-bg)] flex items-center justify-center p-6">
          <img
            src="/LCCG-Logo.png"
            alt="LCCG Logo"
            className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] object-contain"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-6 sm:p-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-[var(--color-primary)]">
            Admin Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-[var(--color-primary)]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)]"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm mb-1 text-[var(--color-primary)]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] pr-10"
                  placeholder="••••••••"
                  required
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

            <div>
            <button
              type="submit"
              className="w-full py-2 rounded bg-[var(--color-primary)] text-[var(--color-accent)] font-semibold hover:bg-[var(--color-highlight)] transition"
            >
              Sign In
            </button>
            </div>

          </form>

          {/* Sign-up Prompt */}
          <p className="mt-6 text-sm text-center text-[var(--color-primary)]">
            Don’t have an account?{' '}
            <Link to="/admin-register" className="underline hover:text-[var(--color-highlight)]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
