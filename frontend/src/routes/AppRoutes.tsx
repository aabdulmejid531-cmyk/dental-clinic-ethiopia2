import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { PatientDashboard } from '../pages/patient/PatientDashboard';
import { DoctorDashboard } from '../pages/doctor/DoctorDashboard';
import { AdminPanel } from '../pages/admin/AdminPanel';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
      <Route path="/doctor" element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user?.user_metadata?.role === 'doctor' ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user?.user_metadata?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};
