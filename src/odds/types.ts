/**
 * Betting Odds Module - Type Definitions
 *
 * Re-exports Zod-inferred types from schemas as the single source of truth.
 */

export type {
  GetBettingOddsOptions,
  SportsbookOdds,
  GameOdds,
  BettingOddsResponse,
} from './schemas.js';

/**
 * Player prop bet
 * (Not currently covered by schemas - this is an extended type)
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
