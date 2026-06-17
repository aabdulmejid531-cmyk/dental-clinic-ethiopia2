import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../components/ui/RegisterForm';

export const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join our dental clinic today
          </p>
        </div>
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
};
