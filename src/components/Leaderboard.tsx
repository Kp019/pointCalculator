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
    if (isEliminated) return "from-slate-200 to-slate-200";
    if (isPlayerWinner) return "from-yellow-400 to-orange-500 animate-pulse";
    switch (rank) {
      case 0:
        return "from-yellow-400 to-yellow-600";
      case 1:
        return "from-slate-300 to-slate-500";
      case 2:
        return "from-amber-600 to-amber-800";
      default:
        return "from-slate-600 to-slate-700";
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
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${rank + 1}`;
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
    <div className="card sticky top-8">
      <div className="flex flex-col mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <div className="flex gap-2">
            {config.winMetric !== "points" && (
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                {rounds.length}/{config.targetRounds} Rounds
              </span>
            )}
            {config.winMetric !== "rounds" && (
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold border border-primary-100">
                Target: {config.targetPoints} pts
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          Condition: {config.winCondition} points win
          {` (${config.gameMode})`}
        </div>
      </div>

      {winner && (
        <div className="mb-6 p-4 bg-linear-to-r from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400 rounded-2xl animate-bounce-subtle text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="text-4xl">👑</span>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase">
                Game Over!
              </h3>
              <p className="font-bold text-orange-600">
                {winner.name} is the Winner!
              </p>
            </div>
          </div>
        </div>
      )}

      {players.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <svg
            className="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p>Start playing to see rankings!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players.map((player, index) => {
            const isWinner = winner?.id === player.id;
            const isEliminated = eliminatedPlayerIds.has(player.id);
            return (
              <div
                key={player.id}
                className={`group flex items-center gap-2 p-2 rounded-2xl border transition-all duration-300 animate-slide-up hover:scale-[1.02] ${
                  isWinner
                    ? "bg-yellow-50 border-yellow-300 shadow-lg shadow-yellow-200"
                    : isEliminated
                      ? "bg-slate-50 border-slate-200 grayscale-[0.5] opacity-80"
                      : "bg-white border-slate-200 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-500/10"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${getRankColor(index, isWinner, isEliminated)} flex items-center justify-center font-bold text-xl shadow-lg ring-2 ring-white ring-offset-2 ring-offset-slate-100 transition-colors`}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/5 to-transparent" />
                  <span className="relative z-10 text-white">
                    {getRankEmoji(index, isWinner, isEliminated)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-bold text-xl truncate mb-1 ${isEliminated ? "text-slate-400 line-through decoration-2" : "text-slate-900"}`}
                  >
                    {player.name}
                  </h3>
                  {player.scores.length > 0 && (
                    <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-hide">
                      {player.scores.map((score, idx) => (
                        <span
                          key={idx}
                          onClick={() =>
                            handleScoreClick(player.id, player.name, idx, score)
                          }
                          className={`text-xs px-2.5 py-1 rounded-md font-bold cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all ${
                            isEliminated
                              ? "bg-slate-100 text-slate-400"
                              : score > 0
                                ? "bg-green-50 text-green-700 border border-green-100"
                                : score < 0
                                  ? "bg-red-50 text-red-700 border border-red-100"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                          title={`Round ${idx + 1} - Click to edit`}
                        >
                          {score > 0 ? "+" : ""}
                          {score}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className={`text-3xl font-black ${isWinner ? "text-orange-600" : isEliminated ? "text-slate-400" : "gradient-text"}`}
                  >
                    {player.totalScore}
                  </div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                    points
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Game Stats */}
      {rounds.length > 0 && (
        <div className="mt-6 p-5 bg-linear-to-br from-primary-50 via-accent-50 to-primary-50 border border-primary-100 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-5 h-5 text-primary-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wider">
              Game Stats
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-slate-400 text-xs uppercase tracking-wide block mb-1 font-bold">
                Rounds Played
              </span>
              <div className="font-black text-2xl text-slate-900">
                {rounds.length}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-slate-400 text-xs uppercase tracking-wide block mb-1 font-bold">
                Total Players
              </span>
              <div className="font-black text-2xl text-slate-900">
                {players.length}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-slate-400 text-xs uppercase tracking-wide block mb-1 font-bold">
                {config.winCondition === "highest" ? "Highest" : "Lowest"} Score
              </span>
              <div className="font-black text-2xl gradient-text">
                {players[0]?.totalScore || 0}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
              <span className="text-slate-400 text-xs uppercase tracking-wide block mb-1 font-bold">
                Current Leader
              </span>
              <div className="font-bold text-lg text-primary-600 truncate">
                {players[0]?.name || "-"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Score Modal */}
      {editingScore && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div
            className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Edit Points</h3>
              <p className="text-slate-500 mt-1">
                Updating {editingScore.playerName}&apos;s score for Round{" "}
                {editingScore.roundIndex + 1}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  New Score
                </label>
                <input
                  type="number"
                  autoFocus
                  value={newScoreValue}
                  onChange={(e) => setNewScoreValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary-500 focus:ring-0 transition-all text-xl font-bold text-center"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleUpdate}
                  className="btn-primary py-4 text-center justify-center"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingScore(null)}
                  className="btn-secondary py-4 text-center justify-center border-slate-200"
                >
                  Cancel
                </button>
              </div>

              <button
                onClick={handleDelete}
                className="w-full py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
              >
                Reset to 0
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
