import { useState } from "react";
import type { Player } from "../types/game";

interface GameBoardProps {
  players: Player[];
  currentRound: number;
  onSubmitScores: (scores: { [playerId: string]: number }) => void;
  eliminatedPlayerIds: Set<string>;
  isGameOver: boolean;
}

const GameBoard = ({
  players,
  currentRound,
  onSubmitScores,
  eliminatedPlayerIds,
  isGameOver,
}: GameBoardProps) => {
  const [scores, setScores] = useState<{ [playerId: string]: string }>({});

  const updateScore = (playerId: string, score: string) => {
    if (score === "" || score === "-" || /^-?\d*$/.test(score)) {
      setScores({ ...scores, [playerId]: score });
    }
  };

  const handleSubmit = () => {
    if (isGameOver) return;

    const numericScores: { [playerId: string]: number } = {};
    players.forEach((player) => {
      const scoreStr = scores[player.id] || "0";
      numericScores[player.id] =
        scoreStr === "" || scoreStr === "-" ? 0 : parseInt(scoreStr, 10);
    });

    onSubmitScores(numericScores);
    setScores({});
  };

  return (
    <div className="glass-card bg-white/60 border-white/80 p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Record Scores</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-1">Round {currentRound} Entry</p>
        </div>
        <div className="px-4 py-1.5 bg-slate-900 rounded-full text-white text-[10px] font-black uppercase tracking-widest">
           Live Entry
        </div>
      </div>

      <div className="space-y-4 mb-10 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
        {players.map((player) => {
          const isEliminated = eliminatedPlayerIds.has(player.id);
          return (
            <div
              key={player.id}
              className={`group flex items-center gap-6 p-6 rounded-3xl border transition-all duration-500 ${
                isEliminated
                  ? "bg-slate-50/50 border-slate-100 opacity-40 grayscale"
                  : "bg-white/80 border-white hover:bg-white"
              }`}
            >
              <div className="shrink-0 relative">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-xl text-white group-hover:rotate-6 transition-transform duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-500/20 animate-pulse-slow" />
                  <span className="relative z-10">{player.name.charAt(0).toUpperCase()}</span>
                </div>
                {isEliminated && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 border-4 border-white flex items-center justify-center">
                    <span className="text-[10px]">💀</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-lg text-slate-900 tracking-tight truncate group-hover:text-primary-600 transition-colors">
                  {player.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total:</div>
                   <div className="text-sm font-black text-primary-600">{player.totalScore}</div>
                </div>
              </div>

              <div className="w-32 shrink-0">
                <input
                  type="text"
                  inputMode="numeric"
                  disabled={isEliminated || isGameOver}
                  value={isEliminated ? "-" : scores[player.id] || ""}
                  onChange={(e) => updateScore(player.id, e.target.value)}
                  placeholder={isEliminated ? "-" : "0"}
                  className={`w-full px-4 py-4 bg-slate-50/50 border-2 border-slate-100 rounded-2xl text-center text-xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all duration-500 shadow-inner ${isEliminated ? "cursor-not-allowed opacity-50" : ""}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isGameOver}
        className={`btn-primary w-full py-6! text-lg! group/btn overflow-hidden relative ${isGameOver ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
        <span className="flex items-center justify-center gap-4 text-white relative z-10">
          <svg
            className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span className="tracking-tight">Submit Round {currentRound} Scores</span>
          <svg
            className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-500 opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>

      <div className="mt-8 p-6 bg-slate-900 rounded-3xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
             <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h4 className="text-white text-sm font-black tracking-tight mb-1">Negative Scoring</h4>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">
              To enter negative points (e.g., bonus rounds), simply type a minus sign before the value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
