/**
 * NFL Player entity
 */
export interface Player {
  /** Unique player identifier */
  playerID: string;
  /** Player's full name */
  longName: string;
  /** Player's jersey number */
  jerseyNum: string;
  /** Player's position (e.g., "QB", "RB", "WR") */
  pos: string;
  /** Player's team abbreviation */
  team: string;
  /** Player's height in inches */
  height: string;
  /** Player's weight in pounds */
  weight: string;
  /** Player's date of birth */
  bDay: string;
  /** Player's college */
  school: string;
  /** Player's experience/years in NFL */
  exp: string;
  /** Player's injury status */
  injury: PlayerInjury;
  /** Player's age */
  age: string;
  /** ESPN ID */
  espnID: string;
  /** ESPN name */
  espnName: string;
  /** ESPN link */
  espnLink: string;
  /** ESPN headshot */
  espnHeadshot: string;
  /** ESPN ID full */
  espnIDFull: string;
  /** CBS player ID */
  cbsPlayerID: string;
  /** CBS long name */
  cbsLongName: string;
  /** CBS short name */
  cbsShortName: string;
  /** CBS player ID full */
  cbsPlayerIDFull: string;
  /** Yahoo player ID */
  yahooPlayerID: string;
  /** Yahoo link */
  yahooLink: string;
  /** Sleeper bot ID */
  sleeperBotID: string;
  /** FanSided reference ID */
  fRefID: string;
  /** RotoWire player ID */
  rotoWirePlayerID: string;
  /** RotoWire player ID full */
  rotoWirePlayerIDFull: string;
  /** FantasyPros link */
  fantasyProsLink: string;
  /** FantasyPros player ID */
  fantasyProsPlayerID: string;
  /** Last game played */
  lastGamePlayed: string;
  /** Is free agent */
  isFreeAgent: string;
  /** First seen */
  firstSeen: string;
  /** Team ID */
  teamID: string;
}

/**
 * Player injury information
 */
export interface PlayerInjury {
  /** Injury designation (e.g., "Questionable", "Out", "IR") */
  designation: string;
  /** Description of the injury */
  description: string;
  /** Injury date */
  injDate: string;
  /** Injury return date */
  injReturnDate: string;
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

/**
 * Options for getNFLPlayerInfo endpoint
 * Requires either playerName or playerID (mutually exclusive)
 */
export interface GetPlayerInfoOptions {
  /** Player name (e.g., "Brock Purdy") - use this OR playerID */
  playerName?: string;
  /** Player ID (e.g., "4381786") - use this OR playerName */
  playerID?: string;
  /** Include player statistics in response */
  getStats?: boolean;
}

/**
 * Options for getNFLGamesForPlayer endpoint
 */
export interface GetGamesForPlayerOptions {
  /** Player ID */
  playerID: string;
  /** Optional team ID filter */
  teamID?: string;
  /** Optional game ID filter */
  gameID?: string;
  /** Response format: "map" or "list" */
  itemFormat?: 'map' | 'list';
  /** Number of games to return */
  numberOfGames?: number;
  /** Include fantasy points (defaults to false when omitted) */
  fantasyPoints?: boolean;
}

/**
 * Player game log entry
 */
export type PlayerGameLog = Record<string, PlayerGame>;

export interface PlayerGame {
  Defense?: DefenseStats | undefined;
  Passing?: PassingStats | undefined;
  Receiving?: ReceivingStats | undefined;
  Rushing?: RushingStats | undefined;
  longName: string;
  playerID: string;
  scoringPlays?: ScoringPlay[] | undefined;
  snapCounts?: SnapCounts | undefined;
  team: string;
  teamAbv: string;
  teamID: string;
  gameID: string;
}

export interface DefenseStats {
  fumblesLost?: string | undefined;
  defensiveInterceptions: string;
  forcedFumbles: string;
  fumbles?: string | undefined;
  fumblesRecovered?: string | undefined;
}

export interface PassingStats {
  qbr: string;
  rtg: string;
  sacked: string;
  passAttempts: string;
  passAvg: string;
  passTD: string;
  passYds: string;
  int: string;
  passCompletions: string;
  passingTwoPointConversion?: string | undefined;
}

export interface ReceivingStats {
  receptions: string;
  recTD: string;
  longRec: string;
  targets: string;
  recYds: string;
  recAvg: string;
}

export interface RushingStats {
  rushAvg: string;
  rushYds: string;
  carries: string;
  longRush: string;
  rushTD: string;
  rushingTwoPointConversion?: string | undefined;
}

export interface ScoringPlay {
  score: string;
  scorePeriod: string;
  homeScore: string;
  awayScore: string;
  teamID: string;
  scoreDetails: string;
  scoreType: string;
  scoreTime: string;
  team: string;
  playerIDs: string[];
}

export interface SnapCounts {
  offSnapPct: string;
  defSnap: string;
  stSnap: string;
  stSnapPct: string;
  offSnap: string;
  defSnapPct: string;
}
