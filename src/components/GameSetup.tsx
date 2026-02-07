import { useState } from "react";
import type { GameConfig, WinMetric, WinCondition, GameMode } from "../App";

interface GameSetupProps {
  onStartGame: (playerNames: string[], config: GameConfig) => void;
}

const GameSetup = ({ onStartGame }: GameSetupProps) => {
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const [error, setError] = useState("");
  const [winMetric, setWinMetric] = useState<WinMetric>("rounds");
  const [targetRounds, setTargetRounds] = useState(10);
  const [targetPoints, setTargetPoints] = useState(100);
  const [winCondition, setWinCondition] = useState<WinCondition>("highest");
  const [gameMode, setGameMode] = useState<GameMode>("sudden-death");

  const addPlayer = () => {
    setPlayerNames([...playerNames, ""]);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
    setError("");
  };

  const handleStartGame = () => {
    // Validate
    const filteredNames = playerNames.filter((name) => name.trim() !== "");

    if (filteredNames.length < 2) {
      setError("Please add at least 2 players");
      return;
    }

    const uniqueNames = new Set(filteredNames);
    if (uniqueNames.size !== filteredNames.length) {
      setError("Player names must be unique");
      return;
    }

    onStartGame(filteredNames, {
      winMetric,
      targetRounds,
      targetPoints,
      winCondition,
      gameMode,
    });
  };

  return (
    <div className="w-full animate-scale-in">
      <div className="card w-full flex flex-col md:flex-row gap-8">
        {/* Left Side: Player Setup */}
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold gradient-text">Players</h2>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
            {playerNames.map((name, index) => (
              <div
                key={index}
                className="flex gap-3 items-center animate-slide-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
                        {index + 1}
                      </div>
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updatePlayerName(index, e.target.value)}
                      placeholder={`Player ${index + 1} Name`}
                      className="w-full pl-16 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 shadow-inner hover:border-slate-300"
                      maxLength={20}
                    />
                  </div>
                </div>
                {playerNames.length > 2 && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="px-4 py-4 bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 group/btn shadow-sm"
                    title="Remove player"
                  >
                    <svg
                      className="w-5 h-5 text-red-500 group-hover/btn:rotate-90 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={addPlayer} className="btn-secondary w-full group">
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-primary-500 group-hover:scale-110 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Player
            </span>
          </button>
        </div>

        {/* Right Side: Game Rules */}
        <div className="flex-1 space-y-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 border-b border-slate-200 pb-4">
            Game Rules
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Winning Metric
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["rounds", "points", "both"] as WinMetric[]).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setWinMetric(metric)}
                    className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                      winMetric === metric
                        ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                        : "bg-white text-slate-600 border-slate-200 hover:border-primary-300"
                    }`}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={winMetric === "points" ? "opacity-40" : ""}>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Total Rounds
                </label>
                <input
                  type="number"
                  disabled={winMetric === "points"}
                  value={targetRounds}
                  onChange={(e) =>
                    setTargetRounds(parseInt(e.target.value) || 1)
                  }
                  className="input-field py-3 font-bold"
                  min="1"
                />
              </div>
              <div className={winMetric === "rounds" ? "opacity-40" : ""}>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Target Points
                </label>
                <input
                  type="number"
                  disabled={winMetric === "rounds"}
                  value={targetPoints}
                  onChange={(e) =>
                    setTargetPoints(parseInt(e.target.value) || 1)
                  }
                  className="input-field py-3 font-bold"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Win Condition
              </label>
              <div className="flex bg-white p-1 rounded-2xl border-2 border-slate-200">
                <button
                  onClick={() => setWinCondition("highest")}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    winCondition === "highest"
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Highest Score Wins
                </button>
                <button
                  onClick={() => setWinCondition("lowest")}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                    winCondition === "lowest"
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Lowest Score Wins
                </button>
              </div>
            </div>

            <div className="animate-slide-down">
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Ending Logic
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGameMode("sudden-death")}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    gameMode === "sudden-death"
                      ? "bg-primary-50 border-primary-500 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-sm font-bold mb-1 ${gameMode === "sudden-death" ? "text-primary-700" : "text-slate-700"}`}
                  >
                    Sudden Death
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    End when first person reaches target
                  </div>
                </button>
                <button
                  onClick={() => setGameMode("elimination")}
                  className={`p-3 rounded-xl border-2 transition-all text-left ${
                    gameMode === "elimination"
                      ? "bg-primary-50 border-primary-500 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`text-sm font-bold mb-1 ${gameMode === "elimination" ? "text-primary-700" : "text-slate-700"}`}
                  >
                    Elimination
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Play until only one person remains
                  </div>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-slide-down flex items-start gap-3">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button
            onClick={handleStartGame}
            className="btn-primary w-full group"
          >
            <span className="flex items-center justify-center gap-2 text-white text-lg">
              Start Game
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
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
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;
