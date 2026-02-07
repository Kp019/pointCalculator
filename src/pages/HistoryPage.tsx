import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store";
import { loadGame } from "../store/slices/gameSlice";
import { showModal } from "../store/slices/uiSlice";
import type { SavedGame } from "../types/game";

const HistoryPage = () => {
  const savedGames = useAppSelector((state) => state.history.savedGames);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLoad = (game: any) => {
    dispatch(loadGame(game));
    navigate("/game");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-black text-slate-900">Game History</h1>

      {savedGames.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <svg
              className="w-10 h-10"
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
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            No Past Games
          </h2>
          <p className="text-slate-500">Games you save will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedGames.map((game: SavedGame) => (
            <div
              key={game.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-primary-300 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-slate-900">
                      {game.name || "Untitled Game"}
                    </h2>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-md uppercase">
                      Round {game.currentRound}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(game.date || new Date().toISOString())}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {game.players?.length || 0} Players
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        showModal({
                          title: "Delete Game History?",
                          message:
                            "Are you sure you want to delete this game? This action cannot be undone.",
                          confirmLabel: "Delete Game",
                          onConfirm: "history/deleteGame",
                          payload: game.id,
                          type: "danger",
                        }),
                      );
                    }}
                    className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                    title="Delete"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleLoad(game)}
                    className="px-6 py-3 bg-primary-50 text-primary-600 font-bold rounded-xl hover:bg-primary-100 transition-colors flex items-center gap-2"
                  >
                    Resume
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
