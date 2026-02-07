import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";
import { login } from "../store/slices/authSlice";

const LoginPage = () => {
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(login(name.trim()));
      navigate("/");
    }
  };

  const avatars = [
    "from-primary-400 to-accent-400",
    "from-emerald-400 to-teal-400",
    "from-orange-400 to-amber-400",
    "from-pink-400 to-rose-400",
    "from-violet-400 to-purple-400",
    "from-slate-400 to-slate-600",
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
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
          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                Enter Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all text-lg font-bold text-slate-900 placeholder:text-slate-300 shadow-inner"
                placeholder="Ex: Krishna Prasad"
                required
                autoFocus
                maxLength={20}
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-linear-to-r from-primary-600 to-accent-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Get Started
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
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50">
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Branding & Aesthetics
            </p>
            <div className="flex justify-center gap-3">
              {avatars.map((color, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full bg-linear-to-br ${color} shadow-lg ring-2 ring-white ring-offset-2 ring-offset-slate-50`}
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-slate-400 text-sm font-medium">
          Light and fast. No registration required.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
