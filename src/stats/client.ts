import type { HttpClient } from '../common/http/client.js';
import { validateResponse } from '../common/http/validator.js';
import { Tank01NotFoundError } from '../common/errors/not-found.js';
import { Tank01ValidationError } from '../common/errors/validation.js';
import type {
  TeamAdvancedStats,
  PlayerAdvancedStats,
  TeamRankings,
  PlayerProjections,
} from './types.js';
import {
  TeamAdvancedStatsResponseSchema,
  PlayerAdvancedStatsResponseSchema,
  TeamRankingsResponseSchema,
  PlayerProjectionsResponseSchema,
} from './schemas.js';

/**
 * Client for NFL advanced statistics operations
 */
export class StatsClient {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Retrieve advanced statistics for a team
   *
   * @param teamID - Team abbreviation
   * @param season - Season year (defaults to current season)
   * @returns Advanced team statistics
   * @throws {Tank01NotFoundError} Team stats not found
   * @throws {Tank01ValidationError} Invalid parameters
   *
   * @example
   * ```typescript
   * const ninersStats = await client.stats.getTeamAdvancedStats("SF", "2024");
   * console.log(`Points per game: ${ninersStats.pointsPerGame}`);
   * console.log(`Turnover differential: ${ninersStats.turnoverDifferential}`);
   * ```
   */
  async getTeamAdvancedStats(teamID: string, season?: string): Promise<TeamAdvancedStats> {
    if (!teamID || teamID.trim().length === 0) {
      throw new Tank01ValidationError('Team ID cannot be empty', {
        validationErrors: ['teamID is required'],
      });
    }

    if (season && !/^\d{4}$/.test(season)) {
      throw new Tank01ValidationError('Season must be a 4-digit year', {
        validationErrors: ['season must be in YYYY format'],
      });
    }

    const params: Record<string, string> = {
      teamID: teamID.toUpperCase(),
    };

    if (season) {
      params.season = season;
    }

    const response = await this.httpClient.get<{ body: TeamAdvancedStats }>(
      '/getNFLTeamStats',
      params
    );

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(
        `Advanced stats not found for team: ${teamID}${season ? ` in season ${season}` : ''}`
      );
    }

    return validateResponse(
      (response as { body: TeamAdvancedStats }).body,
      TeamAdvancedStatsResponseSchema.shape.body
    );
  }

  /**
   * Retrieve advanced statistics for a player
   *
   * @param playerID - Unique player identifier
   * @param season - Season year (defaults to current season)
   * @returns Advanced player statistics
   * @throws {Tank01NotFoundError} Player stats not found
   * @throws {Tank01ValidationError} Invalid parameters
   *
   * @example
   * ```typescript
   * const purdyStats = await client.stats.getPlayerAdvancedStats("4381786", "2024");
   * console.log(`QB Rating: ${purdyStats.qbRating}`);
   * console.log(`Yards per attempt: ${purdyStats.yardsPerAttempt}`);
   * ```
   */
  async getPlayerAdvancedStats(playerID: string, season?: string): Promise<PlayerAdvancedStats> {
    if (!playerID || playerID.trim().length === 0) {
      throw new Tank01ValidationError('Player ID cannot be empty', {
        validationErrors: ['playerID is required'],
      });
    }

    if (season && !/^\d{4}$/.test(season)) {
      throw new Tank01ValidationError('Season must be a 4-digit year', {
        validationErrors: ['season must be in YYYY format'],
      });
    }

    const params: Record<string, string> = {
      playerID: playerID.trim(),
    };

    if (season) {
      params.season = season;
    }

    const response = await this.httpClient.get<{ body: PlayerAdvancedStats }>(
      '/getNFLPlayerAdvancedStats',
      params
    );

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(
        `Advanced stats not found for player: ${playerID}${season ? ` in season ${season}` : ''}`
      );
    }

    return validateResponse(
      (response as { body: PlayerAdvancedStats }).body,
      PlayerAdvancedStatsResponseSchema.shape.body
    );
  }

  /**
   * Retrieve team rankings across statistical categories
   *
   * @param season - Season year (defaults to current season)
   * @returns Array of team rankings
   * @throws {Tank01ValidationError} Invalid season format
   *
   * @example
   * ```typescript
   * const rankings = await client.stats.getTeamRankings("2024");
   * const ninersRank = rankings.find(r => r.team === "SF");
   * console.log(`Offensive rank: ${ninersRank?.offensiveRank}`);
   * console.log(`Defensive rank: ${ninersRank?.defensiveRank}`);
   * ```
   */
  async getTeamRankings(season?: string): Promise<TeamRankings[]> {
    if (season && !/^\d{4}$/.test(season)) {
      throw new Tank01ValidationError('Season must be a 4-digit year', {
        validationErrors: ['season must be in YYYY format'],
      });
    }

    const params: Record<string, string> = {};
    if (season) {
      params.season = season;
    }

    const response = await this.httpClient.get<{ body: TeamRankings[] }>(
      '/getNFLTeamRankings',
      params
    );

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(
        `Team rankings not found${season ? ` for season ${season}` : ''}`
      );
    }

    const validated = validateResponse(response, TeamRankingsResponseSchema);
    return validated.body;
  }

  /**
   * Retrieve player projections for fantasy football
   *
   * @param playerID - Unique player identifier
   * @param week - Week number or "season" for season-long projections
   * @returns Player projections
   * @throws {Tank01NotFoundError} Projections not found
   * @throws {Tank01ValidationError} Invalid parameters
   *
   * @example
   * ```typescript
   * const purdyProjections = await client.stats.getPlayerProjections("4381786", "1");
   * console.log(`Projected passing yards: ${purdyProjections.projectedPassingYards}`);
   * console.log(`Projected fantasy points: ${purdyProjections.projectedFantasyPoints}`);
   * ```
   */
  async getPlayerProjections(playerID: string, week: string): Promise<PlayerProjections> {
    if (!playerID || playerID.trim().length === 0) {
      throw new Tank01ValidationError('Player ID cannot be empty', {
        validationErrors: ['playerID is required'],
      });
    }

    if (!week || week.trim().length === 0) {
      throw new Tank01ValidationError('Week cannot be empty', {
        validationErrors: ['week is required'],
      });
    }

    const params = {
      playerID: playerID.trim(),
      week: week.trim(),
    };

    const response = await this.httpClient.get<{ body: PlayerProjections }>(
      '/getNFLPlayerProjections',
      params
    );

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Projections not found for player: ${playerID}, week: ${week}`);
    }

    return validateResponse(
      (response as { body: PlayerProjections }).body,
      PlayerProjectionsResponseSchema.shape.body
    );
  }
}
