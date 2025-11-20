import { z } from 'zod';

/**
 * Zod schema for QuarterScore validation
 */
export const QuarterScoreSchema = z.object({
  quarter: z.string().min(1),
  awayScore: z.number().nonnegative(),
  homeScore: z.number().nonnegative(),
});

/**
 * Zod schema for LiveTeamStats validation
 */
export const LiveTeamStatsSchema = z.object({
  team: z.string().min(2).max(3),
  totalYards: z.number().nonnegative().optional(),
  passingYards: z.number().optional(),
  rushingYards: z.number().optional(),
  firstDowns: z.number().nonnegative().optional(),
  thirdDowns: z.string().optional(),
  fourthDowns: z.string().optional(),
  turnovers: z.number().nonnegative().optional(),
  timeOfPossession: z.string().optional(),
});

/**
 * Zod schema for LivePlayerStats validation
 */
export const LivePlayerStatsSchema = z.object({
  playerID: z.string().min(1),
  playerName: z.string().min(1),
  team: z.string().min(2).max(3),
  position: z.string().min(1),
  passingYards: z.number().optional(),
  passingTDs: z.number().nonnegative().optional(),
  rushingYards: z.number().optional(),
  rushingTDs: z.number().nonnegative().optional(),
  receivingYards: z.number().optional(),
  receptions: z.number().nonnegative().optional(),
  receivingTDs: z.number().nonnegative().optional(),
});

/**
 * Zod schema for LiveGame validation
 */
export const LiveGameSchema = z.object({
  gameID: z.string().min(1),
  away: z.string().min(2).max(3),
  home: z.string().min(2).max(3),
  awayPts: z.number().nonnegative(),
  homePts: z.number().nonnegative(),
  quarter: z.string().min(1),
  gameTime: z.string().optional(),
  gameClock: z.string().optional(),
  possession: z.string().optional(),
  down: z.number().min(1).max(4).optional(),
  yardsToGo: z.number().nonnegative().optional(),
  yardLine: z.string().optional(),
  lastPlay: z.string().optional(),
});

/**
 * Zod schema for LiveBoxScore validation
 */
export const LiveBoxScoreSchema = LiveGameSchema.extend({
  quarters: z.array(QuarterScoreSchema).optional(),
  teamStats: z
    .object({
      away: LiveTeamStatsSchema.optional(),
      home: LiveTeamStatsSchema.optional(),
    })
    .optional(),
  playerStats: z.array(LivePlayerStatsSchema).optional(),
});

/**
 * Zod schema for PlayByPlayEvent validation
 */
export const PlayByPlayEventSchema = z.object({
  playID: z.string().min(1),
  gameID: z.string().min(1),
  quarter: z.string().min(1),
  time: z.string().optional(),
  team: z.string().min(2).max(3),
  down: z.number().min(1).max(4).optional(),
  yardsToGo: z.number().nonnegative().optional(),
  yardLine: z.string().optional(),
  description: z.string().min(1),
  playType: z.string().optional(),
  yards: z.number().optional(),
});

/**
 * Schema for array of live games
 */
export const LiveGamesResponseSchema = z.object({
  body: z.array(LiveGameSchema),
});

/**
 * Schema for live box score response
 */
export const LiveBoxScoreResponseSchema = z.object({
  body: LiveBoxScoreSchema,
});

/**
 * Schema for play-by-play response
 */
export const PlayByPlayResponseSchema = z.object({
  body: z.array(PlayByPlayEventSchema),
});

export type LiveGame = z.infer<typeof LiveGameSchema>;
export type LiveBoxScore = z.infer<typeof LiveBoxScoreSchema>;
export type QuarterScore = z.infer<typeof QuarterScoreSchema>;
export type LiveTeamStats = z.infer<typeof LiveTeamStatsSchema>;
export type LivePlayerStats = z.infer<typeof LivePlayerStatsSchema>;
export type PlayByPlayEvent = z.infer<typeof PlayByPlayEventSchema>;
