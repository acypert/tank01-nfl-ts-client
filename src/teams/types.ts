/**
 * NFL Team entity
 */
export interface Team {
  /** Unique team identifier/abbreviation (e.g., "KC", "PHI") */
  teamID: string;
  /** Full team name (e.g., "Kansas City Chiefs") */
  teamName: string;
  /** Team's city */
  teamCity: string;
  /** Team abbreviation */
  teamAbv: string;
  /** Conference: "AFC" or "NFC" */
  conference: 'AFC' | 'NFC';
  /** Division: "North", "South", "East", or "West" */
  division: 'North' | 'South' | 'East' | 'West';
  /** Season wins */
  wins?: number | undefined;
  /** Season losses */
  losses?: number | undefined;
  /** Season ties */
  ties?: number | undefined;
  /** Current season year */
  seasonYear?: string | undefined;
}

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

/**
 * Depth chart position entry
 */
export interface DepthChartPosition {
  /** Player ID */
  playerID: string;
  /** Player name */
  playerName: string;
  /** Position on depth chart (1 = starter, 2 = backup, etc.) */
  depth: number;
  /** Position abbreviation (e.g., "QB", "RB") */
  position: string;
}

/**
 * Team depth chart
 */
export interface DepthChart {
  /** Team abbreviation */
  teamAbv: string;
  /** Team name */
  teamName: string;
  /** Depth chart positions by position group */
  depthChart: Record<string, DepthChartPosition[]>;
  /** Last updated timestamp */
  lastUpdated?: string | undefined;
}
