import type { PlayerGame } from "../players/types.js";

export interface LiveBoxScore {
  DST: {
    away: Dst;
    home: Dst;
  };
  Referees: string;
  arena: string;
  arenaCapacity: string;
  attendance: string;
  away: string;
  awayPts: string;
  awayResult: string;
  currentPeriod: string;
  gameClock: string;
  gameDate: string;
  gameLocation: string;
  gameStatus: string;
  gameWeek: string;
  home: string;
  homePts: string;
  homeResult: string;
  lineScore: LineScore;
  network: string;
  playerStats: Record<string, PlayerGame>;
}

export interface Dst {
  teamAbv: string;
  teamID: string;
  defTD: string;
  defensiveInterceptions: string;
  sacks: string;
  ydsAllowed: string;
  fumblesRecovered: string;
  ptsAllowed: string;
  safeties: string;
}

export interface LineScore {
  period: string;
  gameClock: string;
  away: LineScoreTeam;
  home: LineScoreTeam;
}

export interface LineScoreTeam {
  Q1: string;
  Q2: string;
  Q3: string;
  Q4: string;
  teamID: string;
  currentlyInPossession: string;
  totalPts: string;
  teamAbv: string;
}
