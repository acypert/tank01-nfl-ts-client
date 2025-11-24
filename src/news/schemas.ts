/**
 * NFL News Module - Zod Validation Schemas
 */

import { z } from 'zod';

// ========================================
// News Schemas
// ========================================

/**
 * Schema for GetNewsOptions validation
 */
export const GetNewsOptionsSchema = z.object({
  playerID: z.string().optional(),
  teamID: z.string().optional(),
  teamAbv: z.string().optional(),
  topNews: z.boolean().optional(),
  fantasyNews: z.boolean().optional(),
  recentNews: z.boolean().optional(),
  maxItems: z.number().optional(),
});

/**
 * Schema for NewsArticle validation
 */
export const NewsArticleSchema = z.array(z.unknown());

/**
 * Schema for news response validation
 */
export const NewsResponseSchema = z.object({
  body: NewsArticleSchema,
});

// ========================================
// Zod-Inferred Types
// ========================================

export type GetNewsOptions = z.infer<typeof GetNewsOptionsSchema>;
export type NewsArticle = z.infer<typeof NewsArticleSchema>;
