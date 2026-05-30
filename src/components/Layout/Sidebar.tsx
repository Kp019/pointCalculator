import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store";
import { showModal } from "../../store/slices/uiSlice";
import PointraLogo from "../Brand/PointraLogo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const user = useAppSelector((state) => state.auth.user);
  const gameStarted = useAppSelector((state) => state.game.gameStarted);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(
      showModal({
        title: "Logout?",
        message:
          "Are you sure you want to logout? You will need to login again to access your games.",
        confirmLabel: "Logout",
        onConfirm: "auth/logout",
        type: "danger",
      }),
    );
  };

  const navItems = [
    { to: "/app", label: "Dashboard", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { to: "/app/new", label: "New Session", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
    )},
    { to: "/app/history", label: "Game History", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { to: "/app/rules", label: "Custom Rules", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )},
    { to: "/app/profile", label: "My Profile", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
  ];

  return (
    <>
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-72 sm:w-80 bg-white/80 backdrop-blur-3xl border-r border-slate-100 flex flex-col h-screen transition-transform duration-500 var(--ease-out-expo) ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-6 sm:p-8 lg:p-10 pb-8 sm:pb-10 lg:pb-12 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="group-hover:scale-110 transition-transform duration-500">
              <PointraLogo size={40} />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">
              <span className="gradient-text">Pointra</span>
            </span>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 sm:p-3 text-slate-400 hover:bg-slate-50 rounded-lg sm:rounded-xl transition-all active:scale-90"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 sm:px-6 space-y-2 overflow-y-auto custom-scrollbar">
          {gameStarted && (
            <NavLink
              to="/app/game"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black transition-all relative group overflow-hidden text-sm sm:text-base ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-green-600 hover:bg-green-50/50 border border-green-100"
                }`
              }
            >
              <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3 sm:gap-4 w-full">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
                  🎮
                </span>
                <span className="flex-1">Live Game</span>
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              </div>
            </NavLink>
          )}

          <div className="pt-4 sm:pt-6 pb-2">
            <p className="px-4 sm:px-6 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 sm:mb-6">
              Main Menu
            </p>
            <div className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/app"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black transition-all duration-500 group text-sm sm:text-base ${
                      isActive
                        ? "bg-linear-to-r from-primary-500 to-orange-600 text-white"
                        : "text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-100"
                    }`
                  }
                >
                  <div className={`transition-transform duration-500 group-hover:scale-110`}>
                    {item.icon}
                  </div>
                  <span className="text-xs sm:text-sm tracking-tight">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* User Info & Footer */}
        <div className="p-4 sm:p-6 pb-6 sm:pb-10 shrink-0">
          <div className="glass-card p-3 sm:p-4 bg-white/60 border-white/80 flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 hover:bg-white transition-all duration-500 cursor-pointer" onClick={() => navigate("/app/profile")}>
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xs sm:text-sm group overflow-hidden relative`}
            >
              <div className="absolute inset-0 bg-primary-500/20 animate-pulse-slow" />
              <span className="relative z-10">
                {user?.username?.charAt(0).toUpperCase() ||
                  user?.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-black text-slate-900 truncate tracking-tight">
                {user?.username || user?.email?.split('@')[0]}
              </p>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                Pro Account
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              handleLogout();
              onClose();
            }}
            className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl sm:rounded-2xl font-black transition-all group text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="text-xs sm:text-sm">Sign Out</span>
          </button>
          
          <div className="mt-6 sm:mt-8 px-4 sm:px-6 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              v2.0.4
            </p>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
              By KP
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
