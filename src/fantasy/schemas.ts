/**
 * Fantasy Football Module - Zod Validation Schemas
 */

import { z } from 'zod';

// ========================================
// ADP Schemas
// ========================================

/**
 * Schema for ADP type validation
 */
export const ADPTypeSchema = z.enum(['halfPPR', 'PPR', 'standard', 'bestBall', 'IDP', 'superFlex']);

/**
 * Schema for GetADPOptions validation
 */
export const GetADPOptionsSchema = z.object({
  adpType: ADPTypeSchema,
  adpDate: z
    .string()
    .regex(/^\d{8}$/)
    .optional(),
  pos: z.string().optional(),
  filterOut: z.string().optional(),
});

/**
 * Schema for PlayerADP validation
 */
export const PlayerADPSchema = z.object({
  posADP: z.string(),
  overallADP: z.string(),
  playerID: z.string(),
  longName: z.string(),
  teamAbv: z.string().optional(),
  teamID: z.string().optional(),
});

/**
 * Schema for ADP response validation
 */
export const ADPResponseSchema = z.object({
  body: z.object({
    adpDate: z.string(),
    adpType: z.string(),
    adpList: z.array(PlayerADPSchema),
  }),
});

// ========================================
// Projections Schemas
// ========================================

/**
 * Schema for GetProjectionsOptions validation
 */
export const GetProjectionsOptionsSchema = z.object({
  week: z.string().optional(),
  playerID: z.string().optional(),
  teamID: z.string().optional(),
  archiveSeason: z.string().optional(),
  itemFormat: z.enum(['map', 'list']).optional(),
});

export const RushingProjectionSchema = z.object({
  rushYds: z.string(),
  carries: z.string(),
  rushTD: z.string(),
});

export const PassingProjectionSchema = z.object({
  passAttempts: z.string(),
  passTD: z.string(),
  passYds: z.string(),
  int: z.string(),
  passCompletions: z.string(),
});

export const ReceivingProjectionSchema = z.object({
  receptions: z.string(),
  recTD: z.string(),
  targets: z.string(),
  recYds: z.string(),
});

export const FantasyPointsSchema = z.object({
  standard: z.string(),
  PPR: z.string(),
  halfPPR: z.string(),
});

export const KickingProjectionSchema = z.object({
  fgMade: z.string(),
  fgMissed: z.string(),
  xpMade: z.string(),
  xpMissed: z.string(),
});

/**
 * Schema for PlayerProjection validation
 */
export const PlayerProjectionSchema = z.object({
  twoPointConversion: z.string(),
  Rushing: RushingProjectionSchema,
  Passing: PassingProjectionSchema,
  Receiving: ReceivingProjectionSchema,
  fumblesLost: z.string(),
  pos: z.string(),
  teamID: z.string(),
  team: z.string(),
  longName: z.string(),
  playerID: z.string(),
  fantasyPointsDefault: FantasyPointsSchema,
  Kicking: KickingProjectionSchema.optional(),
});

export const TeamDefenseProjectionSchema = z.object({
  returnTD: z.string(),
  defTD: z.string(),
  safeties: z.string(),
  teamID: z.string(),
  fumbleRecoveries: z.string(),
  ptsAgainst: z.string(),
  teamAbv: z.string(),
  interceptions: z.string(),
  sacks: z.string(),
  blockKick: z.string(),
  fantasyPointsDefault: z.string(),
});

/**
 * Schema for Projections response validation
 */
export const ProjectionsResponseSchema = z.object({
  body: z.object({
    teamDefenseProjections: z.record(TeamDefenseProjectionSchema),
    playerProjections: z.record(PlayerProjectionSchema),
  }),
});

// ========================================
// DFS Schemas
// ========================================

/**
 * Schema for GetDFSOptions validation
 */
export const GetDFSOptionsSchema = z.object({
  date: z.string().regex(/^\d{8}$/),
  includeTeamDefense: z.boolean().optional(),
});

/**
 * Schema for DFSPlayer validation
 */
export const DFSPlayerSchema = z.array(z.unknown());

/**
 * Schema for DFS response validation
 */
export const DFSResponseSchema = z.object({
  body: DFSPlayerSchema,
});

// ========================================
// Zod-Inferred Types
// ========================================

export type ADPType = z.infer<typeof ADPTypeSchema>;
export type GetADPOptions = z.infer<typeof GetADPOptionsSchema>;
export type PlayerADP = z.infer<typeof PlayerADPSchema>;
export type ADPResponse = z.infer<typeof ADPResponseSchema>['body'];

export type GetProjectionsOptions = z.infer<typeof GetProjectionsOptionsSchema>;
export type RushingProjection = z.infer<typeof RushingProjectionSchema>;
export type PassingProjection = z.infer<typeof PassingProjectionSchema>;
export type ReceivingProjection = z.infer<typeof ReceivingProjectionSchema>;
export type FantasyPoints = z.infer<typeof FantasyPointsSchema>;
export type KickingProjection = z.infer<typeof KickingProjectionSchema>;
export type PlayerProjection = z.infer<typeof PlayerProjectionSchema>;
export type TeamDefenseProjection = z.infer<typeof TeamDefenseProjectionSchema>;
export type ProjectionsResponse = z.infer<typeof ProjectionsResponseSchema>['body'];

export type GetDFSOptions = z.infer<typeof GetDFSOptionsSchema>;
export type DFSPlayer = z.infer<typeof DFSPlayerSchema>;
