import { z } from 'zod';

/**
 * Zod schema for ScoringPlay validation
 */
export const ScoringPlaySchema = z.object({
  playID: z.string().optional(),
  team: z.string().min(2).max(3),
  quarter: z.string().optional(),
  time: z.string().optional(),
  description: z.string().optional(),
  points: z.number().nonnegative().optional(),
  scoreType: z.string().optional(),
});

/**
 * Zod schema for TeamGameStats validation
 */
export const TeamGameStatsSchema = z.object({
  team: z.string().min(2).max(3),
  totalYards: z.number().nonnegative().optional(),
  passingYards: z.number().optional(),
  rushingYards: z.number().optional(),
  turnovers: z.number().nonnegative().optional(),
  timeOfPossession: z.string().optional(),
  firstDowns: z.number().nonnegative().optional(),
});

/**
 * Zod schema for Game validation
 */
export const GameSchema = z.object({
  gameID: z.string().min(1),
  season: z.string().min(4),
  gameWeek: z.string().min(1),
  gameDate: z.string().min(1),
  gameTime: z.string().optional(),
  away: z.string().min(2).max(3),
  home: z.string().min(2).max(3),
  awayTeamID: z.string().optional(),
  homeTeamID: z.string().optional(),
  awayPts: z.number().nonnegative().optional(),
  homePts: z.number().nonnegative().optional(),
  gameStatus: z.string().optional(),
  gameStatusCode: z.string().optional(),
  venue: z.string().optional(),
  neutralSite: z.boolean().optional(),
  playoffs: z.boolean().optional(),
});

/**
 * Zod schema for GameDetails validation
 */
export const GameDetailsSchema = GameSchema.extend({
  scoringPlays: z.array(ScoringPlaySchema).optional(),
  teamStats: z
    .object({
      away: TeamGameStatsSchema.optional(),
      home: TeamGameStatsSchema.optional(),
    })
    .optional(),
});

/**
 * Schema for array of games
 */
export const GamesResponseSchema = z.object({
  body: z.array(GameSchema),
});

/**
 * Schema for game details response
 */
export const GameDetailsResponseSchema = z.object({
  body: GameDetailsSchema,
});

/**
 * Schema for getNFLGamesForWeek options
 */
export const GetGamesForWeekOptionsSchema = z.object({
  week: z.string().min(1),
  season: z.string().optional(),
  seasonType: z.enum(['reg', 'post', 'pre', 'all']).optional(),
});

/**
 * Schema for getNFLBoxScore options
 */
export const GetBoxScoreOptionsSchema = z.object({
  gameID: z.string().min(1),
  playByPlay: z.boolean().optional(),
  fantasyPoints: z.boolean().optional(),
});

/**
 * Schema for getNFLGamesForDate options
 */
export const GetGamesForDateOptionsSchema = z.object({
  gameDate: z.string().regex(/^\\d{8}$/),
});

/**
 * Schema for getNFLScoresOnly options
 */
export const GetScoresOnlyOptionsSchema = z
  .object({
    season: z.string().optional(),
    week: z.string().optional(),
    gameDate: z
      .string()
      .regex(/^\\d{8}$/)
      .optional(),
    topTeamsOnly: z.boolean().optional(),
  })
  .optional();

export type Game = z.infer<typeof GameSchema>;
export type GameDetails = z.infer<typeof GameDetailsSchema>;
export type ScoringPlay = z.infer<typeof ScoringPlaySchema>;
export type TeamGameStats = z.infer<typeof TeamGameStatsSchema>;
