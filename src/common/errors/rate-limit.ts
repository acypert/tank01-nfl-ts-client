import { Tank01Error } from './base.js';

/**
 * Error thrown when API rate limit is exceeded (429 responses)
 */
export class Tank01RateLimitError extends Tank01Error {
  /**
   * Number of seconds to wait before retrying (from Retry-After header)
   */
  public readonly retryAfter?: number;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
      retryAfter?: number;
    }
  ) {
    super(message, options);
    this.name = 'Tank01RateLimitError';
    if (options?.retryAfter !== undefined) {
      this.retryAfter = options.retryAfter;
    }
  }
}
