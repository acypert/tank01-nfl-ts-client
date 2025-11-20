import { Tank01Error } from './base.js';

/**
 * Error thrown when network request fails
 * (timeout, connection refused, DNS errors, etc.)
 */
export class Tank01NetworkError extends Tank01Error {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, options);
    this.name = 'Tank01NetworkError';
  }
}
