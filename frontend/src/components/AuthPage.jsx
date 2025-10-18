import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, LogIn, Mail, Lock, User, KeyRound, AlertTriangle, CheckCircle, Loader } from 'lucide-react';

// A dedicated component to display status messages (info, success, error)
const StatusDisplay = ({ status }) => {
  if (!status.message) return null;
  
  const styles = {
    info: 'bg-blue-100 text-blue-800 border-blue-500',
    success: 'bg-green-100 text-green-800 border-green-500',
    error: 'bg-red-100 text-red-800 border-red-500',
  };

  const Icon = () => {
    if (status.type === 'info') return <Loader className="w-4 h-4 mr-3 animate-spin" />;
    if (status.type === 'error') return <AlertTriangle className="w-4 h-4 mr-3" />;
    return <CheckCircle className="w-4 h-4 mr-3" />;
  };

  return (
    <div className={`mb-5 p-4 rounded-lg font-medium text-sm border-l-4 flex items-center ${styles[status.type] || 'bg-gray-100'}`}>
      <Icon />
      {status.message}
    </div>
  );
};

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // Controls 'login' or 'signup' view
  const [step, setStep] = useState('form'); // Controls 'form' or 'otp' view

  // State for form inputs
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  
  // State for backend communication
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });

  const handleStatus = (message, type) => setStatus({ message, type });

  // --- API HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    handleStatus("Logging in...", "info");
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginData);
      if (res.data.userId) { // OTP is required
        setUserId(res.data.userId);
        setStep('otp');
        handleStatus("OTP sent to your email. Please verify.", "info");
      } else { // Direct login successful
        onLoginSuccess(res.data);
      }
    } catch (err) {
      handleStatus(err.response?.data?.message || 'Login failed', 'error');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    handleStatus("Creating account...", "info");
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', signupData);
      setUserId(res.data.userId);
      setStep('otp');
      handleStatus("Account created! Please check your email for the OTP.", "info");
    } catch (err) {
      handleStatus(err.response?.data?.message || 'Signup failed', 'error');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    handleStatus("Verifying OTP...", "info");
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { userId, otp });
      onLoginSuccess(res.data); // This triggers the login in App.jsx
    } catch (err) {
      handleStatus(err.response?.data?.message || 'OTP verification failed', 'error');
    }
  };

  // --- FORM STATE CHANGE HANDLERS ---
  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });
  
  // --- UI CONTROL ---
  const resetState = () => {
    setStep('form');
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '' });
    setOtp('');
    setUserId(null);
    setStatus({ message: '', type: '' });
  };
  
  const switchMode = (newMode) => {
    setMode(newMode);
    resetState();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl border border-gray-200 p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center flex items-center justify-center">
            {mode === 'login' ? <LogIn className="w-8 h-8 mr-3 text-indigo-600" /> : <UserPlus className="w-8 h-8 mr-3 text-indigo-600" />}
            {step === 'form' ? (mode === 'login' ? 'Welcome Back' : 'Create Account') : 'Verify Account'}
        </h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          {step === 'form' 
            ? (mode === 'login' ? 'Log in to access your dashboard.' : 'Join us to start reporting issues.') 
            : 'An OTP has been sent to your email. Please verify.'}
        </p>
        
        <StatusDisplay status={status} />

        {step === 'form' ? (
          mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} placeholder="you@example.com" required className="w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} placeholder="Enter your password" required className="w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
              <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 rounded-lg">
                <LogIn className="w-5 h-5 mr-2" /> Log In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={signupData.name} onChange={handleSignupChange} placeholder="John Doe" required className="w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={signupData.email} onChange={handleSignupChange} placeholder="you@example.com" required className="w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={signupData.password} onChange={handleSignupChange} placeholder="Create a password" required className="w-full p-3 border border-gray-300 rounded-lg"/>
              </div>
              <button type="submit" className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 rounded-lg">
                <UserPlus className="w-5 h-5 mr-2" /> Sign Up
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Enter OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" required maxLength="6" className="w-full p-3 border border-gray-300 rounded-lg text-center tracking-widest font-mono"/>
            </div>
            <button type="submit" className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 rounded-lg">
              <CheckCircle className="w-5 h-5 mr-2" /> Verify & Continue
            </button>
          </form>
        )}
        
        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')} className="font-medium text-indigo-600 hover:underline ml-1">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
