import { z } from 'zod';
import { PlayerGameSchema } from '../players/schemas.js';

export const DstSchema = z.object({
  teamAbv: z.string(),
  teamID: z.string(),
  defTD: z.string(),
  defensiveInterceptions: z.string(),
  sacks: z.string(),
  ydsAllowed: z.string(),
  fumblesRecovered: z.string(),
  ptsAllowed: z.string(),
  safeties: z.string(),
});

export const LineScoreTeamSchema = z.object({
  Q1: z.string(),
  Q2: z.string(),
  Q3: z.string(),
  Q4: z.string(),
  teamID: z.string(),
  currentlyInPossession: z.string(),
  totalPts: z.string(),
  teamAbv: z.string(),
});

export const LineScoreSchema = z.object({
  period: z.string(),
  gameClock: z.string(),
  away: LineScoreTeamSchema,
  home: LineScoreTeamSchema,
});

/**
 * Zod schema for LiveBoxScore validation
 */
export const LiveBoxScoreSchema = z.object({
  DST: z.object({
    away: DstSchema,
    home: DstSchema,
  }),
  Referees: z.string(),
  arena: z.string(),
  arenaCapacity: z.string(),
  attendance: z.string(),
  away: z.string(),
  awayPts: z.string(),
  awayResult: z.string(),
  currentPeriod: z.string(),
  gameClock: z.string(),
  gameDate: z.string(),
  gameLocation: z.string(),
  gameStatus: z.string(),
  gameWeek: z.string(),
  home: z.string(),
  homePts: z.string(),
  homeResult: z.string(),
  lineScore: LineScoreSchema,
  network: z.string(),
  playerStats: z.record(PlayerGameSchema),
});

// ========================================
// Zod-Inferred Types
// ========================================

export type Dst = z.infer<typeof DstSchema>;
export type LineScoreTeam = z.infer<typeof LineScoreTeamSchema>;
export type LineScore = z.infer<typeof LineScoreSchema>;
export type LiveBoxScore = z.infer<typeof LiveBoxScoreSchema>;
