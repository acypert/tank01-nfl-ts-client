/**
 * Betting Odds Module - Type Definitions
 *
 * This module provides types for NFL betting odds and lines from multiple sportsbooks.
 */

// ========================================
// Betting Odds Types
// ========================================

/**
 * Options for getNFLBettingOdds endpoint
 *
 * **OR Parameter Requirement**: Must provide either `gameDate` OR `gameID` (not both, not neither)
 */
export interface GetBettingOddsOptions {
  /**
   * Game date (format: YYYYMMDD) - use this OR gameID
   */
  gameDate?: string | undefined;

  /**
   * Game ID (format: YYYYMMDD_AWAY@HOME) - use this OR gameDate
   */
  gameID?: string | undefined;

  /**
   * Response format: "map" or "list"
   */
  itemFormat?: 'map' | 'list' | undefined;

  /**
   * Include implied totals from odds
   */
  impliedTotals?: boolean | undefined;

  /**
   * Include player prop bets
   */
  playerProps?: boolean | undefined;

  /**
   * Filter player props by specific player ID
   */
  playerID?: string | undefined;
}

/**
 * Sportsbook odds for a specific game
 */
export interface GameOdds {
  gameID: string;
  gameDate: string;
  away: string;
  home: string;
  sportsbooks?: Record<string, SportsbookOdds> | undefined;
  playerProps?: PlayerProp[] | undefined;
  [key: string]: unknown;
}

/**
 * Odds from a specific sportsbook
 */
export interface SportsbookOdds {
  name: string;
  awaySpread?: number | undefined;
  homeSpread?: number | undefined;
  awaySpreadOdds?: number | undefined;
  homeSpreadOdds?: number | undefined;
  awayMoneyline?: number | undefined;
  homeMoneyline?: number | undefined;
  overUnder?: number | undefined;
  overOdds?: number | undefined;
  underOdds?: number | undefined;
  lastUpdated?: string | undefined;
  [key: string]: unknown;
}

/**
 * Player prop bet
 */
export interface PlayerProp {
  playerID: string;
  playerName: string;
  team: string;
  propType: string; // e.g., "passingYards", "touchdowns"
  line?: number | undefined;
  overOdds?: number | undefined;
  underOdds?: number | undefined;
  sportsbook?: string | undefined;
  [key: string]: unknown;
}
