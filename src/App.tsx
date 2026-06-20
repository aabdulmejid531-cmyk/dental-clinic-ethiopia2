import { Suspense, lazy, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthListener, useAuth } from './hooks/useAuth';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import type { Language } from './utils/translations';

const AdminPanel = lazy(() => import('./pages/AdminPanel').then((m) => ({ default: m.AdminPanel })));

export default function App() {
  useAuthListener();
  const { user } = useAuth();
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar lang={lang} onLangChange={setLang} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing lang={lang} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/patient"
            element={
              <ProtectedRoute allow={['patient']}>
                <PatientDashboard lang={lang} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allow={['doctor']}>
                <DoctorDashboard lang={lang} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allow={['admin']}>
                <Suspense fallback={<div className="container-page py-10 text-sm text-ink/50">Loading admin panel…</div>}>
                  <AdminPanel />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer lang={lang} />
      <ChatWidget lang={lang} patientId={user?.id} />
    </div>
  );
}
