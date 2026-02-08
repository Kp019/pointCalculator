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

export interface SavedRule {
  id: string;
  name: string;
  config: GameConfig;
}

export interface SavedGame {
  id: string;
  name: string;
  config: GameConfig;
  players: Player[];
  rounds: Round[];
  currentRound: number;
  winner: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  date?: string; // Legacy
}
