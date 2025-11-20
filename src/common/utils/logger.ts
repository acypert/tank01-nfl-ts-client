/* eslint-disable no-console */

/**
 * Simple logger utility for debug mode
 */
export class Logger {
  constructor(private readonly enabled: boolean) {}

  /**
   * Log debug information
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.log(`[Tank01 DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log warning
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.warn(`[Tank01 WARN] ${message}`, ...args);
    }
  }

  /**
   * Log error
   */
  error(message: string, ...args: unknown[]): void {
    if (this.enabled) {
      console.error(`[Tank01 ERROR] ${message}`, ...args);
    }
  }
}
