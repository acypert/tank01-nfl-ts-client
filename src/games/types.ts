/**
 * NFL Game entity
 */
export interface Game {
  /** Unique game identifier */
  gameID: string;
  /** Season type */
  seasonType: string;
  /** Away team abbreviation */
  away: string;
  /** Game date (YYYYMMDD) */
  gameDate: string;
  /** ESPN game ID */
  espnID: string;
  /** Home team ID */
  teamIDHome: string;
  /** Game status (e.g., "Scheduled", "InProgress", "Final") */
  gameStatus: string;
  /** Game week number */
  gameWeek: string;
  /** Away team ID */
  teamIDAway: string;
  /** Home team abbreviation */
  home: string;
  /** ESPN link */
  espnLink: string;
  /** CBS link */
  cbsLink: string;
  /** Game time */
  gameTime: string;
  /** Game time epoch */
  gameTime_epoch: string;
  /** Season year */
  season: string;
  /** Neutral site flag */
  neutralSite: string;
  /** Game status code */
  gameStatusCode: string;
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

/**
 * Options for getNFLGamesForWeek endpoint
 */
export interface GetGamesForWeekOptions {
  /** Week number (required) */
  week: string;
  /** Season year (optional, defaults to current) */
  season?: string;
  /** Season type: "reg", "post", "pre", "all" */
  seasonType?: 'reg' | 'post' | 'pre' | 'all';
}

/**
 * Options for getNFLBoxScore endpoint
 */
export interface GetBoxScoreOptions {
  /** Game ID (required, format: YYYYMMDD_AWAY@HOME) */
  gameID: string;
  /** Include play-by-play data */
  playByPlay?: boolean;
  /** Include fantasy points */
  fantasyPoints?: boolean;
}

/**
 * Options for getNFLGamesForDate endpoint
 */
export interface GetGamesForDateOptions {
  /** Game date (required, format: YYYYMMDD) */
  gameDate: string;
}

/**
 * Options for getNFLScoresOnly endpoint
 */
export interface GetScoresOnlyOptions {
  /** Season year */
  season?: string;
  /** Week number */
  week?: string;
  /** Game date (format: YYYYMMDD) */
  gameDate?: string;
  /** Top 25 ranked teams only */
  topTeamsOnly?: boolean;
}
