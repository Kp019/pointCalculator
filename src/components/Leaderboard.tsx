import { useState } from "react";
import type { Player, Round, GameConfig } from "../types/game";

interface LeaderboardProps {
  players: Player[];
  rounds: Round[];
  config: GameConfig;
  onUpdateScore: (
    playerId: string,
    roundIndex: number,
    newScore: number,
  ) => void;
  onDeleteScore: (playerId: string, roundIndex: number) => void;
  eliminatedPlayerIds: Set<string>;
  isGameOver: boolean;
}

const Leaderboard = ({
  players,
  rounds,
  config,
  onUpdateScore,
  onDeleteScore,
  eliminatedPlayerIds,
  isGameOver,
}: LeaderboardProps) => {
  const [editingScore, setEditingScore] = useState<{
    playerId: string;
    playerName: string;
    roundIndex: number;
    score: number;
  } | null>(null);
  const [newScoreValue, setNewScoreValue] = useState<string>("");

  const winner = isGameOver && players.length > 0 ? players[0] : null;

  const getRankColor = (
    rank: number,
    isPlayerWinner: boolean,
    isEliminated: boolean,
  ) => {
    if (isEliminated) return "from-slate-200 to-slate-300";
    if (isPlayerWinner) return "from-yellow-400 to-slate-500 shadow-yellow-500/50";
    switch (rank) {
      case 0: return "from-yellow-400 to-amber-600 shadow-yellow-500/40";
      case 1: return "from-slate-300 to-slate-400 shadow-slate-400/40";
      case 2: return "from-slate-400 to-slate-700 shadow-slate-700/40";
      default: return "from-slate-700 to-slate-900 shadow-slate-900/40";
    }
  };

  const getRankEmoji = (
    rank: number,
    isPlayerWinner: boolean,
    isEliminated: boolean,
  ) => {
    if (isEliminated) return "💀";
    if (isPlayerWinner) return "🏆";
    switch (rank) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `${rank + 1}`;
    }
  };

  const handleScoreClick = (
    playerId: string,
    playerName: string,
    roundIndex: number,
    score: number,
  ) => {
    setEditingScore({ playerId, playerName, roundIndex, score });
    setNewScoreValue(score.toString());
  };

  const handleUpdate = () => {
    if (editingScore) {
      const val = parseInt(newScoreValue);
      if (!isNaN(val)) {
        onUpdateScore(editingScore.playerId, editingScore.roundIndex, val);
        setEditingScore(null);
      }
    }
  };

  const handleDelete = () => {
    if (editingScore) {
      onDeleteScore(editingScore.playerId, editingScore.roundIndex);
      setEditingScore(null);
    }
  };

  return (
    <div className="glass-card bg-white/60 border-white/80 p-4 sm:p-6 md:p-8 lg:sticky lg:top-8 overflow-hidden group/board">
      {/* Decorative Glow */}
      <div className="absolute -top-16 sm:-top-20 md:-top-24 -right-16 sm:-right-20 md:-right-24 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-primary-500/10 rounded-full blur-3xl group-hover/board:scale-150 transition-transform duration-1000" />
      
      <div className="relative z-10 flex flex-col mb-6 sm:mb-8 md:mb-10">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">Leaderboard</h2>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
            {config.winMetric !== "points" && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-slate-900 text-white rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                {rounds.length}/{config.targetRounds} Rounds
              </span>
            )}
            {config.winMetric !== "rounds" && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-primary-500 text-white rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                Target: {config.targetPoints}
              </span>
            )}
          </div>
        </div>
      </div>

      {winner && (
        <div className="mb-6 sm:mb-8 md:mb-10 p-1 bg-linear-to-r from-yellow-400 via-slate-500 to-yellow-400 rounded-2xl sm:rounded-3xl animate-gradient-x">
          <div className="bg-white/95 backdrop-blur-md p-4 sm:p-5 md:p-6 rounded-[calc(1rem-1px)] sm:rounded-[calc(1.5rem-1px)] text-center">
             <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 animate-bounce-subtle">👑</div>
             <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase">Grand Winner</h3>
             <p className="font-black text-slate-600 text-lg sm:text-xl mt-1 tracking-tight">
               {winner.name}
             </p>
          </div>
        </div>
      )}

      {players.length === 0 ? (
        <div className="text-center py-10 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-slate-300">
             <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">Awaiting first round...</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4 relative z-10">
          {players.map((player, index) => {
            const isWinner = winner?.id === player.id;
            const isEliminated = eliminatedPlayerIds.has(player.id);
            return (
              <div
                key={player.id}
                className={`group/item flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-500 ${
                  isWinner
                    ? "bg-yellow-50/50 border-yellow-200"
                    : isEliminated
                      ? "bg-slate-50/50 border-slate-100 opacity-60 grayscale"
                      : "bg-white/80 border-white hover:bg-white"
                }`}
              >
                <div
                  className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-linear-to-br ${getRankColor(index, isWinner, isEliminated)} flex items-center justify-center font-black text-sm sm:text-base md:text-lg text-white transition-transform duration-500 group-hover/item:rotate-12`}
                >
                  {getRankEmoji(index, isWinner, isEliminated)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black text-sm sm:text-base md:text-lg tracking-tighter truncate ${isEliminated ? "text-slate-400 line-through" : "text-slate-900 group-hover/item:text-primary-600 transition-colors"}`}>
                    {player.name}
                  </h3>
                  {player.scores.length > 0 && (
                    <div className="flex gap-1 sm:gap-1.5 mt-1.5 sm:mt-2 overflow-x-auto custom-scrollbar pb-1">
                      {player.scores.map((score, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleScoreClick(player.id, player.name, idx, score)}
                          className={`text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg transition-all border shrink-0 ${
                            isEliminated
                              ? "bg-slate-100 text-slate-300 border-slate-100"
                              : score > 0
                                ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                : score < 0
                                  ? "bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {score > 0 ? "+" : ""}{score}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <div className={`text-lg sm:text-xl md:text-2xl font-black tracking-tighter leading-none ${isWinner ? "text-slate-600" : isEliminated ? "text-slate-400" : "text-slate-900"}`}>
                    {player.totalScore}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    PTS
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {rounds.length > 0 && (
        <div className="mt-10 pt-10 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="bg-slate-50/50 p-4 md:p-5 rounded-3xl border border-slate-100">
               <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pace</span>
               <div className="text-xl md:text-2xl font-black text-slate-900">
                 {rounds.length} <span className="text-[10px] opacity-40">Rounds</span>
               </div>
            </div>
            <div className="bg-slate-50/50 p-4 md:p-5 rounded-3xl border border-slate-100">
               <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">High Score</span>
               <div className="text-xl md:text-2xl font-black gradient-text">
                 {Math.max(...players.map(p => p.totalScore), 0)}
               </div>
            </div>
        </div>
      )}

      {/* Edit Score Modal */}
      {editingScore && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-fade-in">
          <div
            className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                 <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Edit Points</h3>
              <p className="text-slate-400 font-bold text-sm mt-2">
                Correcting {editingScore.playerName}&apos;s Round {editingScore.roundIndex + 1}
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="number"
                  autoFocus
                  value={newScoreValue}
                  onChange={(e) => setNewScoreValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                  className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-primary-500 focus:ring-0 focus:bg-white transition-all text-3xl font-black text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={handleUpdate} className="btn-primary py-5! text-sm shadow-xl">Update</button>
                <button onClick={() => setEditingScore(null)} className="btn-secondary py-5! text-sm border-slate-200 shadow-xl">Cancel</button>
              </div>

              <button
                onClick={handleDelete}
                className="w-full py-4 text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest transition-colors"
              >
                Reset score to zero
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
