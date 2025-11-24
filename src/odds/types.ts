
export type GameOdds = Record<string, GameOddsInfo>;

export interface GameOddsInfo {
  awayTeam: string;
  ballybet: SportsbookOdds;
  bet365: SportsbookOdds;
  betmgm: SportsbookOdds;
  betrivers: SportsbookOdds;
  caesars_sportsbook: SportsbookOdds;
  draftkings: SportsbookOdds;
  espnbet: SportsbookOdds;
  fanduel: SportsbookOdds;
  gameDate: string;
  hardrock: SportsbookOdds;
  homeTeam: string;
  last_updated_e_time: string;
  teamIDAway: string;
  teamIDHome: string;
  gameID: string;
}

/**
 * Odds from a specific sportsbook
 */
export interface SportsbookOdds {
  totalUnder: string;
  awayTeamSpread: string;
  awayTeamSpreadOdds: string;
  homeTeamSpread: string;
  homeTeamSpreadOdds: string;
  totalOverOdds: string;
  totalUnderOdds: string;
  awayTeamMLOdds: string;
  homeTeamMLOdds: string;
  totalOver: string;
}

/**
 * Player prop bet
 */
export interface PlayerProp {
  playerID: string;
  playerName: string;
  team: string;
  propType: string; // e.g., "passingYards", "touchdowns"
  line?: number | undefined;
  overOdds?: number | undefined;
  underOdds?: number | undefined;
  sportsbook?: string | undefined;
  [key: string]: unknown;
}

/**
 * Options for getNFLBettingOdds endpoint
 *
 * **OR Parameter Requirement**: Must provide either `gameDate` OR `gameID` (not both, not neither)
 */
export interface GetBettingOddsOptions {
  /**
   * Game date (format: YYYYMMDD) - use this OR gameID
   */
  gameDate?: string | undefined;

  /**
   * Game ID (format: YYYYMMDD_AWAY@HOME) - use this OR gameDate
   */
  gameID?: string | undefined;

  /**
   * Response format: "map" or "list"
   */
  itemFormat?: 'map' | 'list' | undefined;

  /**
   * Include implied totals from odds
   */
  impliedTotals?: boolean | undefined;

  /**
   * Include player prop bets
   */
  playerProps?: boolean | undefined;

  /**
   * Filter player props by specific player ID
   */
  playerID?: string | undefined;
}
