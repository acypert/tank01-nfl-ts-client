// Re-export Zod-inferred types from schemas (single source of truth)
export type {
  Team,
  DepthChart,
  DepthChartPosition,
  RosterPlayer,
  RosterPlayerStats,
} from './schemas.js';

/**
 * Options for getNFLTeams endpoint
 */
export interface GetNFLTeamsOptions {
  /** Sort teams by specific field */
  sortBy?: string;
  /** Include team rosters in response */
  rosters?: boolean;
  /** Include team schedules in response */
  schedules?: boolean;
  /** Include top performers in response */
  topPerformers?: boolean;
  /** Include team statistics in response */
  teamStats?: boolean;
  /** Season year for team statistics */
  teamStatsSeason?: string;
  /** Season year for standings */
  standingsSeason?: string;
}

/**
 * Options for getNFLTeamRoster endpoint
 * Requires either teamID or teamAbv (mutually exclusive)
 */
export interface GetTeamRosterOptions {
  /** Team ID (e.g., "KC") - use this OR teamAbv */
  teamID?: string;
  /** Team abbreviation (e.g., "KC") - use this OR teamID */
  teamAbv?: string;
  /** Archive date for historical rosters (format: YYYYMMDD) */
  archiveDate?: string;
  /** Include player statistics in roster */
  getStats?: boolean;
  /** Include fantasy points in statistics (requires getStats: true) */
  fantasyPoints?: boolean;
}
