import type { HttpClient } from '../common/http/client.js';
import { validateResponse } from '../common/http/validator.js';
import { Tank01NotFoundError } from '../common/errors/not-found.js';
import { Tank01ValidationError } from '../common/errors/validation.js';
import type { LiveGame, LiveBoxScore, PlayByPlayEvent } from './types.js';
import {
  LiveGamesResponseSchema,
  LiveBoxScoreResponseSchema,
  PlayByPlayResponseSchema,
} from './schemas.js';

/**
 * Client for NFL live game data operations
 */
export class LiveClient {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Retrieve all live/in-progress games
   *
   * @returns Array of currently live games
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01NetworkError} Network failure
   *
   * @example
   * ```typescript
   * const liveGames = await client.live.getLiveGames();
   * console.log(`${liveGames.length} games in progress`);
   * liveGames.forEach(game => {
   *   console.log(`${game.away} ${game.awayPts} @ ${game.home} ${game.homePts} - ${game.quarter}`);
   * });
   * ```
   */
  async getLiveGames(): Promise<LiveGame[]> {
    const response = await this.httpClient.get<{ body: LiveGame[] }>('/getNFLGamesLive');

    if (!response || typeof response !== 'object' || !('body' in response)) {
      // No live games is valid, return empty array
      return [];
    }

    const validated = validateResponse(response, LiveGamesResponseSchema);
    return validated.body;
  }

  /**
   * Retrieve live box score for a specific game
   *
   * @param gameID - Unique game identifier
   * @returns Live box score with detailed statistics
   * @throws {Tank01NotFoundError} Game not found or not live
   * @throws {Tank01ValidationError} Invalid gameID
   *
   * @example
   * ```typescript
   * const boxScore = await client.live.getLiveBoxScore("20240908_SF@PIT");
   * console.log(`${boxScore.away} ${boxScore.awayPts} @ ${boxScore.home} ${boxScore.homePts}`);
   * console.log(`Quarter: ${boxScore.quarter}, Time: ${boxScore.gameClock}`);
   * console.log(`Possession: ${boxScore.possession}`);
   * ```
   */
  async getLiveBoxScore(gameID: string): Promise<LiveBoxScore> {
    if (!gameID || gameID.trim().length === 0) {
      throw new Tank01ValidationError('Game ID cannot be empty', {
        validationErrors: ['gameID is required'],
      });
    }

    const params = { gameID: gameID.trim() };
    const response = await this.httpClient.get<{ body: LiveBoxScore }>('/getNFLBoxScore', params);

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Live box score not found for game: ${gameID}`);
    }

    return validateResponse(
      (response as { body: LiveBoxScore }).body,
      LiveBoxScoreResponseSchema.shape.body
    );
  }

  /**
   * Retrieve play-by-play data for a specific game
   *
   * @param gameID - Unique game identifier
   * @returns Array of play-by-play events
   * @throws {Tank01NotFoundError} Game not found
   * @throws {Tank01ValidationError} Invalid gameID
   *
   * @example
   * ```typescript
   * const plays = await client.live.getPlayByPlay("20240908_SF@PIT");
   * console.log(`${plays.length} plays`);
   * plays.slice(-5).forEach(play => {
   *   console.log(`${play.quarter} ${play.time}: ${play.description}`);
   * });
   * ```
   */
  async getPlayByPlay(gameID: string): Promise<PlayByPlayEvent[]> {
    if (!gameID || gameID.trim().length === 0) {
      throw new Tank01ValidationError('Game ID cannot be empty', {
        validationErrors: ['gameID is required'],
      });
    }

    const params = { gameID: gameID.trim() };
    const response = await this.httpClient.get<{ body: PlayByPlayEvent[] }>(
      '/getNFLPlayByPlay',
      params
    );

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Play-by-play not found for game: ${gameID}`);
    }

    const validated = validateResponse(response, PlayByPlayResponseSchema);
    return validated.body;
  }

  /**
   * Check if a specific game is currently live
   *
   * @param gameID - Unique game identifier
   * @returns True if game is live, false otherwise
   *
   * @example
   * ```typescript
   * const isLive = await client.live.isGameLive("20240908_SF@PIT");
   * if (isLive) {
   *   const boxScore = await client.live.getLiveBoxScore("20240908_SF@PIT");
   *   console.log(`Game is live: ${boxScore.quarter} quarter`);
   * }
   * ```
   */
  async isGameLive(gameID: string): Promise<boolean> {
    try {
      const liveGames = await this.getLiveGames();
      return liveGames.some((game) => game.gameID === gameID);
    } catch {
      return false;
    }
  }
}
