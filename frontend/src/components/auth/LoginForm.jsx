import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-mn-primary">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
          {/* Decorative background elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-mn-primary/20 blur-3xl rounded-full group-hover:bg-mn-primary/30 transition-all duration-700"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-mn-primary/10 blur-3xl rounded-full group-hover:bg-mn-primary/20 transition-all duration-700"></div>

          <div className="relative">
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-mn-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-mn-primary/40 rotate-3 group-hover:rotate-6 transition-transform">
                <LogIn className="text-white w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                Welcome <span className="text-mn-primary">Back</span>
              </h2>
              <p className="text-mn-secondary mt-2 text-center">Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm animate-shake">
                  <AlertCircle size={18} />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-mn-tertiary ml-1 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} className="text-mn-primary" /> Email Address
                </label>
                <div className="relative group/input">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mn-primary/50 transition-all"
                    placeholder="name@example.com"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-mn-primary/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-mn-tertiary ml-1 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={14} className="text-mn-primary" /> Password
                </label>
                <div className="relative group/input">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-mn-primary/50 transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-mn-primary/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-mn-primary hover:bg-mn-primary/90 text-white font-black py-4 rounded-2xl shadow-xl shadow-mn-primary/20 flex items-center justify-center gap-2 group/btn transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    SIGN IN
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-mn-secondary">
              Don't have access? <span className="text-mn-primary font-bold cursor-pointer hover:underline">Contact System Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
