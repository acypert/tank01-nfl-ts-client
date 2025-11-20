/**
 * NFL Player entity
 */
export interface Player {
  /** Unique player identifier */
  playerID: string;
  /** Player's full name */
  longName: string;
  /** Player's first name */
  firstName?: string | undefined;
  /** Player's last name */
  lastName?: string | undefined;
  /** Player's jersey number */
  jerseyNum?: string | undefined;
  /** Player's position (e.g., "QB", "RB", "WR") */
  pos: string;
  /** Player's team abbreviation */
  team: string;
  /** Player's team ID */
  teamID?: string | undefined;
  /** Player's height in inches */
  height?: string | undefined;
  /** Player's weight in pounds */
  weight?: string | undefined;
  /** Player's date of birth */
  bDay?: string | undefined;
  /** Player's college */
  college?: string | undefined;
  /** Player's draft year */
  draftYear?: string | undefined;
  /** Player's draft round */
  draftRound?: string | undefined;
  /** Player's draft pick number */
  draftPick?: string | undefined;
  /** Player's experience/years in NFL */
  exp?: string | undefined;
  /** Player's injury status */
  injury?: PlayerInjury | undefined;
}

/**
 * Player injury information
 */
export interface PlayerInjury {
  /** Injury designation (e.g., "Questionable", "Out", "IR") */
  designation?: string | undefined;
  /** Description of the injury */
  description?: string | undefined;
  /** Injury date */
  injDate?: string | undefined;
}

/**
 * Player statistics (basic stats common across positions)
 */
export interface PlayerStatistics {
  /** Player ID reference */
  playerID: string;
  /** Season year */
  season: string;
  /** Team abbreviation */
  team: string;
  /** Games played */
  gamesPlayed?: number | undefined;
  /** Games started */
  gamesStarted?: number | undefined;

  // Passing stats (QB)
  passingYards?: number | undefined;
  passingTDs?: number | undefined;
  passingINTs?: number | undefined;
  passingCompletions?: number | undefined;
  passingAttempts?: number | undefined;

  // Rushing stats (RB, QB, etc.)
  rushingYards?: number | undefined;
  rushingTDs?: number | undefined;
  rushingAttempts?: number | undefined;

  // Receiving stats (WR, TE, RB)
  receivingYards?: number | undefined;
  receivingTDs?: number | undefined;
  receptions?: number | undefined;
  targets?: number | undefined;

  // Defense stats
  tackles?: number | undefined;
  sacks?: number | undefined;
  interceptions?: number | undefined;
  forcedFumbles?: number | undefined;

  // Kicking stats
  fgMade?: number | undefined;
  fgAttempts?: number | undefined;
  extraPointsMade?: number | undefined;
  extraPointsAttempts?: number | undefined;
}

/**
 * Player search filters
 */
export interface PlayerSearchFilters {
  /** Filter by team abbreviation */
  team?: string | undefined;
  /** Filter by position */
  position?: string | undefined;
  /** Filter by player name (partial match) */
  name?: string | undefined;
  /** Filter by injury status */
  availabilityStatus?: 'active' | 'injured' | 'all' | undefined;
  /** Filter by rookie status */
  isRookie?: boolean | undefined;
}
