/**
 * NFL Game entity
 */
export interface Game {
  /** Unique game identifier */
  gameID: string;
  /** Season year */
  season: string;
  /** Game week number */
  gameWeek: string;
  /** Game date (ISO format) */
  gameDate: string;
  /** Game time */
  gameTime?: string | undefined;
  /** Away team abbreviation */
  away: string;
  /** Home team abbreviation */
  home: string;
  /** Away team ID */
  awayTeamID?: string | undefined;
  /** Home team ID */
  homeTeamID?: string | undefined;
  /** Away team score */
  awayPts?: number | undefined;
  /** Home team score */
  homePts?: number | undefined;
  /** Game status (e.g., "Scheduled", "InProgress", "Final") */
  gameStatus?: string | undefined;
  /** Game status code */
  gameStatusCode?: string | undefined;
  /** Stadium/venue name */
  venue?: string | undefined;
  /** Neutral site flag */
  neutralSite?: boolean | undefined;
  /** Playoff game flag */
  playoffs?: boolean | undefined;
}

/**
 * Game schedule filters
 */
export interface GameScheduleFilters {
  /** Filter by season year */
  season?: string | undefined;
  /** Filter by week number */
  week?: string | undefined;
  /** Filter by team abbreviation */
  team?: string | undefined;
  /** Filter by game status */
  status?: 'scheduled' | 'live' | 'final' | 'all' | undefined;
  /** Include playoff games only */
  playoffsOnly?: boolean | undefined;
}

/**
 * Detailed game information with scoring breakdown
 */
export interface GameDetails extends Game {
  /** Quarter-by-quarter scoring */
  scoringPlays?: ScoringPlay[] | undefined;
  /** Team statistics */
  teamStats?:
    | {
        away?: TeamGameStats | undefined;
        home?: TeamGameStats | undefined;
      }
    | undefined;
}

/**
 * Scoring play in a game
 */
export interface ScoringPlay {
  /** Play identifier */
  playID?: string | undefined;
  /** Team that scored */
  team: string;
  /** Quarter */
  quarter?: string | undefined;
  /** Time remaining */
  time?: string | undefined;
  /** Play description */
  description?: string | undefined;
  /** Points scored */
  points?: number | undefined;
  /** Score type (TD, FG, Safety, etc.) */
  scoreType?: string | undefined;
}

/**
 * Team statistics for a specific game
 */
export interface TeamGameStats {
  /** Team abbreviation */
  team: string;
  /** Total yards */
  totalYards?: number | undefined;
  /** Passing yards */
  passingYards?: number | undefined;
  /** Rushing yards */
  rushingYards?: number | undefined;
  /** Turnovers */
  turnovers?: number | undefined;
  /** Time of possession */
  timeOfPossession?: string | undefined;
  /** First downs */
  firstDowns?: number | undefined;
}
