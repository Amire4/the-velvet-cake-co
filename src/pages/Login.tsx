import React, { useState } from 'react';
import { User, Lock, Mail, Phone, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LoginProps {
  onNavigate: (path: string) => void;
  initialMode?: 'login' | 'register';
}

export default function Login({ onNavigate, initialMode = 'login' }: LoginProps) {
  const { login, register, isAdmin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, phone });
      }

      // Check if admin redirect
      if (email.toLowerCase().includes('admin')) {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setLoading(true);
      await login(demoEmail, demoPass);
      if (demoEmail.includes('admin')) {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#E8DFC8] shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-[#8C6D4F]">
            The Velvet Cake Co.
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs text-[#6E5A4E]">
            {mode === 'login'
              ? 'Access your celebration orders and custom cake quotes'
              : 'Join The Velvet Circle for tailored pastry concierge service'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DFC8] space-y-2 text-xs">
          <p className="font-bold text-[#2C1810] text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> One-Click Quick Sign In (Test Credentials)
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              id="demo-admin-login-btn"
              onClick={() => handleDemoLogin('admin@thevelvetcakeco.com', 'VelvetAdmin2026!')}
              className="p-2 bg-[#721C24] hover:bg-[#58141B] text-white rounded-lg font-semibold text-[11px] transition-colors"
            >
              Sign In as Admin
            </button>
            <button
              type="button"
              id="demo-customer-login-btn"
              onClick={() => handleDemoLogin('customer@thevelvetcakeco.com', 'CustomerPass2026!')}
              className="p-2 bg-white border border-[#E8DFC8] text-[#4A3B32] hover:bg-[#F4EBE1] rounded-lg font-semibold text-[11px] transition-colors"
            >
              Sign In as Customer
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {mode === 'register' && (
            <div>
              <label className="block font-medium text-[#4A3B32] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C6D4F] absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-[#2C1810] focus:outline-none focus:border-[#721C24]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C6D4F] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-[#2C1810] focus:outline-none focus:border-[#721C24]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-medium text-[#4A3B32] mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8C6D4F] absolute left-3 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (212) 555-0199"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-[#2C1810] focus:outline-none focus:border-[#721C24]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium text-[#4A3B32] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C6D4F] absolute left-3 top-3.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl text-[#2C1810] focus:outline-none focus:border-[#721C24]"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#721C24] hover:bg-[#58141B] text-white text-xs uppercase tracking-widest font-semibold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading
              ? 'Authenticating...'
              : mode === 'login'
              ? 'Sign In to Account'
              : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="text-center pt-2 border-t border-[#E8DFC8] text-xs text-[#6E5A4E]">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-[#721C24] hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#721C24] hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
