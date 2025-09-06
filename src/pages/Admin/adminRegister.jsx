import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../index.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [registrationStep, setRegistrationStep] = useState(1); // 1: registration, 2: OTP verification
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  // Input validation
  const validateInputs = () => {
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/`,
        { 
          userName: name, // Changed from 'name' to 'userName' to match backend expectations
          email: email.trim().toLowerCase(), 
          password 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Registration successful! OTP sent to your email.');
        setRegistrationStep(2);
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please check your connection and try again.');
      } else if (err.response) {
        // Server responded with error status
        const message = err.response.data?.message || 
                       err.response.data?.error || 
                       `Registration failed (${err.response.status})`;
        toast.error(message);
      } else if (err.request) {
        // Network error
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }

    if (otp.length !== 4) {
      toast.error('OTP must be 4 digits');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/otp/verify`,
        { 
          email: email.trim().toLowerCase(), 
          otp: otp.trim() 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.status === 200) {
        toast.success('Email verified successfully! Please login.');
        navigate('/admin-login');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      
      if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else if (err.response) {
        const message = err.response.data?.message || 
                       err.response.data?.error || 
                       'OTP verification failed';
        toast.error(message);
      } else if (err.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('OTP verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!email.trim()) {
      toast.error('Email is required to resend OTP');
      return;
    }

    setIsResending(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/otp/send`,
        { email: email.trim().toLowerCase() },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.status === 200) {
        toast.success('New OTP sent to your email');
        setOtp(''); // Clear existing OTP
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      
      if (err.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please try again.');
      } else if (err.response) {
        const message = err.response.data?.message || 
                       err.response.data?.error || 
                       'Failed to resend OTP';
        toast.error(message);
      } else if (err.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } finally {
      setIsResending(false);
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

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-6 sm:p-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-[var(--color-primary)]">
            {registrationStep === 1 ? 'Admin Registration' : 'Verify OTP'}
          </h2>

          {registrationStep === 1 ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm mb-1 text-[var(--color-primary)]">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] disabled:opacity-50"
                  placeholder="John Doe"
                  required
                  disabled={isLoading}
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-[var(--color-primary)]">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] disabled:opacity-50"
                  placeholder="admin@example.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-[var(--color-primary)]">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] pr-10 disabled:opacity-50"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-primary)] disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
              </div>

              <div className="mb-5">
                <label className="block text-sm mb-1 text-[var(--color-primary)]">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] disabled:opacity-50"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-[var(--color-primary)] text-[var(--color-accent)] font-semibold hover:bg-[var(--color-highlight)] transition disabled:opacity-50 disabled:cursor-not-allowed relative"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mr-2"></div>
                      Registering...
                    </div>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpVerification} className="space-y-5">
              <div className="text-center mb-4 text-[var(--color-primary)]">
                <p>We've sent a 4-digit OTP to</p>
                <p className="font-semibold">{email}</p>
              </div>

              <div>
                <label className="block text-sm mb-1 text-[var(--color-primary)]">
                  Enter OTP <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    if (value.length <= 4) {
                      setOtp(value);
                    }
                  }}
                  className="w-full px-4 py-2 rounded bg-[var(--color-bg)] text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-highlight)] disabled:opacity-50 text-center text-2xl tracking-widest"
                  placeholder="1234"
                  maxLength="4"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  className="text-sm text-[var(--color-highlight)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isResending || isLoading}
                >
                  {isResending ? 'Sending...' : "Didn't receive OTP? Resend"}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 rounded bg-[var(--color-primary)] text-[var(--color-accent)] font-semibold hover:bg-[var(--color-highlight)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || otp.length !== 4}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Navigation Link */}
          <p className="mt-6 text-sm text-center text-[var(--color-primary)]">
            {registrationStep === 1 ? (
              <>
                Already have an account?{' '}
                <Link 
                  to="/admin-login" 
                  className="underline hover:text-[var(--color-highlight)] focus:text-[var(--color-highlight)]"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  setRegistrationStep(1);
                  setOtp('');
                }}
                className="underline hover:text-[var(--color-highlight)] focus:text-[var(--color-highlight)] disabled:opacity-50"
                disabled={isLoading}
              >
                Back to registration
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}