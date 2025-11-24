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

/**
 * Schema for roster player statistics
 */
export const RosterPlayerStatsSchema = z.object({
  gamesPlayed: z.string(),
  teamID: z.string(),
  team: z.string(),
  teamAbv: z.string(),
  Passing: z
    .object({
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
    })
    .optional(),
  Rushing: z
    .object({
      rushYds: z.string(),
      rushingTwoPointConversion: z.string(),
      carries: z.string(),
      rushTD: z.string(),
    })
    .optional(),
  Receiving: z
    .object({
      receivingTwoPointConversion: z.string(),
      receptions: z.string(),
      recTD: z.string(),
      targets: z.string(),
      recYds: z.string(),
    })
    .optional(),
  Defense: z
    .object({
      totalTackles: z.string(),
      fumblesLost: z.string(),
      defTD: z.string(),
      fumbles: z.string(),
      fumblesRecovered: z.string(),
      twoPointConversionReturn: z.string(),
      soloTackles: z.string(),
      defensiveInterceptions: z.string(),
      qbHits: z.string(),
      tfl: z.string(),
      passDeflections: z.string(),
      sacks: z.string(),
    })
    .optional(),
  Kicking: z
    .object({
      fgAttempts: z.string(),
      fgMade: z.string(),
      xpMade: z.string(),
      fgYds: z.string(),
      kickYards: z.string(),
      xpAttempts: z.string(),
    })
    .optional(),
});

/**
 * Schema for roster player
 */
export const RosterPlayerSchema = z.object({
  playerID: z.string(),
  longName: z.string(),
  jerseyNum: z.string(),
  pos: z.string(),
  team: z.string(),
  height: z.string(),
  weight: z.string(),
  bDay: z.string(),
  school: z.string(),
  exp: z.string(),
  injury: z.object({
    injReturnDate: z.string(),
    description: z.string(),
    injDate: z.string(),
    designation: z.string(),
  }),
  age: z.string(),
  teamID: z.string(),
  espnID: z.string(),
  espnName: z.string(),
  espnLink: z.string(),
  espnHeadshot: z.string(),
  espnIDFull: z.string(),
  cbsPlayerID: z.string().optional(),
  cbsLongName: z.string(),
  cbsShortName: z.string().optional(),
  cbsPlayerIDFull: z.string(),
  yahooPlayerID: z.string(),
  yahooLink: z.string(),
  sleeperBotID: z.string(),
  fRefID: z.string(),
  rotoWirePlayerID: z.string(),
  rotoWirePlayerIDFull: z.string(),
  fantasyProsLink: z.string().optional(),
  fantasyProsPlayerID: z.string().optional(),
  lastGamePlayed: z.string(),
  isFreeAgent: z.string(),
  stats: RosterPlayerStatsSchema.optional(),
});

/**
 * Schema for team roster response
 */
export const TeamRosterResponseSchema = z.object({
  body: z.object({
    team: z.string(),
    roster: z.array(RosterPlayerSchema),
  }),
});

// Export Zod-inferred types as the source of truth
export type Team = z.infer<typeof TeamSchema>;
export type DepthChart = z.infer<typeof DepthChartSchema>;
export type DepthChartPosition = z.infer<typeof DepthChartPositionSchema>;
export type RosterPlayer = z.infer<typeof RosterPlayerSchema>;
export type RosterPlayerStats = z.infer<typeof RosterPlayerStatsSchema>;
