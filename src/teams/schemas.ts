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

export type Team = z.infer<typeof TeamSchema>;
