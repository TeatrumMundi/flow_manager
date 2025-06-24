'use client';

import { useState } from 'react';

interface ResetPasswordFormProps {
  onSubmit: (email: string) => void;
  onBackToLogin: () => void;
}

export default function ResetPasswordForm({ onSubmit, onBackToLogin }: ResetPasswordFormProps) {
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(resetEmail);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
        onClick={onBackToLogin}
      >
        Back to login
      </div>
    </form>
  );
}