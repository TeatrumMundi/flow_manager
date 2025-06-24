'use client';

import { useState } from "react";
import Image from "next/image";
import { useRegistration } from "@/hooks/useRegistration";
import { useLogin } from "@/hooks/useLogin";
import {
  LoginForm,
  RegisterForm,
  ResetPasswordForm,
  MessageDisplay,
  Header
} from "@/components/mainPage";

export default function Home() {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const {
    registerForm,
    isLoading: isRegisterLoading,
    handleRegisterChange,
    handleRegisterSubmit
  } = useRegistration({
    onSuccess: () => setShowRegister(false),
    onMessage: setMessage
  });

  const {
    isLoading: isLoginLoading,
    handleLogin
  } = useLogin({
    onMessage: setMessage
  });

  // Handle reset password submission
  const handleResetPasswordSubmit = (email: string) => {
    // Add your reset password logic here
    console.log('Reset password for:', email);
    setMessage({ type: 'success', text: 'Password reset link sent to your email!' });
  };

  // Handle back to login
  const handleBackToLogin = () => {
    setShowResetPassword(false);
    setShowRegister(false);
    setMessage(null);
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen px-4">
      {/* Background Image */}
      <Image
        src="/loginBG.png"
        alt="Background"
        fill
        priority
        className="object-cover z-[-1]"
        quality={100}
      />

      {/* Main Content */}
      <div className="w-full max-w-md bg-white/50 backdrop-blur-md rounded-3xl shadow-xl p-7 pl-14 pr-14 flex flex-col items-center space-y-8">
        {/* Header */}
        <Header />

        {/* Form Container */}
        <div className="w-full bg-white/80 rounded-2xl shadow-md p-6 border border-gray-200">
          {/* Message Display */}
          <MessageDisplay message={message} />

          {/* Form Content */}
          {!showResetPassword && !showRegister ? (
            <LoginForm
              onSubmit={handleLogin}
              onForgotPassword={() => setShowResetPassword(true)}
              onCreateAccount={() => setShowRegister(true)}
              isLoading={isLoginLoading}
            />
          ) : showResetPassword ? (
            <ResetPasswordForm
              onSubmit={handleResetPasswordSubmit}
              onBackToLogin={handleBackToLogin}
            />
          ) : (
            <RegisterForm
              registerForm={registerForm}
              isLoading={isRegisterLoading}
              onSubmit={handleRegisterSubmit}
              onChange={handleRegisterChange}
              onBackToLogin={handleBackToLogin}
            />
          )}
        </div>
      </div>
    </main>
  );
}