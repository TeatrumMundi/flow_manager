'use client';

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showResetPassword, setShowResetPassword] = useState(false);

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
            {!showResetPassword ? (
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
                        type="email"
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
                        type="password"
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
            ) : (
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
                      onClick={() => setShowResetPassword(false)}
                  >
                    Back to login
                  </div>
                </form>
            )}

            {!showResetPassword && (
                <div className="mt-4 text-center text-sm text-blue-600 hover:underline cursor-pointer">
                  Create an account
                </div>
            )}
          </div>
        </div>
      </main>
  );
}
