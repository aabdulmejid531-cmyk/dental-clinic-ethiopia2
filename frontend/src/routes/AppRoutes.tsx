import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { PatientDashboard } from '../pages/patient/PatientDashboard';
import { DoctorDashboard } from '../pages/doctor/DoctorDashboard';
import { AdminPanel } from '../pages/admin/AdminPanel';
import { AIChatPage } from '../pages/ai/AIChatPage';
import { MedicalRecordsPage } from '../pages/records/MedicalRecordsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProtectedRoute, DoctorRoute, AdminRoute } from '../components/RouteGuards';

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
      <Route path="/ai-chat" element={<ProtectedRoute><AIChatPage /></ProtectedRoute>} />
      <Route path="/medical-records" element={<ProtectedRoute><MedicalRecordsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
