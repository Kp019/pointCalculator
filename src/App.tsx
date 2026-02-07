import { useState } from "react";
import GameSetup from "./components/GameSetup";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import { useGameLogic } from "./hooks/useGameLogic";

export interface Player {
  id: string;
  name: string;
  scores: number[];
  totalScore: number;
}

export interface Round {
  roundNumber: number;
  scores: { [playerId: string]: number };
}

export type WinMetric = "rounds" | "points" | "both";
export type WinCondition = "highest" | "lowest";
export type GameMode = "sudden-death" | "elimination";

export interface GameConfig {
  winMetric: WinMetric;
  targetRounds: number;
  targetPoints: number;
  winCondition: WinCondition;
  gameMode: GameMode;
}

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [config, setConfig] = useState<GameConfig>({
    winMetric: "rounds",
    targetRounds: 10,
    targetPoints: 100,
    winCondition: "highest",
    gameMode: "sudden-death",
  });

  const { eliminatedPlayerIds, isGameOver, sortedPlayers } = useGameLogic({
    players,
    rounds,
    config,
  });

  const startGame = (playerNames: string[], gameConfig: GameConfig) => {
    const newPlayers: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      scores: [],
      totalScore: 0,
    }));
    setPlayers(newPlayers);
    setConfig(gameConfig);
    setGameStarted(true);
    setRounds([]);
    setCurrentRound(1);
  };

  const addRoundScores = (scores: { [playerId: string]: number }) => {
    // Prevent adding scores if game is over
    if (isGameOver) return;

    // Update players with new round scores
    const updatedPlayers = players.map((player) => {
      // If player is eliminated, they can't score points
      if (eliminatedPlayerIds.has(player.id)) {
        return {
          ...player,
          scores: [...player.scores, 0],
          // Total score doesn't change
        };
      }

      const roundScore = scores[player.id] || 0;
      return {
        ...player,
        scores: [...player.scores, roundScore],
        totalScore: player.totalScore + roundScore,
      };
    });

    // Add round to history
    const newRound: Round = {
      roundNumber: currentRound,
      scores,
    };

    setPlayers(updatedPlayers);
    setRounds([...rounds, newRound]);
    setCurrentRound(currentRound + 1);
  };

  const updateScore = (
    playerId: string,
    roundIndex: number,
    newScore: number,
  ) => {
    // Allows updates even if game over for corrections.
    const updatedRounds = rounds.map((round, idx) => {
      if (idx === roundIndex) {
        return {
          ...round,
          scores: {
            ...round.scores,
            [playerId]: newScore,
          },
        };
      }
      return round;
    });

    // Update players state
    const updatedPlayers = players.map((player) => {
      if (player.id === playerId) {
        const newScores = [...player.scores];
        newScores[roundIndex] = newScore;
        const newTotalScore = newScores.reduce((sum, s) => sum + s, 0);
        return {
          ...player,
          scores: newScores,
          totalScore: newTotalScore,
        };
      }
      return player;
    });

    setRounds(updatedRounds);
    setPlayers(updatedPlayers);
  };

  const deleteScore = (playerId: string, roundIndex: number) => {
    updateScore(playerId, roundIndex, 0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setPlayers([]);
    setRounds([]);
    setCurrentRound(1);
  };

  return (
    <div className="relative min-h-screen py-8 px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse-slow" />
        <div
          className="absolute bottom-0 -right-1/4 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex h-[90vh] w-full justify-center items-center">
        {/* Header */}

        {/* Main Content */}
        {!gameStarted ? (
          <div className="flex justify-center items-center w-full">
            <GameSetup onStartGame={startGame} />
          </div>
        ) : (
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
                    {players.length}{" "}
                    {players.length === 1 ? "player" : "players"}
                  </p>
                </div>
              </div>
              <button
                onClick={resetGame}
                className="btn-secondary group w-full sm:w-auto"
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Input */}
              <div className="lg:col-span-2 animate-slide-up">
                <GameBoard
                  players={players}
                  currentRound={currentRound}
                  onSubmitScores={addRoundScores}
                  eliminatedPlayerIds={eliminatedPlayerIds}
                  isGameOver={isGameOver}
                />
              </div>

              {/* Leaderboard */}
              <div
                className="animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <Leaderboard
                  players={sortedPlayers}
                  rounds={rounds}
                  config={config}
                  onUpdateScore={updateScore}
                  onDeleteScore={deleteScore}
                  eliminatedPlayerIds={eliminatedPlayerIds}
                  isGameOver={isGameOver}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
