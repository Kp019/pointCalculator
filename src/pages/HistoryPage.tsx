import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../store";
import { loadGameAsync } from "../store/slices/gameSlice";
import {
  fetchHistory,
  deleteGameAsync,
  updateGameAsync,
} from "../store/slices/historySlice";
import { showModal, addToast } from "../store/slices/uiSlice";
import type { SavedGame } from "../types/game";
import { useState } from "react";
import EditGameModal from "../components/EditGameModal";

const HistoryPage = () => {
  const savedGames = useAppSelector((state) => state.history.savedGames);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<SavedGame | null>(null);

  useEffect(() => {
    dispatch(fetchHistory());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLoad = async (gameId: string) => {
    await dispatch(loadGameAsync(gameId));
    navigate("/app/game");
  };

  const handleEdit = (game: SavedGame) => {
    setEditingGame(game);
    setIsEditModalOpen(true);
  };

  const handleSaveGame = (name: string) => {
    if (editingGame) {
      dispatch(updateGameAsync({ ...editingGame, name }));
      dispatch(
        addToast({
          message: "Game updated successfully",
          type: "success",
        }),
      );
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Game History</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">Your legacy of victories</p>
        </div>
        <div className="hidden md:block">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-right">Total Sessions</div>
           <div className="text-2xl font-black text-slate-800 text-right">{savedGames.length}</div>
        </div>
      </div>

      {savedGames.length === 0 ? (
        <div className="glass-card p-20 bg-white/40 border-white/50 text-center animate-scale-in">
          <div className="w-32 h-32 bg-white/60 border border-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-300 shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors" />
            <svg className="w-16 h-16 relative z-10 group-hover:scale-110 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No Sessions Found</h2>
          <p className="text-slate-400 font-medium text-lg">Your future victories will be archived here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {savedGames.map((game: SavedGame) => (
            <div
              key={game.id}
              className="glass-card p-0! bg-white/60 border-white/80 hover:bg-white/80 transition-all duration-500 group overflow-hidden shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-stretch">
                <div className="w-full lg:w-2 bg-slate-100 group-hover:bg-primary-500 transition-colors duration-500 shrink-0" />
                
                <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-4 mb-3">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">
                        {game.name || "Untitled Session"}
                      </h2>
                      <div className="px-4 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">
                        Round {game.currentRound}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 flex-wrap">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(game.created_at || game.date || new Date().toISOString())}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {game.players?.length || 0} Players Joined
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2 mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(game);
                        }}
                        className="p-3 text-slate-400 hover:text-primary-600 bg-white border border-slate-100 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                        title="Edit Name"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            showModal({
                              title: "Purge Session History?",
                              message: "This action will permanently delete all scores and rounds for this session. This cannot be undone.",
                              confirmLabel: "Delete Forever",
                              onConfirm: async () => {
                                await dispatch(deleteGameAsync(game.id));
                                dispatch(addToast({ message: "Session purged", type: "success" }));
                              },
                              type: "danger",
                            }),
                          );
                        }}
                        className="p-3 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                        title="Delete Session"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleLoad(game.id)}
                      className="btn-primary py-4! px-10! text-sm shadow-sm flex items-center gap-3 group/btn"
                    >
                      Resume
                      <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditGameModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveGame}
        initialName={editingGame?.name || ""}
      />
    </div>
  );
};

export default HistoryPage;
