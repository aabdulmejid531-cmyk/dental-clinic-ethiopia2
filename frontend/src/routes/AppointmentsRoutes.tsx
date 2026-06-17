import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/RouteGuards';
import { AppointmentsPage } from '../pages/appointments/AppointmentsPage';

export const AppointmentsRoutes = () => {
  return (
    <Routes>
      <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
    </Routes>
  );
};
