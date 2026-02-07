import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import Leaderboard from "../components/Leaderboard";
import { useAppSelector, useAppDispatch } from "../store";
import {
  addRoundScores,
  updateScore,
  deleteScore,
  selectEliminatedPlayerIds,
  selectSortedPlayers,
} from "../store/slices/gameSlice";
import { saveGame } from "../store/slices/historySlice";
import { addToast, showModal } from "../store/slices/uiSlice";

const GamePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const game = useAppSelector((state) => state.game);
  const { gameStarted, currentRound, players, rounds, config, gameEnded } =
    game;
  const eliminatedPlayerIds = useAppSelector(selectEliminatedPlayerIds);
  const sortedPlayers = useAppSelector(selectSortedPlayers);

  useEffect(() => {
    if (!gameStarted) {
      navigate("/");
    }
  }, [gameStarted, navigate]);

  if (!gameStarted || !config) return null;

  const handleAddRoundScores = (scores: { [playerId: string]: number }) => {
    dispatch(addRoundScores(scores));
  };

  const handleUpdateScore = (
    playerId: string,
    roundIndex: number,
    newScore: number,
  ) => {
    dispatch(updateScore({ playerId, roundIndex, newScore }));
  };

  const handleDeleteScore = (playerId: string, roundIndex: number) => {
    dispatch(deleteScore({ playerId, roundIndex }));
  };

  const handleSaveGame = () => {
    const gameToSave = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      name: `Game ${new Date().toLocaleDateString()}`,
      players: players.map((p) => p.name),
      winner: gameEnded ? sortedPlayers[0]?.name : undefined,
      config: config,
      rounds: rounds,
      currentRound: currentRound,
      gameState: game,
    };
    dispatch(saveGame(gameToSave));
    dispatch(
      addToast({ message: "Game Saved Successfully!", type: "success" }),
    );
  };

  const handleResetGame = () => {
    dispatch(
      showModal({
        title: "Reset Game?",
        message:
          "Are you sure you want to reset the current game? All unsaved progress will be lost.",
        confirmLabel: "Reset Game",
        onConfirm: "game/resetGame",
        type: "danger",
      }),
    );
  };

  return (
    <div className="space-y-8 w-full">
      {/* Game Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 card animate-slide-down">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <svg
              className="w-7 h-7 text-white"
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
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Round {currentRound}
            </h2>
            <p className="text-slate-500 flex items-center gap-2 mt-1 font-medium">
              <svg
                className="w-4 h-4 text-primary-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {players.length} {players.length === 1 ? "player" : "players"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleSaveGame}
            className="btn-primary group flex-1 sm:flex-none"
          >
            <span className="flex items-center justify-center gap-2 text-white">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              Save Game
            </span>
          </button>
          <button
            onClick={handleResetGame}
            className="btn-secondary group flex-1 sm:flex-none"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              New Game
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Score Input */}
        <div className="lg:col-span-2 animate-slide-up">
          <GameBoard
            players={players}
            currentRound={currentRound}
            onSubmitScores={handleAddRoundScores}
            eliminatedPlayerIds={eliminatedPlayerIds}
            isGameOver={gameEnded}
          />
        </div>

        {/* Leaderboard */}
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Leaderboard
            players={sortedPlayers}
            rounds={rounds}
            config={config}
            onUpdateScore={handleUpdateScore}
            onDeleteScore={handleDeleteScore}
            eliminatedPlayerIds={eliminatedPlayerIds}
            isGameOver={gameEnded}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
