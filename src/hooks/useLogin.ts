import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseLoginProps {
  onMessage: (message: { type: 'success' | 'error', text: string } | null) => void;
}

export const useLogin = ({ onMessage }: UseLoginProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    onMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onMessage({ type: 'success', text: 'Login successful!' });
        
        // Store user data in localStorage (or use a proper state management solution)
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to user dashboard after a short delay
        setTimeout(() => {
          router.push(`/profile/${data.user.id}`);
        }, 1000);
      } else {
        onMessage({ type: 'error', text: data.error || 'Login failed' });
      }
    } catch {
      onMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleLogin
  };
};