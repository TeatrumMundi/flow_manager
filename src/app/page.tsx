'use client';

import { useState } from "react";
import Image from "next/image";
import { useRegistration } from "@/hooks/useRegistration";

export default function Home() {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Add state for login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // Add state for reset password form
  const [resetEmail, setResetEmail] = useState('');

  const {
    registerForm,
    isLoading,
    handleRegisterChange,
    handleRegisterSubmit
  } = useRegistration({
    onSuccess: () => setShowRegister(false),
    onMessage: setMessage
  });

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  return (
      <main className="relative flex items-center justify-center min-h-screen px-4">
        {/* Tło jako pełnoekranowy obraz */}
        <Image
            src="/loginBG.png"
            alt="Background"
            fill
            priority
            className="object-cover z-[-1]"
            quality={100}
        />

        {/* Główna zawartość */}
        <div className="w-full max-w-md bg-white/50 backdrop-blur-md rounded-3xl shadow-xl p-7 pl-14 pr-14 flex flex-col items-center space-y-8">
          {/* Logo + Nagłówek */}
          <div className="flex items-center">
            <Image
                src="/flowIcon.png"
                alt="Flow Manager Logo"
                width={70}
                height={70}
                className="object-contain"
                priority
            />
            <h1 className="text-4xl font-semibold tracking-tight text-gray-700">
              Flow Manager
            </h1>
          </div>

          {/* Kontener z formularzem lub resetowaniem hasła */}
          <div className="w-full bg-white/80 rounded-2xl shadow-md p-6 border border-gray-200">
            {/* Message display */}
            {message && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {!showResetPassword && !showRegister ? (
                // Formularz logowania
                <form className="space-y-5">
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
                        onChange={handleLoginChange}
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
                        onChange={handleLoginChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    />
                  </div>

                  <div
                      className="text-left text-sm text-gray-700 hover:underline cursor-pointer"
                      onClick={() => setShowResetPassword(true)}
                  >
                    Forgot password?
                  </div>

                  <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition-colors transform active:scale-[0.97] duration-100"
                  >
                    Login
                  </button>
                </form>
            ) : showResetPassword ? (
                // Panel resetowania hasła
                <form className="space-y-5">
                  <div>
                    <label
                        htmlFor="resetEmail"
                        className="block text-sm font-medium text-gray-700"
                    >
                      Enter your email to reset password
                    </label>
                    <input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    />
                  </div>

                  <button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 transition-colors transform active:scale-[0.97] duration-100"
                  >
                    Send reset link
                  </button>

                  <div
                      className="text-sm text-gray-700 hover:underline cursor-pointer text-center"
                      onClick={() => {
                        setShowResetPassword(false);
                        setShowRegister(false);
                        setResetEmail(''); // Clear the reset email field
                      }}
                  >
                    Back to login
                  </div>
                </form>
            ) : (
                // Panel rejestracji
                <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                  {/* ...existing registration form code... */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700"
                      >
                        First Name *
                      </label>
                      <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={registerForm.firstName}
                          onChange={handleRegisterChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      />
                    </div>

                    <div>
                      <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700"
                      >
                        Last Name *
                      </label>
                      <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={registerForm.lastName}
                          onChange={handleRegisterChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                        htmlFor="registerEmail"
                        className="block text-sm font-medium text-gray-700"
                    >
                      Email *
                    </label>
                    <input
                        id="registerEmail"
                        name="email"
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700"
                    >
                      Position *
                    </label>
                    <input
                        id="position"
                        name="position"
                        type="text"
                        required
                        value={registerForm.position}
                        onChange={handleRegisterChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                          htmlFor="employmentType"
                          className="block text-sm font-medium text-gray-700"
                      >
                        Employment Type
                      </label>
                      <select
                          id="employmentType"
                          name="employmentType"
                          value={registerForm.employmentType}
                          onChange={handleRegisterChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                      </select>
                    </div>

                    <div>
                      <label
                          htmlFor="salaryRate"
                          className="block text-sm font-medium text-gray-700"
                      >
                        Salary Rate
                      </label>
                      <input
                          id="salaryRate"
                          name="salaryRate"
                          type="number"
                          step="0.01"
                          value={registerForm.salaryRate}
                          onChange={handleRegisterChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                        htmlFor="registerPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                      Password *
                    </label>
                    <input
                        id="registerPassword"
                        name="password"
                        type="password"
                        required
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    />
                  </div>

                  <div>
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password *
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                    />
                  </div>

                  <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700 transition-colors transform active:scale-[0.97] duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  <div
                      className="text-sm text-gray-700 hover:underline cursor-pointer text-center"
                      onClick={() => {
                        setShowRegister(false);
                        setShowResetPassword(false);
                        setMessage(null);
                      }}
                  >
                    Back to login
                  </div>
                </form>
            )}

            {!showResetPassword && !showRegister && (
                <div 
                    className="mt-4 text-center text-sm text-blue-600 hover:underline cursor-pointer"
                    onClick={() => setShowRegister(true)}
                >
                  Create an account
                </div>
            )}
          </div>
        </div>
      </main>
  );
}