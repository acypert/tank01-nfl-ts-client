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

/**
 * Schema for SportsbookOdds validation
 */
export const SportsbookOddsSchema = z
  .object({
    name: z.string(),
    awaySpread: z.number().optional(),
    homeSpread: z.number().optional(),
    awaySpreadOdds: z.number().optional(),
    homeSpreadOdds: z.number().optional(),
    awayMoneyline: z.number().optional(),
    homeMoneyline: z.number().optional(),
    overUnder: z.number().optional(),
    overOdds: z.number().optional(),
    underOdds: z.number().optional(),
    lastUpdated: z.string().optional(),
  })
  .passthrough();

/**
 * Schema for PlayerProp validation
 */
export const PlayerPropSchema = z
  .object({
    playerID: z.string(),
    playerName: z.string(),
    team: z.string(),
    propType: z.string(),
    line: z.number().optional(),
    overOdds: z.number().optional(),
    underOdds: z.number().optional(),
    sportsbook: z.string().optional(),
  })
  .passthrough();

/**
 * Schema for GameOdds validation
 */
export const GameOddsSchema = z
  .object({
    gameID: z.string(),
    gameDate: z.string(),
    away: z.string(),
    home: z.string(),
    sportsbooks: z.record(SportsbookOddsSchema).optional(),
    playerProps: z.array(PlayerPropSchema).optional(),
  })
  .passthrough();

/**
 * Schema for betting odds response validation
 */
export const BettingOddsResponseSchema = z.object({
  body: z.array(GameOddsSchema),
});
