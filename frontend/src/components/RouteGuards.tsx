import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user?.user_metadata?.role === 'doctor' ? <>{children}</> : <Navigate to="/dashboard" />;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user?.user_metadata?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};
