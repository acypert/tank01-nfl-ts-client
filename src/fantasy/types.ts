/**
 * Fantasy Football Module - Type Definitions
 *
 * This module provides types for fantasy football data including:
 * - Average Draft Position (ADP)
 * - Weekly/Seasonal Projections
 * - Daily Fantasy Sports (DFS) salaries and data
 *
 * Re-exports Zod-inferred types from schemas as the single source of truth.
 */

export type {
  ADPType,
  GetADPOptions,
  PlayerADP,
  ADPResponse,
  GetProjectionsOptions,
  RushingProjection,
  PassingProjection,
  ReceivingProjection,
  FantasyPoints,
  KickingProjection,
  PlayerProjection,
  TeamDefenseProjection,
  ProjectionsResponse,
  GetDFSOptions,
  DFSPlayer,
} from './schemas.js';
