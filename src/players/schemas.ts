import { z } from 'zod';

/**
 * Zod schema for Player injury information
 */
export const PlayerInjurySchema = z.object({
  designation: z.string().optional(),
  description: z.string().optional(),
  injDate: z.string().optional(),
});

/**
 * Zod schema for Player validation
 */
export const PlayerSchema = z.object({
  playerID: z.string().min(1),
  longName: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  jerseyNum: z.string().optional(),
  pos: z.string().min(1),
  team: z.string().min(2).max(3),
  teamID: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  bDay: z.string().optional(),
  college: z.string().optional(),
  draftYear: z.string().optional(),
  draftRound: z.string().optional(),
  draftPick: z.string().optional(),
  exp: z.string().optional(),
  injury: PlayerInjurySchema.optional(),
});

/**
 * Zod schema for Player statistics
 */
export const PlayerStatisticsSchema = z.object({
  playerID: z.string().min(1),
  season: z.string().min(4),
  team: z.string().min(2).max(3),
  gamesPlayed: z.number().nonnegative().optional(),
  gamesStarted: z.number().nonnegative().optional(),

  // Passing stats
  passingYards: z.number().optional(),
  passingTDs: z.number().nonnegative().optional(),
  passingINTs: z.number().nonnegative().optional(),
  passingCompletions: z.number().nonnegative().optional(),
  passingAttempts: z.number().nonnegative().optional(),

  // Rushing stats
  rushingYards: z.number().optional(),
  rushingTDs: z.number().nonnegative().optional(),
  rushingAttempts: z.number().nonnegative().optional(),

  // Receiving stats
  receivingYards: z.number().optional(),
  receivingTDs: z.number().nonnegative().optional(),
  receptions: z.number().nonnegative().optional(),
  targets: z.number().nonnegative().optional(),

  // Defense stats
  tackles: z.number().nonnegative().optional(),
  sacks: z.number().nonnegative().optional(),
  interceptions: z.number().nonnegative().optional(),
  forcedFumbles: z.number().nonnegative().optional(),

  // Kicking stats
  fgMade: z.number().nonnegative().optional(),
  fgAttempts: z.number().nonnegative().optional(),
  extraPointsMade: z.number().nonnegative().optional(),
  extraPointsAttempts: z.number().nonnegative().optional(),
});

/**
 * Schema for array of players
 */
export const PlayersResponseSchema = z.object({
  body: z.array(PlayerSchema),
});

/**
 * Schema for player statistics response
 */
export const PlayerStatsResponseSchema = z.object({
  body: PlayerStatisticsSchema,
});

/**
 * Schema for getNFLPlayerInfo options
 */
export const GetPlayerInfoOptionsSchema = z.object({
  playerName: z.string().optional(),
  playerID: z.string().optional(),
  getStats: z.boolean().optional(),
});

/**
 * Schema for getNFLGamesForPlayer options
 */
export const GetGamesForPlayerOptionsSchema = z.object({
  playerID: z.string().min(1),
  teamID: z.string().optional(),
  gameID: z.string().optional(),
  itemFormat: z.enum(['map', 'list']).optional(),
  numberOfGames: z.number().positive().optional(),
  fantasyPoints: z.boolean().optional(),
});

/**
 * Schema for player game log
 */
export const PlayerGameLogSchema = z.object({
  gameID: z.string(),
  playerID: z.string(),
  season: z.string(),
  week: z.string(),
  team: z.string(),
  opponent: z.string(),
  gameDate: z.string(),
  stats: z.record(z.unknown()), // Flexible stats object
  fantasyPoints: z.number().optional(),
});

/**
 * Schema for player game logs response
 */
export const PlayerGameLogsResponseSchema = z.object({
  body: z.array(PlayerGameLogSchema),
});

export type Player = z.infer<typeof PlayerSchema>;
export type PlayerStatistics = z.infer<typeof PlayerStatisticsSchema>;
export type PlayerInjury = z.infer<typeof PlayerInjurySchema>;
