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
  playerID: string;
  playerName: string;
  team: string;
  pos: string;
  adp: number;
  adpFormatted?: string | undefined;
  bye?: string | number | undefined;
  [key: string]: unknown;
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
  playerID: string;
  playerName: string;
  team: string;
  pos: string;
  week?: string | undefined;
  season?: string | undefined;
  projectedPoints?: number | undefined;
  projections?: Record<string, number | string> | undefined;
  [key: string]: unknown;
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
export interface DFSPlayer {
  playerID: string;
  playerName: string;
  team: string;
  pos: string;
  opponent?: string | undefined;
  salary?: Record<string, number> | undefined; // DraftKings, FanDuel, Yahoo, etc.
  projectedPoints?: number | undefined;
  value?: number | undefined;
  [key: string]: unknown;
}
