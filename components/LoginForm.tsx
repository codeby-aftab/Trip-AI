import React from 'react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle login logic with a backend.
    // For this demo, we'll just call the onLogin handler.
    onLogin();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back!</h2>
      <p className="text-center text-gray-500 mb-6">Log in to manage your trips.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            id="login-email"
            type="email"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="login-password"
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Log In
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="font-medium text-cyan-600 hover:text-cyan-500">
          Sign Up
        </button>
      </p>
    </div>
  );
};