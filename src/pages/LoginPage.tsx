import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { loginUser, clearError } from "../store/slices/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[length:24px_24px]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 bg-linear-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary-500/20 rotate-3 group hover:rotate-6 transition-transform">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Point<span className="text-primary-600">Calculator</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Professional scoring for your game nights
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 animate-scale-up">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-lg font-medium text-slate-900 placeholder:text-slate-300 shadow-inner"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-lg font-medium text-slate-900 placeholder:text-slate-300 shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-linear-to-r from-primary-600 to-accent-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary-600 font-bold hover:text-primary-700 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
