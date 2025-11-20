/**
 * Options for retry behavior
 */
export interface RetryOptions {
  maxRetries: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

/**
 * Default retry check - retries on network errors and 5xx server errors
 */
function defaultShouldRetry(error: Error, attempt: number): boolean {
  // Don't retry if we've exhausted attempts
  if (attempt >= 3) {
    return false;
  }

  // Retry on network errors
  if (error.name === 'Tank01NetworkError') {
    return true;
  }

  // Retry on server errors (5xx)
  if ('statusCode' in error && typeof error.statusCode === 'number') {
    return error.statusCode >= 500 && error.statusCode < 600;
  }

  return false;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, initialDelayMs = 1000, maxDelayMs = 30000): number {
  // Exponential backoff: 2^attempt * initialDelay
  const exponentialDelay = Math.pow(2, attempt) * initialDelayMs;

  // Cap at max delay
  const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

  // Add jitter (randomize ±25%)
  const jitter = cappedDelay * 0.25;
  const randomJitter = Math.random() * jitter * 2 - jitter;

  return Math.floor(cappedDelay + randomJitter);
}

/**
 * Retry a function with exponential backoff and jitter
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Promise resolving to function result
 */
export async function retryWithBackoff<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const { maxRetries, initialDelayMs = 1000, maxDelayMs = 30000 } = options;
  const shouldRetry = options.shouldRetry ?? defaultShouldRetry;

  let lastError: Error;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (attempt < maxRetries && shouldRetry(lastError, attempt)) {
        const delay = calculateDelay(attempt, initialDelayMs, maxDelayMs);

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));

        attempt++;
        continue;
      }

      // No more retries, throw the error
      throw lastError;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError!;
}
