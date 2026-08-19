import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { ShieldAlert } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
  onRedirectToLogin: () => void;
  onNavigateHome: () => void;
}

export default function AdminRoute({ children, onRedirectToLogin, onNavigateHome }: AdminRouteProps) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#721C24] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-serif text-[#721C24] text-sm">Authenticating administrative privileges...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    onRedirectToLogin();
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md bg-white p-8 rounded-2xl border border-rose-200 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2C1810]">Admin Access Required</h3>
          <p className="text-sm text-[#6E5A4E]">
            This portal is restricted to authorized bakery management and pastry staff.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-6 py-2.5 rounded-full bg-[#721C24] text-white text-xs font-semibold uppercase tracking-wider"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
