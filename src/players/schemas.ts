import { z } from 'zod';

/**
 * Zod schema for Player injury information
 */
export const PlayerInjurySchema = z.object({
  designation: z.string(),
  description: z.string(),
  injDate: z.string(),
  injReturnDate: z.string(),
});

/**
 * Zod schema for Player validation
 */
export const PlayerSchema = z.object({
  playerID: z.string().min(1),
  longName: z.string().min(1),
  jerseyNum: z.string(),
  pos: z.string().min(1),
  team: z.string().min(2).max(3),
  height: z.string(),
  weight: z.string(),
  bDay: z.string(),
  school: z.string(),
  exp: z.string(),
  injury: PlayerInjurySchema,
  age: z.string(),
  espnID: z.string(),
  espnName: z.string(),
  espnLink: z.string().url(),
  espnHeadshot: z.string().url(),
  espnIDFull: z.string(),
  cbsPlayerID: z.string(),
  cbsLongName: z.string(),
  cbsShortName: z.string(),
  cbsPlayerIDFull: z.string(),
  yahooPlayerID: z.string(),
  yahooLink: z.string().url(),
  sleeperBotID: z.string(),
  fRefID: z.string(),
  rotoWirePlayerID: z.string(),
  rotoWirePlayerIDFull: z.string(),
  fantasyProsLink: z.string().url(),
  fantasyProsPlayerID: z.string(),
  lastGamePlayed: z.string(),
  isFreeAgent: z.string(),
  firstSeen: z.string(),
  teamID: z.string(),
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

export const DefenseStatsSchema = z.object({
  fumblesLost: z.string().optional().or(z.undefined()),
  defensiveInterceptions: z.string(),
  forcedFumbles: z.string(),
  fumbles: z.string().optional().or(z.undefined()),
  fumblesRecovered: z.string().optional().or(z.undefined()),
});

export const PassingStatsSchema = z.object({
  qbr: z.string(),
  rtg: z.string(),
  sacked: z.string(),
  passAttempts: z.string(),
  passAvg: z.string(),
  passTD: z.string(),
  passYds: z.string(),
  int: z.string(),
  passCompletions: z.string(),
  passingTwoPointConversion: z.string().optional(),
});

export const ReceivingStatsSchema = z.object({
  receptions: z.string(),
  recTD: z.string(),
  longRec: z.string(),
  targets: z.string(),
  recYds: z.string(),
  recAvg: z.string(),
});

export const RushingStatsSchema = z.object({
  rushAvg: z.string(),
  rushYds: z.string(),
  carries: z.string(),
  longRush: z.string(),
  rushTD: z.string(),
  rushingTwoPointConversion: z.string().optional(),
});

export const ScoringPlaySchema = z.object({
  score: z.string(),
  scorePeriod: z.string(),
  homeScore: z.string(),
  awayScore: z.string(),
  teamID: z.string(),
  scoreDetails: z.string(),
  scoreType: z.string(),
  scoreTime: z.string(),
  team: z.string(),
  playerIDs: z.array(z.string()),
});

export const SnapCountsSchema = z.object({
  offSnapPct: z.string(),
  defSnap: z.string(),
  stSnap: z.string(),
  stSnapPct: z.string(),
  offSnap: z.string(),
  defSnapPct: z.string(),
});

export const PlayerGameSchema = z.object({
  Defense: DefenseStatsSchema.optional().or(z.undefined()),
  Passing: PassingStatsSchema.optional().or(z.undefined()),
  Receiving: ReceivingStatsSchema.optional().or(z.undefined()),
  Rushing: RushingStatsSchema.optional().or(z.undefined()),
  longName: z.string(),
  playerID: z.string(),
  scoringPlays: z.array(ScoringPlaySchema).optional().or(z.undefined()),
  snapCounts: SnapCountsSchema.optional().or(z.undefined()),
  team: z.string(),
  teamAbv: z.string(),
  teamID: z.string(),
  gameID: z.string(),
});

/**
 * Schema for player game logs response
 */
export const PlayerGameLogsResponseSchema = z.object({
  body: z.record(PlayerGameSchema),
});

// Export all Zod-inferred types as the source of truth
export type Player = z.infer<typeof PlayerSchema>;
export type PlayerStatistics = z.infer<typeof PlayerStatisticsSchema>;
export type PlayerInjury = z.infer<typeof PlayerInjurySchema>;
export type DefenseStats = z.infer<typeof DefenseStatsSchema>;
export type PassingStats = z.infer<typeof PassingStatsSchema>;
export type ReceivingStats = z.infer<typeof ReceivingStatsSchema>;
export type RushingStats = z.infer<typeof RushingStatsSchema>;
export type ScoringPlay = z.infer<typeof ScoringPlaySchema>;
export type SnapCounts = z.infer<typeof SnapCountsSchema>;
export type PlayerGame = z.infer<typeof PlayerGameSchema>;
export type PlayerGameLog = z.infer<typeof PlayerGameLogsResponseSchema>['body'];
