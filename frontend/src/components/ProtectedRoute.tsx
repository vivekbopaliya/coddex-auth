import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '@/hooks/useAuthStatus';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requireEmailVerification?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireEmailVerification = false 
}: ProtectedRouteProps) {
  const { data: authStatus, isLoading, error } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !authStatus) {
    return <Navigate to="/login" replace />;
  }

  if (requireEmailVerification && !authStatus.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}