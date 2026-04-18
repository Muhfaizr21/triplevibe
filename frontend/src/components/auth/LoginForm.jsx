import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const LoginForm = ({ onLoginSuccess }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      if (onLoginSuccess) onLoginSuccess(data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mn-primary Selection:bg-mn-primary-container">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-10 shadow-3xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-6">
                <Lock className="text-white/70 w-5 h-5" />
              </div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-white/40 mt-2 text-sm">
                Sign in to manage your projects
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-xl flex items-center gap-3 text-xs animate-in zoom-in-95">
                  <AlertCircle size={16} />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.05] transition-all text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.05] transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 h-[48px]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-white/30 text-xs">
                Credentials issues? <span className="text-white/60 hover:text-white transition-colors cursor-pointer font-medium">Contact support</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
