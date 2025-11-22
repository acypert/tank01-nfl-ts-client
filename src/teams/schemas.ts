import { z } from 'zod';

/**
 * Zod schema for Team validation
 */
export const TeamSchema = z.object({
  teamID: z
    .string()
    .min(2)
    .max(3)
    .regex(/^[A-Z]+$/),
  teamName: z.string().min(1),
  teamCity: z.string().min(1),
  teamAbv: z.string().min(2).max(3),
  conference: z.enum(['AFC', 'NFC']),
  division: z.enum(['North', 'South', 'East', 'West']),
  wins: z.number().nonnegative().optional(),
  losses: z.number().nonnegative().optional(),
  ties: z.number().nonnegative().optional(),
  seasonYear: z.string().optional(),
});

/**
 * Schema for array of teams
 */
export const TeamsResponseSchema = z.object({
  body: z.array(TeamSchema),
});

/**
 * Schema for getNFLTeams options
 */
export const GetNFLTeamsOptionsSchema = z
  .object({
    sortBy: z.string().optional(),
    rosters: z.boolean().optional(),
    schedules: z.boolean().optional(),
    topPerformers: z.boolean().optional(),
    teamStats: z.boolean().optional(),
    teamStatsSeason: z.string().optional(),
    standingsSeason: z.string().optional(),
  })
  .optional();

/**
 * Schema for getNFLTeamRoster options
 */
export const GetTeamRosterOptionsSchema = z.object({
  teamID: z.string().optional(),
  teamAbv: z.string().optional(),
  archiveDate: z
    .string()
    .regex(/^\d{8}$/)
    .optional(),
  getStats: z.boolean().optional(),
  fantasyPoints: z.boolean().optional(),
});

/**
 * Schema for depth chart position
 */
export const DepthChartPositionSchema = z.object({
  playerID: z.string(),
  playerName: z.string(),
  depth: z.number(),
  position: z.string(),
});

/**
 * Schema for team depth chart
 */
export const DepthChartSchema = z.object({
  teamAbv: z.string(),
  teamName: z.string(),
  depthChart: z.record(z.array(DepthChartPositionSchema)),
  lastUpdated: z.string().optional(),
});

/**
 * Schema for depth charts response
 */
export const DepthChartsResponseSchema = z.object({
  body: z.array(DepthChartSchema),
});

export type Team = z.infer<typeof TeamSchema>;
