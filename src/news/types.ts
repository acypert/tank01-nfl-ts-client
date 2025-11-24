/**
 * NFL News Module - Type Definitions
 *
 * This module provides types for NFL news articles and feeds.
 */

// ========================================
// News Types
// ========================================

/**
 * Options for getNFLNews endpoint
 */
export interface GetNewsOptions {
  /**
   * Filter news by player ID
   */
  playerID?: string | undefined;

  /**
   * Filter news by team ID
   */
  teamID?: string | undefined;

  /**
   * Filter news by team abbreviation
   */
  teamAbv?: string | undefined;

  /**
   * Get top/breaking news only
   */
  topNews?: boolean | undefined;

  /**
   * Get fantasy-relevant news only
   */
  fantasyNews?: boolean | undefined;

  /**
   * Get most recent news only
   */
  recentNews?: boolean | undefined;

  /**
   * Maximum number of articles to return
   */
  maxItems?: number | undefined;
}

/**
 * NFL news article
 */
export type NewsArticle = unknown[];
