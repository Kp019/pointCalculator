import { NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store";
import { showModal } from "../../store/slices/uiSlice";

const Sidebar = () => {
  const user = useAppSelector((state) => state.auth.user);
  const gameStarted = useAppSelector((state) => state.game.gameStarted);
  const dispatch = useAppDispatch();

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
    { to: "/", label: "Dashboard", icon: "🏠" },
    { to: "/new", label: "New Game", icon: "➕" },
    { to: "/history", label: "History", icon: "📜" },
    { to: "/rules", label: "Rules", icon: "⚙️" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 animate-slide-right">
      {/* Brand */}
      <div className="p-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 rotate-3 group-hover:rotate-6 transition-transform">
            <svg
              className="w-6 h-6 text-white"
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
          <span className="text-xl font-black text-slate-900 tracking-tight">
            Point<span className="text-primary-600">Calc</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {gameStarted && (
          <NavLink
            to="/game"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all relative group ${
                isActive
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                  : "text-green-600 hover:bg-green-50"
              }`
            }
          >
            <span className="text-xl group-hover:scale-110 transition-transform">
              🎮
            </span>
            Active Game
            <span className="absolute right-4 w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </NavLink>
        )}

        <div className="py-2">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-linear-to-r from-primary-600 to-accent-600 text-white shadow-xl shadow-primary-500/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Info & Footer */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full bg-linear-to-br ${user?.avatarColor || "from-slate-400 to-slate-500"} flex items-center justify-center text-white font-black text-xs shadow-md`}
          >
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-900 truncate">
              {user?.name}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Player
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
            <path d="M9 12h12l-3 -3" />
            <path d="M18 15l3 -3" />
          </svg>
          Logout
        </button>
        <p className="text-sm text-start mt-5">
          Made with ❤️ by{" "}
          <a
            className="font-bold"
            href="https://github.com/kp019"
            target="_blank"
          >
            KP
          </a>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
