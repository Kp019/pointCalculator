import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store";
import { fetchHistory } from "../store/slices/historySlice";

const DashboardPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const savedGames = useAppSelector((state) => state.history.savedGames);
  const gameStarted = useAppSelector((state) => state.game.gameStarted);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  // Calculate some stats
  const totalGames = savedGames.length;
  const lastGame = savedGames.length > 0 ? savedGames[0] : null;

  return (
    <div className="space-y-8 sm:space-y-10 md:space-y-12 animate-fade-in relative z-10 pb-16 sm:pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Hello, <span className="gradient-text">{user?.username || user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.3em] mt-2 sm:mt-3">
            Ready to track your session?
          </p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
            Today's Schedule
          </div>
          <div className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Active Game Card (if any) */}
        {gameStarted && (
          <div
            onClick={() => navigate("/app/game")}
            className="bg-slate-900 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-white cursor-pointer hover:md:-translate-y-2 active:scale-[0.98] transition-all duration-500 group relative overflow-hidden lg:col-span-1"
          >
            <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-primary-500/10 rounded-full blur-[80px] sm:blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 border border-white/10">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400 animate-pulse" />
                Live Session
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 tracking-tight">Resume Game</h2>
              <p className="text-slate-400 font-medium mb-8 sm:mb-10 text-base sm:text-lg">Continue where you left off with your current players.</p>

              <div className="inline-flex items-center gap-2 sm:gap-3 group-hover:gap-4 sm:group-hover:gap-6 transition-all duration-500 font-black text-green-400 uppercase text-[10px] sm:text-xs tracking-widest">
                Go to Game Board
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* New Game Card */}
        <div
          onClick={() => navigate("/app/new")}
          className={`bg-linear-to-br from-primary-500 via-primary-600 to-orange-600 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-white cursor-pointer hover:md:-translate-y-2 active:scale-[0.98] transition-all duration-500 group relative overflow-hidden ${!gameStarted ? 'md:col-span-2' : ''}`}
        >
          <div className="absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 bg-white/10 rounded-full blur-[80px] sm:blur-[100px] translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col items-start h-full justify-between">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 md:mb-10 border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 tracking-tight">Setup New Session</h2>
              <p className="text-white/80 font-medium mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg">
                Configure players, custom rules, and victory conditions for a pro experience.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 sm:gap-3 group-hover:gap-4 sm:group-hover:gap-6 transition-all duration-500 font-black text-white uppercase text-[10px] sm:text-xs tracking-widest">
              Setup Game
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Play Card */}
        <div
          onClick={() => navigate("/quick-play")}
          className="glass-card p-6 sm:p-8 md:p-10 bg-white/60 border-white/80 cursor-pointer group relative overflow-hidden active:scale-[0.98] transition-all"
        >
          <div className="absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 bg-primary-100 rounded-full blur-[100px] sm:blur-[120px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col items-start h-full justify-between">
            <div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 md:mb-10 group-hover:bg-primary-50 transition-colors duration-500 border border-slate-100">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-500 group-hover:scale-110 transition-transform duration-500"
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
              <h2 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4 tracking-tight text-slate-900">Quick Play</h2>
              <p className="text-slate-400 font-medium mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg">
                Just add points. No complex rules or session management needed.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 sm:gap-3 group-hover:gap-4 sm:group-hover:gap-6 transition-all duration-500 font-black text-primary-600 uppercase text-[10px] sm:text-xs tracking-widest">
              Launch Quick Play
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats / Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="glass-card p-5 sm:p-6 md:p-8 bg-white/40 border-white/50 col-span-1 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute -right-10 -bottom-10 w-32 sm:w-40 h-32 sm:h-40 bg-primary-500/5 rounded-full blur-3xl" />
          <h3 className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] mb-6 sm:mb-8">
            Total Sessions
          </h3>
          <div>
            <div className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-2">{totalGames}</div>
            <p className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">Games Logged</p>
          </div>
        </div>

        <div className="glass-card p-5 sm:p-6 md:p-8 bg-white/40 border-white/50 lg:col-span-2">
          <div className="flex justify-between items-center mb-6 sm:mb-8 md:mb-10">
            <h3 className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em]">
              Recent Activity
            </h3>
            <button
              onClick={() => navigate("/app/history")}
              className="text-primary-600 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:text-primary-700 transition-colors"
            >
              View All
            </button>
          </div>

          {lastGame ? (
            <div className="flex items-center gap-3 sm:gap-4 md:gap-8 p-4 sm:p-5 md:p-6 bg-white/80 rounded-2xl sm:rounded-3xl border border-white hover:md:translate-x-2 active:scale-[0.98] transition-transform duration-500 cursor-pointer" onClick={() => navigate("/app/history")}>
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-slate-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-slate-100 text-primary-500 shadow-inner shrink-0">
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">{lastGame.name}</div>
                <div className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {new Date(
                    lastGame.created_at ||
                      lastGame.date ||
                      new Date().toISOString(),
                  ).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}{" "}
                  • {lastGame.players?.length || 0} Players
                </div>
              </div>
              <div className="hidden sm:block shrink-0">
                 <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                 </svg>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 font-bold uppercase text-[10px] sm:text-xs tracking-widest py-8 sm:py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl sm:rounded-3xl">
              No sessions recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
