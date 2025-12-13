// Re-export Zod-inferred types from schemas (single source of truth)
export type {
  Player,
  PlayerInjury,
  PlayerStatistics,
  DefenseStats,
  PassingStats,
  ReceivingStats,
  RushingStats,
  ScoringPlay,
  SnapCounts,
  PlayerGame,
  PlayerGameLog,
} from './schemas.js';

/**
 * Player search filters
 */
export interface PlayerSearchFilters {
  /** Filter by team abbreviation */
  team?: string | undefined;
  /** Filter by position */
  position?: string | undefined;
  /** Filter by player name (partial match) */
  name?: string | undefined;
  /** Filter by injury status */
  availabilityStatus?: 'active' | 'injured' | 'all' | undefined;
  /** Filter by rookie status */
  isRookie?: boolean | undefined;
}

/**
 * Options for getNFLPlayerInfo endpoint
 * Requires either playerName or playerID (mutually exclusive)
 */
export interface GetPlayerInfoOptions {
  /** Player name (e.g., "Brock Purdy") - use this OR playerID */
  playerName?: string;
  /** Player ID (e.g., "4381786") - use this OR playerName */
  playerID?: string;
  /** Include player statistics for the current season in response */
  getStats?: boolean;
}

/**
 * Options for getNFLGamesForPlayer endpoint
 */
export interface GetGamesForPlayerOptions {
  /** Player ID */
  playerID: string;
  /** Optional team ID filter */
  teamID?: string;
  /** Optional game ID filter */
  gameID?: string;
  /** Response format: "map" or "list" */
  itemFormat?: 'map' | 'list';
  /** Number of games to return */
  numberOfGames?: number;
  /** Include fantasy points (defaults to false when omitted) */
  fantasyPoints?: boolean;
}
