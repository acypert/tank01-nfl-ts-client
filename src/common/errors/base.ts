/**
 * Base error class for all Tank01 NFL client errors
 */
export class Tank01Error extends Error {
  /**
   * HTTP status code if applicable
   */
  public readonly statusCode?: number;

  /**
   * Original error that caused this error
   */
  public readonly cause?: Error;

  /**
   * Additional context about the error
   */
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = 'Tank01Error';

    // Only assign properties if they exist
    if (options?.statusCode !== undefined) {
      this.statusCode = options.statusCode;
    }
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
    if (options?.context !== undefined) {
      this.context = options.context;
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
