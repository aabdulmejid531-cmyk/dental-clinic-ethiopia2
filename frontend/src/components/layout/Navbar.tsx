import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Menu, X, Moon, Sun, LogOut, User, ChevronDown } from 'lucide-react';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const role = user?.user_metadata?.role || 'patient';

  const navLinks = user ? (
    role === 'doctor' ? (
      <>
        <Link to="/doctor" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Dashboard</Link>
        <Link to="/appointments" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Appointments</Link>
        <Link to="/medical-records" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Records</Link>
        <Link to="/ai-chat" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">AI Assistant</Link>
      </>
    ) : role === 'admin' ? (
      <>
        <Link to="/admin" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Dashboard</Link>
        <Link to="/appointments" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Appointments</Link>
        <Link to="/medical-records" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Records</Link>
        <Link to="/ai-chat" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">AI Assistant</Link>
      </>
    ) : (
      <>
        <Link to="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Dashboard</Link>
        <Link to="/appointments" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Appointments</Link>
        <Link to="/medical-records" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Records</Link>
        <Link to="/ai-chat" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">AI Assistant</Link>
      </>
    )
  ) : (
    <>
      <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</Link>
      <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">About</Link>
      <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Contact</Link>
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">DC</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DentalClinic</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks}
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{user.email?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setProfileOpen(false)}>
                      <User className="h-4 w-4 mr-2" /> Profile
                    </Link>
                    <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Register</Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-4 py-3 space-y-2">
            {navLinks}
          </div>
        </div>
      )}
    </nav>
  );
};
