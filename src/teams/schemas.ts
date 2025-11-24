import { z } from 'zod';
import { PlayerSchema } from '../players/schemas.js';

/**
 * Zod schema for Team validation
 */
export const TeamSchema = z.object({
  teamID: z.string(),
  teamName: z.string().min(1),
  teamCity: z.string().min(1),
  teamAbv: z.string().min(2).max(3),
  conference: z.enum([
    'AFC',
    'NFC',
    'American Football Conference',
    'National Football Conference',
  ]),
  division: z.enum(['North', 'South', 'East', 'West']),
  wins: z.string(),
  loss: z.string(),
  tie: z.string(),
  seasonYear: z.string().optional(),
  Roster: z.record(PlayerSchema).optional().or(z.undefined()),
  pf: z.string(),
  pa: z.string(),
  byeWeeks: z.record(z.array(z.string())),
  espnLogo1: z.string().url(),
  nflComLogo1: z.string().url(),
  currentStreak: z.object({
    result: z.string(),
    length: z.string(),
  }),
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
  depthPosition: z.string(),
  playerID: z.string(),
  longName: z.string(),
});

/**
 * Schema for team depth chart
 */
export const DepthChartSchema = z.object({
  teamAbv: z.string(),
  teamID: z.string(),
  depthChart: z.record(z.array(DepthChartPositionSchema)),
});

/**
 * Schema for depth charts response
 */
export const DepthChartsResponseSchema = z.object({
  body: z.array(DepthChartSchema),
});

export type Team = z.infer<typeof TeamSchema>;
