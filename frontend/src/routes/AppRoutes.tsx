import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';
import { LandingPage } from '../pages/LandingPage';
import { AboutPage } from '../pages/about/AboutPage';
import { ContactPage } from '../pages/contact/ContactPage';
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
      <Route path="/" element={<Layout><LandingPage /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
      <Route path="/login" element={<Layout>{!user ? <LoginPage /> : <Navigate to="/dashboard" />}</Layout>} />
      <Route path="/register" element={<Layout>{!user ? <RegisterPage /> : <Navigate to="/dashboard" />}</Layout>} />
      
      <Route path="/dashboard" element={<Layout><ProtectedRoute><PatientDashboard /></ProtectedRoute></Layout>} />
      <Route path="/doctor" element={<Layout><DoctorRoute><DoctorDashboard /></DoctorRoute></Layout>} />
      <Route path="/admin" element={<Layout><AdminRoute><AdminPanel /></AdminRoute></Layout>} />
      <Route path="/ai-chat" element={<Layout><ProtectedRoute><AIChatPage /></ProtectedRoute></Layout>} />
      <Route path="/medical-records" element={<Layout><ProtectedRoute><MedicalRecordsPage /></ProtectedRoute></Layout>} />
      <Route path="/profile" element={<Layout><ProtectedRoute><ProfilePage /></ProtectedRoute></Layout>} />
      
      <Route path="*" element={<Layout><Navigate to="/" /></Layout>} />
    </Routes>
  );
};
