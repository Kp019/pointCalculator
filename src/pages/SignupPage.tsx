import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { signupUser, clearError } from "../store/slices/authSlice";

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
      navigate("/");
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
      alert("Passwords do not match"); // Should use toast, but sticking to basics for now
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[length:24px_24px]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200 shadow-sm">
            <svg
              className="w-8 h-8 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Join PointCalculator today
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/60 border border-slate-100 animate-scale-up">
          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-inner"
                placeholder="Username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-inner"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-300 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-linear-to-r from-primary-600 to-accent-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 font-bold hover:text-primary-700 transition-colors"
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
