import { useState } from 'react';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  position: string;
  employmentType: string;
  salaryRate: string;
  vacationDaysTotal: string;
}

interface UseRegistrationProps {
  onSuccess: () => void;
  onMessage: (message: { type: 'success' | 'error', text: string } | null) => void;
}

export const useRegistration = ({ onSuccess, onMessage }: UseRegistrationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    position: '',
    employmentType: 'full-time',
    salaryRate: '',
    vacationDaysTotal: '20'
  });

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    if (registerForm.password !== registerForm.confirmPassword) {
      onMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }

    if (registerForm.password.length < 6) {
      onMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return false;
    }

    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.position) {
      onMessage({ type: 'error', text: 'Please fill in all required fields' });
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setRegisterForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      position: '',
      employmentType: 'full-time',
      salaryRate: '',
      vacationDaysTotal: '20'
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerForm.email,
          password: registerForm.password,
          firstName: registerForm.firstName,
          lastName: registerForm.lastName,
          position: registerForm.position,
          employmentType: registerForm.employmentType,
          salaryRate: parseFloat(registerForm.salaryRate),
          vacationDaysTotal: parseInt(registerForm.vacationDaysTotal)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onMessage({ type: 'success', text: 'Account created successfully!' });
        resetForm();
        
        // Return to login after 2 seconds
        setTimeout(() => {
          onSuccess();
          onMessage(null);
        }, 2000);
      } else {
        onMessage({ type: 'error', text: data.error || 'Failed to create account' });
      }
    } catch {
      onMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerForm,
    isLoading,
    handleRegisterChange,
    handleRegisterSubmit
  };
};