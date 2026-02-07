import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store";

const DashboardPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const savedGames = useAppSelector((state) => state.history.savedGames);
  const gameStarted = useAppSelector((state) => state.game.gameStarted);
  const navigate = useNavigate();

  // Calculate some stats
  const totalGames = savedGames.length;
  const lastGame = savedGames.length > 0 ? savedGames[0] : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Hello, {user?.name}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Ready to calculate some points?
          </p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Today
          </div>
          <div className="text-xl font-bold text-slate-700">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Game Card (if any) */}
        {gameStarted && (
          <div
            onClick={() => navigate("/game")}
            className="bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/20 cursor-pointer hover:scale-[1.02] transition-transform group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Game
              </div>
              <h2 className="text-2xl font-bold mb-2">Resume Active Game</h2>
              <p className="text-slate-400 mb-6">Continue where you left off</p>

              <div className="inline-flex items-center gap-2 group-hover:gap-4 transition-all font-bold text-green-400">
                Go to Game Board
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* New Game Card */}
        <div
          onClick={() => navigate("/new")}
          className={`bg-linear-to-br from-primary-500 to-accent-500 rounded-3xl p-8 text-white shadow-xl shadow-primary-500/20 cursor-pointer hover:scale-[1.02] transition-transform group relative overflow-hidden ${!gameStarted ? "md:col-span-2" : ""}`}
        >
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col items-start h-full justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Start New Game</h2>
              <p className="text-white/80 mb-6">
                Configure players, rules, and winning conditions
              </p>
            </div>

            <div className="inline-flex items-center gap-2 group-hover:gap-4 transition-all font-bold text-white">
              Setup Game
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats / Recent History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1">
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wide mb-4">
            Total Games
          </h3>
          <div className="text-4xl font-black text-slate-900">{totalGames}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wide">
              Recent Activity
            </h3>
            <button
              onClick={() => navigate("/history")}
              className="text-primary-600 text-sm font-bold hover:underline"
            >
              View All
            </button>
          </div>

          {lastGame ? (
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-slate-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-slate-900">{lastGame.name}</div>
                <div className="text-xs text-slate-500">
                  {new Date(lastGame.date).toLocaleDateString()} •{" "}
                  {lastGame.players?.length || 0} Players
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-400 text-sm py-2">
              No games played yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
