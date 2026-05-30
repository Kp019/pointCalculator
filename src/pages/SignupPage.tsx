import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { signupUser, clearError } from "../store/slices/authSlice";
import PointraLogo from "../components/Brand/PointraLogo";

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

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await dispatch(
      signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div 
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/20 rounded-full blur-[140px] animate-pulse-slow"
        />
        <div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-200/20 rounded-full blur-[140px] animate-pulse-slow"
          style={{ animationDelay: '-1s' }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-slide-down">
          <Link to="/" className="flex justify-center mb-6 group">
            <div className="group-hover:scale-110 transition-transform duration-500 group-hover:drop-shadow-lg">
              <PointraLogo size={80} />
            </div>
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Join the <span className="gradient-text">Elite.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">
            Setup your pro account
          </p>
        </div>

        <div className="glass-card p-10 bg-white/60 border-white/80 animate-scale-in shadow-sm">
          <form onSubmit={handleSignup} className="space-y-6">
            {error && (
              <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-sm font-bold text-center border border-red-100 animate-shake break-words">
                {getFriendlyError(error)}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="GameMaster"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field px-4!"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field px-4!"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 mt-4 text-xl shadow-sm group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-primary-600 font-black hover:text-primary-700 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
