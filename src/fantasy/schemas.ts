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
export const PlayerADPSchema = z
  .object({
    playerID: z.string(),
    playerName: z.string(),
    team: z.string(),
    pos: z.string(),
    adp: z.number(),
    adpFormatted: z.string().optional(),
    bye: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();

/**
 * Schema for ADP response validation
 */
export const ADPResponseSchema = z.object({
  body: z.array(PlayerADPSchema),
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

/**
 * Schema for PlayerProjection validation
 */
export const PlayerProjectionSchema = z
  .object({
    playerID: z.string(),
    playerName: z.string(),
    team: z.string(),
    pos: z.string(),
    week: z.string().optional(),
    season: z.string().optional(),
    projectedPoints: z.number().optional(),
    projections: z.record(z.union([z.number(), z.string()])).optional(),
  })
  .passthrough();

/**
 * Schema for Projections response validation
 */
export const ProjectionsResponseSchema = z.object({
  body: z.array(PlayerProjectionSchema),
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
export const DFSPlayerSchema = z
  .object({
    playerID: z.string(),
    playerName: z.string(),
    team: z.string(),
    pos: z.string(),
    opponent: z.string().optional(),
    salary: z.record(z.number()).optional(),
    projectedPoints: z.number().optional(),
    value: z.number().optional(),
  })
  .passthrough();

/**
 * Schema for DFS response validation
 */
export const DFSResponseSchema = z.object({
  body: z.array(DFSPlayerSchema),
});
