
import type { RequestInit, Response } from 'node-fetch';
import type { ResolvedClientConfiguration } from '../config/types.js';
import { Logger } from '../utils/logger.js';
import { retryWithBackoff } from './retry.js';
import {
  Tank01AuthenticationError,
  Tank01NotFoundError,
  Tank01RateLimitError,
  Tank01NetworkError,
  Tank01ApiError,
} from '../errors/index.js';

/**
 * HTTP client wrapper for Tank01 API requests
 * Handles authentication, retries, timeouts, and error handling
 */
export class HttpClient {
  private readonly logger: Logger;

  constructor(private readonly config: ResolvedClientConfiguration) {
    this.logger = new Logger(config.debug);
  }

  /**
   * Make a GET request to the Tank01 API
   *
   * @param path - API endpoint path (without base URL)
   * @param params - Query parameters
   * @returns Parsed JSON response
   */
  async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = this.buildUrl(path, params);
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * Make an HTTP request with retry logic and error handling
   */
  private async request<T>(url: string, init: RequestInit): Promise<T> {
    return retryWithBackoff(
      async () => {
        this.logger.debug(`Making request to ${url}`);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
          const fetch = (await import('node-fetch')).default;
          const response = await fetch(url, {
            ...init,
            signal: controller.signal,
            headers: {
              ...init.headers,
              'X-RapidAPI-Key': this.config.apiKey,
              'X-RapidAPI-Host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com',
              'Content-Type': 'application/json',
              'User-Agent': 'tank01-nfl-client/0.1.0',
            },
          });

          clearTimeout(timeoutId);

          // Handle HTTP errors
          await this.handleHttpErrors(response);

          // Parse and return JSON
          const data = (await response.json()) as T;
          this.logger.debug(`Received response from ${url}`, data);

          return data;
        } catch (error) {
          clearTimeout(timeoutId);

          // Handle abort/timeout
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Tank01NetworkError(`Request timeout after ${this.config.timeout}ms`, {
              cause: error,
              context: { url, timeout: this.config.timeout },
            });
          }

          // Handle network errors
          if (
            error instanceof Error &&
            (error.message.includes('ECONNREFUSED') ||
              error.message.includes('ENOTFOUND') ||
              error.message.includes('ETIMEDOUT'))
          ) {
            throw new Tank01NetworkError(`Network request failed: ${error.message}`, {
              cause: error,
              context: { url },
            });
          }

          // Re-throw Tank01 errors as-is
          if (
            error instanceof Tank01NetworkError ||
            error instanceof Tank01AuthenticationError ||
            error instanceof Tank01NotFoundError ||
            error instanceof Tank01RateLimitError ||
            error instanceof Tank01ApiError
          ) {
            throw error;
          }

          // Wrap unknown errors
          const apiError = new Tank01ApiError(
            `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
            {
              ...(error instanceof Error && { cause: error }),
              context: { url },
            }
          );
          throw apiError;
        }
      },
      {
        maxRetries: this.config.maxRetries,
      }
    );
  }

  /**
   * Handle HTTP error status codes
   */
  private async handleHttpErrors(response: Response): Promise<void> {
    if (response.ok) {
      return;
    }

    const statusCode = response.status;
    let errorMessage = `HTTP ${statusCode}: ${response.statusText}`;

    // Try to extract error message from response body
    try {
      const body = await response.text();
      if (body) {
        errorMessage += ` - ${body}`;
      }
    } catch {
      // Ignore if we can't read the body
    }

    // Handle specific status codes
    if (statusCode === 401 || statusCode === 403) {
      throw new Tank01AuthenticationError(
        `Authentication failed: ${errorMessage}. Check your API key.`,
        { statusCode }
      );
    }

    if (statusCode === 404) {
      throw new Tank01NotFoundError(`Resource not found: ${errorMessage}`, { statusCode });
    }

    if (statusCode === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
      throw new Tank01RateLimitError(`Rate limit exceeded: ${errorMessage}`, {
        statusCode,
        ...(retryAfterSeconds !== undefined && { retryAfter: retryAfterSeconds }),
      });
    }

    // Server errors (5xx)
    if (statusCode >= 500) {
      throw new Tank01ApiError(`Server error: ${errorMessage}`, { statusCode });
    }

    // Other client errors (4xx)
    throw new Tank01ApiError(`Client error: ${errorMessage}`, { statusCode });
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(path, this.config.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }
}
