import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRedirectToLogin: () => void;
}

export default function ProtectedRoute({ children, onRedirectToLogin }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#721C24] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-[#721C24] text-sm">Loading your Velvet account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    onRedirectToLogin();
    return null;
  }

  return <>{children}</>;
}
