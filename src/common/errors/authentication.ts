import { Tank01Error } from './base.js';

/**
 * Error thrown when authentication fails (401/403 responses)
 * or when API key is missing or invalid
 */
export class Tank01AuthenticationError extends Tank01Error {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, options);
    this.name = 'Tank01AuthenticationError';
  }
}
