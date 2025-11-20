/**
 * Configuration options for the Tank01 NFL API client
 */
export interface ClientConfiguration {
  /**
   * Tank01/RapidAPI authentication key
   * Can be provided explicitly or via TANK01_API_KEY environment variable
   */
  apiKey?: string;

  /**
   * Base URL for the Tank01 API
   * @default 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Maximum number of retry attempts for failed requests
   * @default 3
   */
  maxRetries?: number;

  /**
   * Enable debug logging for requests and responses
   * @default false
   */
  debug?: boolean;
}

/**
 * Internal resolved configuration with all defaults applied
 */
export interface ResolvedClientConfiguration {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  maxRetries: number;
  debug: boolean;
}
