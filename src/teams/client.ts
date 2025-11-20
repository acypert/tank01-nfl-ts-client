import type { HttpClient } from '../common/http/client.js';
import { validateResponse } from '../common/http/validator.js';
import { Tank01NotFoundError } from '../common/errors/not-found.js';
import type { Team } from './types.js';
import { TeamSchema, TeamsResponseSchema } from './schemas.js';

/**
 * Client for NFL team data operations
 */
export class TeamsClient {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Retrieve all NFL teams
   *
   * @returns Array of all NFL teams
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01NetworkError} Network failure
   * @throws {Tank01ValidationError} Response schema mismatch
   *
   * @example
   * ```typescript
   * const teams = await client.teams.getTeams();
   * console.log(teams.length); // 32
   * ```
   */
  async getTeams(): Promise<Team[]> {
    const response = await this.httpClient.get<{ body: Team[] }>('/getNFLTeams');
    const validated = validateResponse(response, TeamsResponseSchema);
    return validated.body;
  }

  /**
   * Retrieve specific team information
   *
   * @param teamID - Team abbreviation (e.g., "KC", "PHI")
   * @returns Team object
   * @throws {Tank01NotFoundError} Team not found
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid teamID format
   *
   * @example
   * ```typescript
   * const niners = await client.teams.getTeam("SF");
   * console.log(niners.teamName); // "San Francisco 49ers"
   * ```
   */
  async getTeam(teamID: string): Promise<Team> {
    // Validate teamID format
    if (!teamID || teamID.length < 2 || teamID.length > 3) {
      throw new Tank01NotFoundError(
        `Invalid team ID format: ${teamID}. Must be 2-3 uppercase letters.`
      );
    }

    const teams = await this.getTeams();
    const team = teams.find(
      (t) => t.teamID === teamID.toUpperCase() || t.teamAbv === teamID.toUpperCase()
    );

    if (!team) {
      throw new Tank01NotFoundError(`Team not found: ${teamID}`);
    }

    return validateResponse(team, TeamSchema);
  }

  /**
   * Retrieve team roster with optional player statistics
   *
   * @param teamID - Team abbreviation
   * @param options - Optional parameters
   * @param options.season - Season year (defaults to current season)
   * @param options.getStats - Include player statistics (defaults to false)
   * @returns Array of players on the team roster
   * @throws {Tank01NotFoundError} Team not found
   * @throws {Tank01ValidationError} Invalid season format
   *
   * @example
   * ```typescript
   * const roster = await client.teams.getTeamRoster("SF", {
   *   season: "2024",
   *   getStats: true
   * });
   * console.log(roster.map(p => p.longName));
   * ```
   */
  async getTeamRoster(
    teamID: string,
    options?: { season?: string; getStats?: boolean }
  ): Promise<unknown[]> {
    const params: Record<string, string | boolean> = {
      teamID: teamID.toUpperCase(),
    };

    if (options?.season) {
      params.season = options.season;
    }
    if (options?.getStats !== undefined) {
      params.getStats = options.getStats;
    }

    const response = await this.httpClient.get<{ body: unknown[] }>('/getNFLTeamRoster', params);

    // Basic validation - full Player schema will be defined in players module
    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Team roster not found for: ${teamID}`);
    }

    return (response as { body: unknown[] }).body;
  }
}
