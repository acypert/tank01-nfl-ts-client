/**
 * NFL Info Module - Type Definitions
 *
 * This module provides types for current NFL season/week information.
 */

// ========================================
// Info Types
// ========================================

/**
 * Options for getNFLCurrentInfo endpoint
 */
export interface GetCurrentInfoOptions {
  /**
   * Optional date to get info for (format: YYYYMMDD)
   * If omitted, returns current date info
   */
  date?: string | undefined;
}

/**
 * Current NFL season information
 */
export interface CurrentInfo {
  /**
   * Current season year
   */
  season: string;

  /**
   * Current week number
   */
  week: string;

  /**
   * Season type: "pre" (preseason), "reg" (regular), "post" (playoffs)
   */
  seasonType: 'pre' | 'reg' | 'post';

  /**
   * Current date (YYYYMMDD format)
   */
  date?: string | undefined;

  /**
   * Additional metadata
   */
  [key: string]: unknown;
}
