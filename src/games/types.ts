// Re-export Zod-inferred types from schemas (single source of truth)
export type { Game, GameDetails, ScoringPlay, TeamGameStats } from './schemas.js';

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
