import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Mail, ShieldCheck, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { authService, ADMIN_EMAIL } from '../../services/authService';
import { isSupabaseConfigured, getSupabaseUrl } from '../../lib/supabase';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const isConfigured = isSupabaseConfigured();
  const supabaseUrl = getSupabaseUrl();

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (authService.isAuthenticated()) {
      onSuccess();
    }
  }, [onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        const result = await authService.signUpAdmin(password);
        if (result.success) {
          if (authService.isAuthenticated()) {
            onSuccess();
          } else {
            setNotice(result.message || 'Admin registered in Supabase. Please enter your password to sign in.');
            setIsRegisterMode(false);
          }
        } else {
          setError(result.error || 'Registration failed in Supabase Auth.');
        }
      } else {
        const result = await authService.login(email, password);
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || 'Authentication failed. Please verify your credentials.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] text-neutral-900 flex flex-col justify-center items-center px-4 sm:px-6 relative">
      {/* Top Hairline Back Navigation */}
      <div className="absolute top-6 left-6 sm:left-10">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-600 hover:text-neutral-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </button>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-white border border-neutral-200/80 p-8 sm:p-10 shadow-sm relative">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-[10px] font-mono uppercase tracking-widest text-neutral-600 mb-3">
            <ShieldCheck className="w-3 h-3 text-[#B8934A]" />
            <span>Supabase Auth Console</span>
          </div>
          <h1 className="text-2xl font-serif font-light tracking-tight text-neutral-950 mb-1">
            Portfolio Administration
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Direct access to Supabase database records, content CMS & assets
          </p>
        </div>

        {notice && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-medium">Supabase Auth Notice</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">{notice}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Authentication Notice</p>
              <p className="mt-0.5 text-[11px] leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600">
                Designated Admin Email
              </label>
              <span className="text-[10px] font-mono text-[#B8934A]">Single Admin</span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                readOnly
                value={email}
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-100 border border-neutral-200 text-sm text-neutral-700 font-mono cursor-not-allowed select-none"
              />
            </div>
            <p className="text-[10px] font-mono text-neutral-500 mt-1">
              Authentication restricted strictly to the designated portfolio owner.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-600">
                {isRegisterMode ? 'Choose Supabase Password' : 'Password'}
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Supabase password"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF9F7] border border-neutral-200 text-sm text-neutral-900 focus:outline-none focus:border-[#B8934A] focus:bg-white transition-all font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>{isRegisterMode ? 'Creating admin user in Supabase...' : 'Authenticating with Supabase...'}</span>
              ) : (
                <>
                  <span>{isRegisterMode ? 'Register Single Admin in Supabase' : 'Sign In with Supabase Auth'}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
                setNotice(null);
              }}
              className="text-xs font-mono text-neutral-500 hover:text-[#B8934A] underline underline-offset-4"
            >
              {isRegisterMode
                ? '← Already created your Supabase password? Sign in'
                : 'Need to create admin account in Supabase? Click here'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Endpoint:</span>
            </span>
            <span className={isConfigured ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
              {isConfigured ? 'Connected' : 'Missing URL/Key'}
            </span>
          </div>
          {isConfigured && (
            <p className="text-[10px] font-mono text-neutral-400 truncate">
              {supabaseUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
