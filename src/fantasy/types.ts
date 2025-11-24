/**
 * Fantasy Football Module - Type Definitions
 *
 * This module provides types for fantasy football data including:
 * - Average Draft Position (ADP)
 * - Weekly/Seasonal Projections
 * - Daily Fantasy Sports (DFS) salaries and data
 */

// ========================================
// ADP Types
// ========================================

/**
 * Average Draft Position (ADP) type
 *
 * Supported formats:
 * - "halfPPR" - Half point per reception scoring
 * - "PPR" - Point per reception scoring
 * - "standard" - Standard scoring (no PPR)
 * - "bestBall" - Best ball format
 * - "IDP" - Individual defensive player leagues
 * - "superFlex" - Superflex format
 */
export type ADPType = 'halfPPR' | 'PPR' | 'standard' | 'bestBall' | 'IDP' | 'superFlex';

/**
 * Options for getNFLADP endpoint
 */
export interface GetADPOptions {
  /**
   * Type of ADP data to retrieve (required)
   */
  adpType: ADPType;

  /**
   * Optional date for historical ADP (format: YYYYMMDD)
   */
  adpDate?: string;

  /**
   * Optional position filter (e.g., "QB", "RB", "WR")
   */
  pos?: string;

  /**
   * Optional comma-separated list of players to exclude
   */
  filterOut?: string;
}

/**
 * Player ADP data
 */
export interface PlayerADP {
  posADP: string;
  overallADP: string;
  playerID: string;
  longName: string;
  teamAbv?: string | undefined;
  teamID?: string | undefined;
}

/**
 * ADP Response
 */
export interface ADPResponse {
  adpDate: string;
  adpType: string;
  adpList: PlayerADP[];
}

// ========================================
// Projections Types
// ========================================

/**
 * Options for getNFLProjections endpoint
 */
export interface GetProjectionsOptions {
  /**
   * Week number (1-18 for regular season)
   */
  week?: string;

  /**
   * Player ID to filter projections
   * Note: playerID overrides week and teamID filters
   */
  playerID?: string;

  /**
   * Team abbreviation to filter projections
   */
  teamID?: string;

  /**
   * Archive season year (e.g., "2023")
   */
  archiveSeason?: string;

  /**
   * Response format: "map" or "list"
   */
  itemFormat?: 'map' | 'list';
}

/**
 * Player projection data
 */
export interface PlayerProjection {
  twoPointConversion: string;
  Rushing: RushingProjection;
  Passing: PassingProjection;
  Receiving: ReceivingProjection;
  fumblesLost: string;
  pos: string;
  teamID: string;
  team: string;
  longName: string;
  playerID: string;
  fantasyPointsDefault: FantasyPoints;
  Kicking?: KickingProjection | undefined;
}

export interface RushingProjection {
  rushYds: string;
  carries: string;
  rushTD: string;
}

export interface PassingProjection {
  passAttempts: string;
  passTD: string;
  passYds: string;
  int: string;
  passCompletions: string;
}

export interface ReceivingProjection {
  receptions: string;
  recTD: string;
  targets: string;
  recYds: string;
}

export interface FantasyPoints {
  standard: string;
  PPR: string;
  halfPPR: string;
}

export interface KickingProjection {
  fgMade: string;
  fgMissed: string;
  xpMade: string;
  xpMissed: string;
}

export interface ProjectionsResponse {
  teamDefenseProjections: Record<string, TeamDefenseProjection>;
  playerProjections: Record<string, PlayerProjection>;
}

export interface TeamDefenseProjection {
  returnTD: string;
  defTD: string;
  safeties: string;
  teamID: string;
  fumbleRecoveries: string;
  ptsAgainst: string;
  teamAbv: string;
  interceptions: string;
  sacks: string;
  blockKick: string;
  fantasyPointsDefault: string;
}

// ========================================
// DFS Types
// ========================================

/**
 * Options for getNFLDFS endpoint
 */
export interface GetDFSOptions {
  /**
   * Date for DFS data (required, format: YYYYMMDD)
   */
  date: string;

  /**
   * Include team defense/special teams data
   */
  includeTeamDefense?: boolean;
}

/**
 * DFS player data
 */
export type DFSPlayer = unknown[];
