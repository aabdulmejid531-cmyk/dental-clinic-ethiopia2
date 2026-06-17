import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/ui/LoginForm';
import { RegisterForm } from '../../components/ui/RegisterForm';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleSwitchToRegister = () => {
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your dental clinic account
          </p>
        </div>
        {showRegister ? (
          <RegisterForm onSuccess={handleLoginSuccess} onSwitchToLogin={handleSwitchToLogin} />
        ) : (
          <LoginForm onSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
        )}
      </div>
    </div>
  );
};
