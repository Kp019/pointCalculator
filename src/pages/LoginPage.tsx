import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { loginUser, clearError } from "../store/slices/authSlice";

const getFriendlyError = (err: string | null) => {
  if (!err) return null;
  if (err.includes("OperationalError") || err.includes("SQL") || err.includes("psycopg2") || err.includes("sqlalchemy")) {
    return "The server is currently unavailable. Please try again later.";
  }
  if (err.includes("ECONNREFUSED") || err.includes("Network Error")) {
    return "Network error. Please check your connection.";
  }
  return err;
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/app");
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div 
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[140px] animate-pulse-slow"
        />
        <div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-200/20 rounded-full blur-[140px] animate-pulse-slow"
          style={{ animationDelay: '-2s' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12 animate-slide-down">
          <Link to="/" className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-md hover:rotate-12 transition-transform duration-500 group">
            <svg
              className="w-12 h-12 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </Link>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
            Point<span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">
            Professional scoring engine
          </p>
        </div>

        <div className="glass-card p-10 bg-white/60 border-white/80 animate-scale-in shadow-sm">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center border border-red-100 animate-shake break-words">
                {getFriendlyError(error)}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-xl shadow-sm flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-6 bg-transparent text-slate-300 font-black uppercase tracking-[0.2em]">
                Or
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/quick-play")}
            className="btn-secondary w-full py-4 flex items-center justify-center gap-4 group"
          >
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <svg
                className="w-5 h-5 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            Quick Play
          </button>
          
          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              New here?{" "}
              <Link
                to="/signup"
                className="text-primary-600 font-black hover:text-primary-700 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
