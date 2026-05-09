import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";
import { showModal } from "../store/slices/uiSlice";

interface QuickPlayer {
  id: string;
  name: string;
  score: number;
}

const QuickPlayPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [players, setPlayers] = useState<QuickPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("quick_play_state");
    if (saved) {
      try {
        setPlayers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load quick play state", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("quick_play_state", JSON.stringify(players));
  }, [players]);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      const newPlayer: QuickPlayer = {
        id: crypto.randomUUID(),
        name: newPlayerName.trim(),
        score: 0,
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName("");
    }
  };

  const updateScore = (id: string, delta: number) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, score: p.score + delta } : p))
    );
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const resetGame = () => {
    dispatch(showModal({
      title: "Reset Scores?",
      message: "Are you sure you want to reset all scores to zero? This cannot be undone.",
      confirmLabel: "Reset All",
      type: "danger",
      onConfirm: () => {
        setPlayers(players.map((p) => ({ ...p, score: 0 })));
      }
    }));
  };

  const clearAll = () => {
    dispatch(showModal({
      title: "Clear Everything?",
      message: "This will remove all players and their scores. Are you sure?",
      confirmLabel: "Clear All",
      type: "danger",
      onConfirm: () => {
        setPlayers([]);
        localStorage.removeItem("quick_play_state");
      }
    }));
  };

  const [playerInputs, setPlayerInputs] = useState<Record<string, string>>({});
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  
  const handleInputChange = (id: string, value: string) => {
    setPlayerInputs({ ...playerInputs, [id]: value });
  };

  const applyScore = (id: string, isAddition: boolean) => {
    const val = parseInt(playerInputs[id] || "0");
    if (!isNaN(val) && val !== 0) {
      updateScore(id, isAddition ? val : -val);
      setPlayerInputs({ ...playerInputs, [id]: "" });
    }
  };

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-100/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full mx-auto p-4 md:p-6 lg:p-12 flex-1 flex flex-col gap-8 md:gap-12 animate-fade-in min-h-0 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="p-4 glass-card rounded-2xl text-slate-600 hover:text-slate-900 border-white shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                Quick<span className="gradient-text">Play</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Live Tracking Mode</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={resetGame} className="btn-secondary text-sm px-6 py-3">
              Reset Scores
            </button>
            <button onClick={clearAll} className="bg-red-50 text-red-600 border border-red-100 px-6 py-3 rounded-2xl text-sm font-black hover:bg-red-100 transition-all active:scale-95">
              Clear Session
            </button>
          </div>
        </div>

        {/* Add Player Input */}
        <div className="glass-card p-4 md:p-6! flex flex-col md:flex-row gap-4 shrink-0 bg-white/60 border-white/80">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            placeholder="Add player name..."
            className="input-field flex-1"
          />
          <button onClick={addPlayer} className="btn-primary py-4 px-10">
            Add to Game
          </button>
        </div>

        {/* Scoreboard / Leaderboard */}
        {players.length > 0 && (
          <div className="glass-card p-0 bg-white/60 border-white/80 animate-slide-up flex-1 flex flex-col min-h-0">
            <div className="p-8 border-b border-white/50 flex justify-between items-center bg-white/20 shrink-0">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Leaderboard</h2>
                <div className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Scoring Enabled
                </div>
              </div>
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Players</p>
                 <p className="text-2xl font-black text-slate-900">{players.length}</p>
              </div>
            </div>
            <div className="divide-y divide-white/40 overflow-y-auto flex-1 pb-40 custom-scrollbar">
              {[...players]
                .sort((a, b) => b.score - a.score)
                .map((player, index) => {
                  const isSelected = selectedPlayerId === player.id;
                  const isWinner = index === 0 && player.score > 0;
                  
                  return (
                    <div 
                      key={player.id} 
                      onClick={() => setSelectedPlayerId(player.id)}
                      className={`p-6 px-8 flex justify-between items-center transition-all cursor-pointer group relative ${isSelected ? 'bg-primary-500/5' : 'hover:bg-white/40'}`}
                    >
                      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-500 rounded-r-full" />}
                      
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 shadow-2xl ${
                          index === 0 ? 'bg-primary-500 text-white rotate-6 scale-110' : 
                          index === 1 ? 'bg-slate-200 text-slate-700' : 
                          index === 2 ? 'bg-slate-100 text-slate-500' : 
                          'bg-slate-50 text-slate-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-black text-xl transition-all duration-300 ${isSelected ? 'text-primary-600' : 'text-slate-800'}`}>
                            {player.name}
                          </span>
                          {isWinner && <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-0.5">Current Leader 🏆</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className={`font-black tabular-nums text-4xl transition-all duration-500 ${isSelected ? 'text-primary-600 scale-110' : 'text-slate-900'}`}>
                            {player.score}
                          </span>
                          <span className="text-[10px] font-black text-slate-400 ml-3 uppercase tracking-widest opacity-60">Pts</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(showModal({
                              title: "Remove Player?",
                              message: `Are you sure you want to remove ${player.name}? This will delete their scores as well.`,
                              confirmLabel: "Remove",
                              type: "danger",
                              onConfirm: () => {
                                removePlayer(player.id);
                                if (selectedPlayerId === player.id) setSelectedPlayerId(null);
                              }
                            }));
                          }}
                          className="p-3 text-slate-200 hover:text-red-500 transition-colors md:opacity-0 md:group-hover:opacity-100 bg-white/50 rounded-xl border border-white"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {players.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className="w-32 h-32 bg-white/40 border border-white rounded-[2.5rem] flex items-center justify-center text-slate-300 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors" />
              <svg className="w-16 h-16 relative z-10 group-hover:scale-110 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-900 font-black text-2xl tracking-tight">Game Session Empty</p>
              <p className="text-slate-400 font-medium max-w-xs mx-auto text-lg">Add players above to start tracking live scores instantly.</p>
            </div>
          </div>
        )}
      </div>

      {/* Centralized Scoring Panel */}
      {selectedPlayer && (
        <div className="fixed bottom-0 left-0 right-0 p-6 pb-10 md:pb-12 bg-white/80 backdrop-blur-3xl border-t border-white/50 shadow-[0_-20px_60px_rgba(0,0,0,0.08)] z-50 animate-slide-up">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-sm group relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-500/20 animate-pulse" />
                <span className="relative z-10">{selectedPlayer.name[0].toUpperCase()}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Scoring for</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedPlayer.name}</h3>
              </div>
            </div>

            <div className="w-full md:w-auto flex items-center gap-4">
              <input
                type="number"
                autoFocus
                value={playerInputs[selectedPlayer.id] || ""}
                onChange={(e) => handleInputChange(selectedPlayer.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyScore(selectedPlayer.id, true);
                  if (e.key === "Escape") setSelectedPlayerId(null);
                }}
                placeholder="0"
                className="input-field text-center font-black text-4xl py-6! w-full md:w-40 shadow-2xl border-primary-500/20"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => applyScore(selectedPlayer.id, true)}
                  className="btn-primary py-6! px-10! flex items-center justify-center gap-3 group"
                >
                  <svg className="w-8 h-8 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Add</span>
                </button>
                <button
                  onClick={() => applyScore(selectedPlayer.id, false)}
                  className="btn-secondary py-6! px-10! flex items-center justify-center gap-3 border-white shadow-xl group"
                >
                  <svg className="w-8 h-8 group-hover:-scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                  </svg>
                  <span className="hidden sm:inline">Sub</span>
                </button>
              </div>
              <button 
                onClick={() => setSelectedPlayerId(null)}
                className="p-4 text-slate-300 hover:text-slate-900 transition-all hover:scale-110 active:scale-90"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default QuickPlayPage;
