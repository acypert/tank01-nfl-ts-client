import { Tank01Error } from './base.js';

/**
 * Error thrown when API response validation fails
 * (response doesn't match expected schema)
 */
export class Tank01ValidationError extends Tank01Error {
  /**
   * Array of specific validation errors
   */
  public readonly validationErrors?: string[];

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
      validationErrors?: string[];
    }
  ) {
    super(message, options);
    this.name = 'Tank01ValidationError';
    if (options?.validationErrors !== undefined) {
      this.validationErrors = options.validationErrors;
    }
  }
}
