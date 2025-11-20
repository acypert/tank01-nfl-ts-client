import type { HttpClient } from '../common/http/client.js';
import { validateResponse } from '../common/http/validator.js';
import { Tank01NotFoundError } from '../common/errors/not-found.js';
import { Tank01ValidationError } from '../common/errors/validation.js';
import type { Player, PlayerStatistics, PlayerSearchFilters } from './types.js';
import { PlayerSchema, PlayersResponseSchema, PlayerStatsResponseSchema } from './schemas.js';

/**
 * Client for NFL player data operations
 */
export class PlayersClient {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Retrieve all NFL players
   *
   * @returns Array of all NFL players
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01NetworkError} Network failure
   * @throws {Tank01ValidationError} Response schema mismatch
   *
   * @example
   * ```typescript
   * const players = await client.players.getPlayers();
   * console.log(players.length); // ~2500+ players
   * ```
   */
  async getPlayers(): Promise<Player[]> {
    const response = await this.httpClient.get<{ body: Player[] }>('/getNFLPlayerList');
    const validated = validateResponse(response, PlayersResponseSchema);
    return validated.body;
  }

  /**
   * Retrieve specific player information
   *
   * @param playerID - Unique player identifier
   * @returns Player object
   * @throws {Tank01NotFoundError} Player not found
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid playerID format
   *
   * @example
   * ```typescript
   * const purdy = await client.players.getPlayer("4381786");
   * console.log(purdy.longName); // "Brock Purdy"
   * console.log(purdy.pos); // "QB"
   * ```
   */
  async getPlayer(playerID: string): Promise<Player> {
    if (!playerID || playerID.trim().length === 0) {
      throw new Tank01ValidationError('Player ID cannot be empty', {
        validationErrors: ['playerID is required'],
      });
    }

    const params = { playerID: playerID.trim() };
    const response = await this.httpClient.get<{ body: Player[] }>('/getNFLPlayerInfo', params);

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Player not found: ${playerID}`);
    }

    const players = (response as { body: Player[] }).body;
    if (!Array.isArray(players) || players.length === 0) {
      throw new Tank01NotFoundError(`Player not found: ${playerID}`);
    }

    return validateResponse(players[0], PlayerSchema);
  }

  /**
   * Retrieve player statistics for a specific season
   *
   * @param playerID - Unique player identifier
   * @param season - Season year (defaults to current season)
   * @returns Player statistics object
   * @throws {Tank01NotFoundError} Player stats not found
   * @throws {Tank01ValidationError} Invalid parameters
   *
   * @example
   * ```typescript
   * const purdyStats = await client.players.getPlayerStats("4381786", "2023");
   * console.log(purdyStats.passingYards); // 4280
   * console.log(purdyStats.passingTDs); // 31
   * ```
   */
  async getPlayerStats(playerID: string, season?: string): Promise<PlayerStatistics> {
    if (!playerID || playerID.trim().length === 0) {
      throw new Tank01ValidationError('Player ID cannot be empty', {
        validationErrors: ['playerID is required'],
      });
    }

    const params: Record<string, string> = {
      playerID: playerID.trim(),
    };

    if (season) {
      if (!/^\d{4}$/.test(season)) {
        throw new Tank01ValidationError('Season must be a 4-digit year', {
          validationErrors: ['season must be in YYYY format'],
        });
      }
      params.season = season;
    }

    const response = await this.httpClient.get<{ body: PlayerStatistics }>(
      '/getNFLPlayerStats',
      params
    );

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(
        `Player stats not found for player: ${playerID}${season ? ` in season ${season}` : ''}`
      );
    }

    return validateResponse(
      (response as { body: PlayerStatistics }).body,
      PlayerStatsResponseSchema.shape.body
    );
  }

  /**
   * Search for players using filters
   *
   * @param filters - Search criteria
   * @returns Array of matching players
   * @throws {Tank01ValidationError} Invalid filter parameters
   *
   * @example
   * ```typescript
   * // Find all 49ers quarterbacks
   * const sanFranciscoQBs = await client.players.searchPlayers({
   *   team: "SF",
   *   position: "QB"
   * });
   *
   * // Find injured players
   * const injuredPlayers = await client.players.searchPlayers({
   *   availabilityStatus: "injured"
   * });
   *
   * // Search by name
   * const purdy = await client.players.searchPlayers({
   *   name: "purdy"
   * });
   * ```
   */
  async searchPlayers(filters: PlayerSearchFilters = {}): Promise<Player[]> {
    // Get all players first (API may not have direct search endpoint)
    const allPlayers = await this.getPlayers();

    let results = allPlayers;

    // Apply filters
    if (filters.team) {
      const teamUpper = filters.team.toUpperCase();
      results = results.filter((p) => p.team === teamUpper || p.teamID === teamUpper);
    }

    if (filters.position) {
      const posUpper = filters.position.toUpperCase();
      results = results.filter((p) => p.pos === posUpper);
    }

    if (filters.name) {
      const nameLower = filters.name.toLowerCase();
      results = results.filter((p) => p.longName.toLowerCase().includes(nameLower));
    }

    if (filters.availabilityStatus) {
      if (filters.availabilityStatus === 'injured') {
        results = results.filter((p) => p.injury !== undefined);
      } else if (filters.availabilityStatus === 'active') {
        results = results.filter((p) => p.injury === undefined);
      }
      // 'all' returns everything, no filter needed
    }

    if (filters.isRookie !== undefined) {
      results = results.filter((p) => {
        const exp = p.exp ? parseInt(p.exp, 10) : undefined;
        return filters.isRookie ? exp === 0 : exp !== undefined && exp > 0;
      });
    }

    return results;
  }
}
