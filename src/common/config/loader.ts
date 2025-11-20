import type { ClientConfiguration, ResolvedClientConfiguration } from './types.js';
import { ClientConfigurationSchema } from './schema.js';
import { Tank01AuthenticationError } from '../errors/authentication.js';

const DEFAULT_BASE_URL = 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com';
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_DEBUG = false;

/**
 * Loads and validates client configuration
 * Applies defaults and reads from environment variables if needed
 *
 * @param config - Partial configuration provided by user
 * @returns Fully resolved and validated configuration
 * @throws {Tank01AuthenticationError} If no API key is provided or found in environment
 */
export function loadConfiguration(config: ClientConfiguration = {}): ResolvedClientConfiguration {
  // Resolve API key from config or environment
  const apiKey = config.apiKey ?? process.env.TANK01_API_KEY;

  if (!apiKey) {
    throw new Tank01AuthenticationError(
      'API key is required. Provide it via the apiKey constructor parameter or set the TANK01_API_KEY environment variable.'
    );
  }

  // Build resolved configuration with defaults
  const resolvedConfig: ResolvedClientConfiguration = {
    apiKey,
    baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
    timeout: config.timeout ?? DEFAULT_TIMEOUT,
    maxRetries: config.maxRetries ?? DEFAULT_MAX_RETRIES,
    debug: config.debug ?? DEFAULT_DEBUG,
  };

  // Validate the resolved configuration
  const validation = ClientConfigurationSchema.safeParse(resolvedConfig);

  if (!validation.success) {
    const errors = validation.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    throw new Tank01AuthenticationError(`Invalid configuration: ${errors.join(', ')}`);
  }

  return resolvedConfig;
}
