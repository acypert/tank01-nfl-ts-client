/**
 * Betting Odds Module - Zod Validation Schemas
 */

import { z } from 'zod';

// ========================================
// Betting Odds Schemas
// ========================================

/**
 * Schema for GetBettingOddsOptions validation
 */
export const GetBettingOddsOptionsSchema = z.object({
  gameDate: z
    .string()
    .regex(/^\d{8}$/)
    .optional(),
  gameID: z.string().optional(),
  itemFormat: z.enum(['map', 'list']).optional(),
  impliedTotals: z.boolean().optional(),
  playerProps: z.boolean().optional(),
  playerID: z.string().optional(),
});

export const SportsbookOddsSchema = z.object({
  totalUnder: z.string(),
  awayTeamSpread: z.string(),
  awayTeamSpreadOdds: z.string(),
  homeTeamSpread: z.string(),
  homeTeamSpreadOdds: z.string(),
  totalOverOdds: z.string(),
  totalUnderOdds: z.string(),
  awayTeamMLOdds: z.string(),
  homeTeamMLOdds: z.string(),
  totalOver: z.string(),
});

/**
 * Schema for GameOdds validation
 */
export const GameOddsSchema = z.object({
  awayTeam: z.string(),
  ballybet: SportsbookOddsSchema,
  bet365: SportsbookOddsSchema,
  betmgm: SportsbookOddsSchema,
  betrivers: SportsbookOddsSchema,
  caesars_sportsbook: SportsbookOddsSchema,
  draftkings: SportsbookOddsSchema,
  espnbet: SportsbookOddsSchema,
  fanduel: SportsbookOddsSchema,
  gameDate: z.string(),
  hardrock: SportsbookOddsSchema,
  homeTeam: z.string(),
  last_updated_e_time: z.string(),
  teamIDAway: z.string(),
  teamIDHome: z.string(),
  gameID: z.string(),
});

/**
 * Schema for betting odds response validation
 */
export const BettingOddsResponseSchema = z.object({
  body: z.record(GameOddsSchema),
});

// ========================================
// Zod-Inferred Types
// ========================================

export type GetBettingOddsOptions = z.infer<typeof GetBettingOddsOptionsSchema>;
export type SportsbookOdds = z.infer<typeof SportsbookOddsSchema>;
export type GameOdds = z.infer<typeof GameOddsSchema>;
export type BettingOddsResponse = z.infer<typeof BettingOddsResponseSchema>['body'];
