import { Tank01Error } from './base.js';

/**
 * Error thrown for other API errors (500, 502, 503, etc.)
 */
export class Tank01ApiError extends Tank01Error {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, options);
    this.name = 'Tank01ApiError';
  }
}
