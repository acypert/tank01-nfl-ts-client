/**
 * Live game data entity
 */
export interface LiveGame {
  /** Unique game identifier */
  gameID: string;
  /** Away team abbreviation */
  away: string;
  /** Home team abbreviation */
  home: string;
  /** Away team score */
  awayPts: number;
  /** Home team score */
  homePts: number;
  /** Current quarter */
  quarter: string;
  /** Time remaining in quarter */
  gameTime?: string | undefined;
  /** Game clock */
  gameClock?: string | undefined;
  /** Possession (team abbreviation) */
  possession?: string | undefined;
  /** Down (1-4) */
  down?: number | undefined;
  /** Yards to go */
  yardsToGo?: number | undefined;
  /** Field position */
  yardLine?: string | undefined;
  /** Last play description */
  lastPlay?: string | undefined;
}

/**
 * Live box score with detailed statistics
 */
export interface LiveBoxScore extends LiveGame {
  /** Quarter-by-quarter scores */
  quarters?: QuarterScore[] | undefined;
  /** Team statistics */
  teamStats?:
    | {
        away?: LiveTeamStats | undefined;
        home?: LiveTeamStats | undefined;
      }
    | undefined;
  /** Player statistics */
  playerStats?: LivePlayerStats[] | undefined;
}

/**
 * Quarter score breakdown
 */
export interface QuarterScore {
  /** Quarter number */
  quarter: string;
  /** Away team points in quarter */
  awayScore: number;
  /** Home team points in quarter */
  homeScore: number;
}

/**
 * Live team statistics
 */
export interface LiveTeamStats {
  /** Team abbreviation */
  team: string;
  /** Total yards */
  totalYards?: number | undefined;
  /** Passing yards */
  passingYards?: number | undefined;
  /** Rushing yards */
  rushingYards?: number | undefined;
  /** First downs */
  firstDowns?: number | undefined;
  /** Third down efficiency */
  thirdDowns?: string | undefined;
  /** Fourth down efficiency */
  fourthDowns?: string | undefined;
  /** Turnovers */
  turnovers?: number | undefined;
  /** Time of possession */
  timeOfPossession?: string | undefined;
}

/**
 * Live player statistics (minimal for live updates)
 */
export interface LivePlayerStats {
  /** Player ID */
  playerID: string;
  /** Player name */
  playerName: string;
  /** Team abbreviation */
  team: string;
  /** Position */
  position: string;
  /** Passing yards (QB) */
  passingYards?: number | undefined;
  /** Passing TDs (QB) */
  passingTDs?: number | undefined;
  /** Rushing yards */
  rushingYards?: number | undefined;
  /** Rushing TDs */
  rushingTDs?: number | undefined;
  /** Receiving yards */
  receivingYards?: number | undefined;
  /** Receptions */
  receptions?: number | undefined;
  /** Receiving TDs */
  receivingTDs?: number | undefined;
}

/**
 * Play-by-play event
 */
export interface PlayByPlayEvent {
  /** Play ID */
  playID: string;
  /** Game ID */
  gameID: string;
  /** Quarter */
  quarter: string;
  /** Time */
  time?: string | undefined;
  /** Team with possession */
  team: string;
  /** Down */
  down?: number | undefined;
  /** Yards to go */
  yardsToGo?: number | undefined;
  /** Yard line */
  yardLine?: string | undefined;
  /** Play description */
  description: string;
  /** Play type (pass, rush, punt, etc.) */
  playType?: string | undefined;
  /** Yards gained */
  yards?: number | undefined;
}
