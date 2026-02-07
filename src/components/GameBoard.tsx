import { useState } from "react";
import type { Player } from "../App";

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
    // Allow empty string, numbers, and negative numbers
    if (score === "" || score === "-" || /^-?\d*$/.test(score)) {
      setScores({ ...scores, [playerId]: score });
    }
  };

  const handleSubmit = () => {
    if (isGameOver) return;

    // Convert scores to numbers, default to 0 if empty
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
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">
        Enter Scores for Round {currentRound}
      </h2>

      <div className="space-y-4 mb-6">
        {players.map((player, index) => {
          const isEliminated = eliminatedPlayerIds.has(player.id);
          return (
            <div
              key={player.id}
              className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 animate-slide-up shadow-sm ${
                isEliminated
                  ? "bg-slate-50 border-slate-200 opacity-60 grayscale-[0.8]"
                  : "bg-white border-slate-200 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/5"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-400 to-accent-400 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-primary-500/20">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    {isEliminated ? (
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-500 border-2 border-white flex items-center justify-center"
                        title="Eliminated"
                      >
                        <span className="text-[10px]">💀</span>
                      </div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {player.name}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                      <span>Total:</span>
                      <span className="text-primary-600 font-bold text-base">
                        {player.totalScore}
                      </span>
                      <span className="text-xs">pts</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-32">
                <input
                  type="text"
                  inputMode="numeric"
                  disabled={isEliminated || isGameOver}
                  value={isEliminated ? "-" : scores[player.id] || ""}
                  onChange={(e) => updateScore(player.id, e.target.value)}
                  placeholder={isEliminated ? "-" : "0"}
                  className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-center text-xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all duration-300 shadow-inner ${isEliminated ? "cursor-not-allowed bg-slate-100 text-slate-400" : ""}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isGameOver}
        className={`btn-primary w-full text-lg py-5 font-bold group ${isGameOver ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span className="flex items-center justify-center gap-3 text-white">
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Submit Round {currentRound} Scores
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
      </button>

      <div className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl">
        <p className="text-sm text-primary-700 text-center flex items-center justify-center gap-2 font-medium">
          <svg
            className="w-5 h-5 flex-shrink-0 text-primary-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>Tip: You can enter negative scores by typing a minus sign</span>
        </p>
      </div>
    </div>
  );
};

export default GameBoard;
