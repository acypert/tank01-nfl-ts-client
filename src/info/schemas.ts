/**
 * NFL Info Module - Zod Validation Schemas
 */

import { z } from 'zod';

// ========================================
// Info Schemas
// ========================================

/**
 * Schema for GetCurrentInfoOptions validation
 */
export const GetCurrentInfoOptionsSchema = z.object({
  date: z
    .string()
    .regex(/^\d{8}$/)
    .optional(),
});

/**
 * Schema for CurrentInfo validation
 */
export const CurrentInfoSchema = z
  .object({
    season: z.string(),
    week: z.string(),
    seasonType: z.enum(['pre', 'reg', 'post']),
    date: z.string().optional(),
  })
  .passthrough();

/**
 * Schema for current info response validation
 */
export const CurrentInfoResponseSchema = z.object({
  body: CurrentInfoSchema,
});
