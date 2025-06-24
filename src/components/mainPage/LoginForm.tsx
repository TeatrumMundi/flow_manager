'use client';

import { useState } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
}

export default function LoginForm({ onSubmit, onForgotPassword, onCreateAccount }: LoginFormProps) {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(loginForm.email, loginForm.password);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={loginForm.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={loginForm.password}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
        />
      </div>

      <div
        className="text-left text-sm text-gray-700 hover:underline cursor-pointer"
        onClick={onForgotPassword}
      >
        Forgot password?
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition-colors transform active:scale-[0.97] duration-100"
      >
        Login
      </button>

      <div 
        className="mt-4 text-center text-sm text-blue-600 hover:underline cursor-pointer"
        onClick={onCreateAccount}
      >
        Create an account
      </div>
    </form>
  );
}