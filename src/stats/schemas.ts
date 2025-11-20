import { z } from 'zod';

/**
 * Zod schema for TeamAdvancedStats validation
 */
export const TeamAdvancedStatsSchema = z.object({
  team: z.string().min(2).max(3),
  season: z.string().min(4),
  offensiveYardsPerGame: z.number().nonnegative().optional(),
  defensiveYardsPerGame: z.number().nonnegative().optional(),
  pointsPerGame: z.number().nonnegative().optional(),
  pointsAllowedPerGame: z.number().nonnegative().optional(),
  turnoverDifferential: z.number().optional(),
  sacks: z.number().nonnegative().optional(),
  sacksAllowed: z.number().nonnegative().optional(),
  thirdDownPct: z.number().nonnegative().optional(),
  redZonePct: z.number().nonnegative().optional(),
});

/**
 * Zod schema for PlayerAdvancedStats validation
 */
export const PlayerAdvancedStatsSchema = z.object({
  playerID: z.string().min(1),
  playerName: z.string().min(1),
  team: z.string().min(2).max(3),
  position: z.string().min(1),
  season: z.string().min(4),

  // QB stats
  qbRating: z.number().nonnegative().optional(),
  completionPct: z.number().nonnegative().optional(),
  yardsPerAttempt: z.number().optional(),
  intPct: z.number().nonnegative().optional(),

  // RB stats
  yardsPerCarry: z.number().optional(),
  brokenTackles: z.number().nonnegative().optional(),
  yardsAfterContact: z.number().optional(),

  // WR/TE stats
  catchPct: z.number().nonnegative().optional(),
  yardsPerReception: z.number().optional(),
  yardsAfterCatch: z.number().optional(),
  dropPct: z.number().nonnegative().optional(),

  // Defense stats
  tacklesForLoss: z.number().nonnegative().optional(),
  qbHits: z.number().nonnegative().optional(),
  passesDefended: z.number().nonnegative().optional(),
});

/**
 * Zod schema for TeamRankings validation
 */
export const TeamRankingsSchema = z.object({
  team: z.string().min(2).max(3),
  season: z.string().min(4),
  offensiveRank: z.number().positive().optional(),
  defensiveRank: z.number().positive().optional(),
  scoringOffenseRank: z.number().positive().optional(),
  scoringDefenseRank: z.number().positive().optional(),
  passingOffenseRank: z.number().positive().optional(),
  rushingOffenseRank: z.number().positive().optional(),
  totalDefenseRank: z.number().positive().optional(),
});

/**
 * Zod schema for PlayerProjections validation
 */
export const PlayerProjectionsSchema = z.object({
  playerID: z.string().min(1),
  playerName: z.string().min(1),
  team: z.string().min(2).max(3),
  position: z.string().min(1),
  week: z.string().min(1),
  projectedPassingYards: z.number().nonnegative().optional(),
  projectedPassingTDs: z.number().nonnegative().optional(),
  projectedRushingYards: z.number().optional(),
  projectedRushingTDs: z.number().nonnegative().optional(),
  projectedReceivingYards: z.number().optional(),
  projectedReceptions: z.number().nonnegative().optional(),
  projectedReceivingTDs: z.number().nonnegative().optional(),
  projectedFantasyPoints: z.number().optional(),
});

/**
 * Schema for team advanced stats response
 */
export const TeamAdvancedStatsResponseSchema = z.object({
  body: TeamAdvancedStatsSchema,
});

/**
 * Schema for player advanced stats response
 */
export const PlayerAdvancedStatsResponseSchema = z.object({
  body: PlayerAdvancedStatsSchema,
});

/**
 * Schema for team rankings response
 */
export const TeamRankingsResponseSchema = z.object({
  body: z.array(TeamRankingsSchema),
});

/**
 * Schema for player projections response
 */
export const PlayerProjectionsResponseSchema = z.object({
  body: PlayerProjectionsSchema,
});

export type TeamAdvancedStats = z.infer<typeof TeamAdvancedStatsSchema>;
export type PlayerAdvancedStats = z.infer<typeof PlayerAdvancedStatsSchema>;
export type TeamRankings = z.infer<typeof TeamRankingsSchema>;
export type PlayerProjections = z.infer<typeof PlayerProjectionsSchema>;
