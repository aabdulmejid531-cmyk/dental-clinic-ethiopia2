import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../services/database.types';

export function ProtectedRoute({
  children,
  allow
}: {
  children: ReactNode;
  allow: UserRole[];
}) {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-ink/50">
        Loading your account…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (profile && !allow.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
