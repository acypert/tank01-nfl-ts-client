import { Tank01Error } from './base.js';

/**
 * Error thrown when a requested resource is not found (404 responses)
 */
export class Tank01NotFoundError extends Tank01Error {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message, options);
    this.name = 'Tank01NotFoundError';
  }
}
