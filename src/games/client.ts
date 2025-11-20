import type { HttpClient } from '../common/http/client.js';
import { validateResponse } from '../common/http/validator.js';
import { Tank01NotFoundError } from '../common/errors/not-found.js';
import { Tank01ValidationError } from '../common/errors/validation.js';
import type { Game, GameDetails, GameScheduleFilters } from './types.js';
import { GamesResponseSchema, GameDetailsSchema } from './schemas.js';

/**
 * Client for NFL game schedule and results operations
 */
export class GamesClient {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Retrieve NFL schedule for a specific season and week
   *
   * @param season - Season year (e.g., "2024")
   * @param week - Week number (1-18 for regular season, 19+ for playoffs)
   * @returns Array of games for the specified week
   * @throws {Tank01ValidationError} Invalid season or week format
   * @throws {Tank01NotFoundError} Schedule not found
   *
   * @example
   * ```typescript
   * const week1Games = await client.games.getSchedule("2024", "1");
   * console.log(week1Games.length); // ~16 games
   * ```
   */
  async getSchedule(season: string, week: string): Promise<Game[]> {
    if (!/^\d{4}$/.test(season)) {
      throw new Tank01ValidationError('Season must be a 4-digit year', {
        validationErrors: ['season must be in YYYY format'],
      });
    }

    if (!/^\d+$/.test(week)) {
      throw new Tank01ValidationError('Week must be a number', {
        validationErrors: ['week must be a numeric string'],
      });
    }

    const params = {
      season,
      week,
    };

    const response = await this.httpClient.get<{ body: Game[] }>('/getNFLGamesForWeek', params);

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Schedule not found for season ${season}, week ${week}`);
    }

    const validated = validateResponse(response, GamesResponseSchema);
    return validated.body;
  }

  /**
   * Retrieve specific game details including scoring and stats
   *
   * @param gameID - Unique game identifier
   * @returns Detailed game information
   * @throws {Tank01NotFoundError} Game not found
   * @throws {Tank01ValidationError} Invalid gameID
   *
   * @example
   * ```typescript
   * const gameDetails = await client.games.getGame("20240908_SF@PIT");
   * console.log(gameDetails.awayPts); // 49ers score
   * console.log(gameDetails.homePts); // Steelers score
   * console.log(gameDetails.gameStatus); // "Final"
   * ```
   */
  async getGame(gameID: string): Promise<GameDetails> {
    if (!gameID || gameID.trim().length === 0) {
      throw new Tank01ValidationError('Game ID cannot be empty', {
        validationErrors: ['gameID is required'],
      });
    }

    const params = { gameID: gameID.trim() };
    const response = await this.httpClient.get<{ body: GameDetails }>('/getNFLGameInfo', params);

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Game not found: ${gameID}`);
    }

    return validateResponse((response as { body: GameDetails }).body, GameDetailsSchema);
  }

  /**
   * Retrieve all games for a specific team
   *
   * @param teamID - Team abbreviation (e.g., "SF", "PIT")
   * @param season - Optional season year (defaults to current season)
   * @returns Array of games for the team
   * @throws {Tank01NotFoundError} Team schedule not found
   * @throws {Tank01ValidationError} Invalid parameters
   *
   * @example
   * ```typescript
   * const ninersGames = await client.games.getTeamSchedule("SF", "2024");
   * console.log(ninersGames.length); // ~17 games
   * const nextGame = ninersGames.find(g => g.gameStatus === "Scheduled");
   * ```
   */
  async getTeamSchedule(teamID: string, season?: string): Promise<Game[]> {
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

    const response = await this.httpClient.get<{ body: Game[] }>('/getNFLTeamSchedule', params);

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(
        `Schedule not found for team: ${teamID}${season ? ` in season ${season}` : ''}`
      );
    }

    const validated = validateResponse(response, GamesResponseSchema);
    return validated.body;
  }

  /**
   * Search for games using filters
   *
   * @param filters - Search criteria
   * @returns Array of matching games
   * @throws {Tank01ValidationError} Invalid filter parameters
   *
   * @example
   * ```typescript
   * // Find all 49ers games in week 1
   * const week1Games = await client.games.searchGames({
   *   season: "2024",
   *   week: "1",
   *   team: "SF"
   * });
   *
   * // Find completed games
   * const finalGames = await client.games.searchGames({
   *   season: "2024",
   *   status: "final"
   * });
   *
   * // Find playoff games
   * const playoffGames = await client.games.searchGames({
   *   season: "2024",
   *   playoffsOnly: true
   * });
   * ```
   */
  async searchGames(filters: GameScheduleFilters = {}): Promise<Game[]> {
    let results: Game[] = [];

    // If season and week provided, use getSchedule
    if (filters.season && filters.week) {
      results = await this.getSchedule(filters.season, filters.week);
    }
    // If team provided, use getTeamSchedule
    else if (filters.team) {
      results = await this.getTeamSchedule(filters.team, filters.season);
    }
    // Otherwise, need to fetch multiple weeks (not ideal but necessary)
    else if (filters.season) {
      throw new Tank01ValidationError('Search requires either (season + week) or team parameter', {
        validationErrors: ['Provide season with week, or provide team to search games'],
      });
    } else {
      throw new Tank01ValidationError('Search requires at least season or team parameter', {
        validationErrors: ['Provide season, week, or team to search games'],
      });
    }

    // Apply additional filters
    if (filters.status && filters.status !== 'all') {
      const statusMap: Record<string, string[]> = {
        scheduled: ['Scheduled', 'scheduled'],
        live: ['InProgress', 'in_progress', 'live'],
        final: ['Final', 'final', 'completed'],
      };

      const validStatuses = statusMap[filters.status] || [];
      results = results.filter(
        (g) =>
          g.gameStatus && validStatuses.some((s) => g.gameStatus?.toLowerCase() === s.toLowerCase())
      );
    }

    if (filters.playoffsOnly) {
      results = results.filter((g) => g.playoffs === true);
    }

    return results;
  }
}
