import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ 
  children, 
}: ProtectedRouteProps) {
  const { data: authStatus, isLoading, error } = useAuthCheck();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !authStatus.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}