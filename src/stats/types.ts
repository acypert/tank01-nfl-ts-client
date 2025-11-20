/**
 * Advanced team statistics
 */
export interface TeamAdvancedStats {
  /** Team abbreviation */
  team: string;
  /** Season year */
  season: string;
  /** Offensive yards per game */
  offensiveYardsPerGame?: number | undefined;
  /** Defensive yards allowed per game */
  defensiveYardsPerGame?: number | undefined;
  /** Points per game */
  pointsPerGame?: number | undefined;
  /** Points allowed per game */
  pointsAllowedPerGame?: number | undefined;
  /** Turnover differential */
  turnoverDifferential?: number | undefined;
  /** Sacks */
  sacks?: number | undefined;
  /** Sacks allowed */
  sacksAllowed?: number | undefined;
  /** Third down conversion percentage */
  thirdDownPct?: number | undefined;
  /** Red zone scoring percentage */
  redZonePct?: number | undefined;
}

/**
 * Advanced player statistics
 */
export interface PlayerAdvancedStats {
  /** Player ID */
  playerID: string;
  /** Player name */
  playerName: string;
  /** Team abbreviation */
  team: string;
  /** Position */
  position: string;
  /** Season year */
  season: string;

  // QB advanced stats
  /** QB rating */
  qbRating?: number | undefined;
  /** Completion percentage */
  completionPct?: number | undefined;
  /** Yards per attempt */
  yardsPerAttempt?: number | undefined;
  /** Interception percentage */
  intPct?: number | undefined;

  // RB advanced stats
  /** Yards per carry */
  yardsPerCarry?: number | undefined;
  /** Broken tackles */
  brokenTackles?: number | undefined;
  /** Yards after contact */
  yardsAfterContact?: number | undefined;

  // WR/TE advanced stats
  /** Catch percentage */
  catchPct?: number | undefined;
  /** Yards per reception */
  yardsPerReception?: number | undefined;
  /** Yards after catch */
  yardsAfterCatch?: number | undefined;
  /** Drop percentage */
  dropPct?: number | undefined;

  // Defense advanced stats
  /** Tackles for loss */
  tacklesForLoss?: number | undefined;
  /** QB hits */
  qbHits?: number | undefined;
  /** Passes defended */
  passesDefended?: number | undefined;
}

/**
 * Team rankings across various statistical categories
 */
export interface TeamRankings {
  /** Team abbreviation */
  team: string;
  /** Season year */
  season: string;
  /** Offensive rank */
  offensiveRank?: number | undefined;
  /** Defensive rank */
  defensiveRank?: number | undefined;
  /** Scoring offense rank */
  scoringOffenseRank?: number | undefined;
  /** Scoring defense rank */
  scoringDefenseRank?: number | undefined;
  /** Passing offense rank */
  passingOffenseRank?: number | undefined;
  /** Rushing offense rank */
  rushingOffenseRank?: number | undefined;
  /** Total defense rank */
  totalDefenseRank?: number | undefined;
}

/**
 * Player projections for fantasy football
 */
export interface PlayerProjections {
  /** Player ID */
  playerID: string;
  /** Player name */
  playerName: string;
  /** Team abbreviation */
  team: string;
  /** Position */
  position: string;
  /** Week number (or "season" for season-long) */
  week: string;
  /** Projected passing yards */
  projectedPassingYards?: number | undefined;
  /** Projected passing TDs */
  projectedPassingTDs?: number | undefined;
  /** Projected rushing yards */
  projectedRushingYards?: number | undefined;
  /** Projected rushing TDs */
  projectedRushingTDs?: number | undefined;
  /** Projected receiving yards */
  projectedReceivingYards?: number | undefined;
  /** Projected receptions */
  projectedReceptions?: number | undefined;
  /** Projected receiving TDs */
  projectedReceivingTDs?: number | undefined;
  /** Projected fantasy points */
  projectedFantasyPoints?: number | undefined;
}
