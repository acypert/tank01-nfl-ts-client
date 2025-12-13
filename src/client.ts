import type { ClientConfiguration, ResolvedClientConfiguration } from './common/config/types.js';
import { loadConfiguration } from './common/config/loader.js';
import { HttpClient } from './common/http/client.js';
import { validateOneOf } from './common/validation/parameters.js';
import { Tank01NotFoundError } from './common/errors/not-found.js';
import type { Tank01Response } from './types/index.js';
import type {
  Team,
  GetNFLTeamsOptions,
  GetTeamRosterOptions,
  DepthChart,
  RosterPlayer,
} from './teams/types.js';
import type {
  Player,
  PlayerSearchFilters,
  GetPlayerInfoOptions,
  GetGamesForPlayerOptions,
  PlayerGameLog,
} from './players/types.js';
import type {
  Game,
  GameDetails,
  GameScheduleFilters,
  GetGamesForWeekOptions,
  GetBoxScoreOptions,
  GetGamesForDateOptions,
  GetScoresOnlyOptions,
} from './games/types.js';
import type { LiveBoxScore } from './live/types.js';
import type {
  ADPType,
  GetADPOptions,
  ADPResponse,
  GetProjectionsOptions,
  ProjectionsResponse,
  GetDFSOptions,
  DFSPlayer,
} from './fantasy/types.js';
import type { GetBettingOddsOptions, BettingOddsResponse } from './odds/types.js';
import type { GetNewsOptions, NewsArticle } from './news/types.js';
import type { CurrentInfo } from './info/types.js';
import { Tank01ValidationError } from './common/index.js';

/**
 * Main Tank01 NFL API client with flat interface
 *
 * All methods are directly accessible on the client instance without nested property access.
 *
 * @example
 * ```typescript
 * import { Tank01Client } from '@tank01/nfl-client';
 *
 * const client = new Tank01Client({
 *   apiKey: process.env.TANK01_API_KEY,
 * });
 *
 * // Flat interface - no nested clients
 * const teams = await client.getNFLTeams();
 * const purdy = await client.getNFLPlayerInfo({ playerID: 4381786 });
 * const games = await client.getNFLGamesForWeek({ week: '1' });
 * ```
 */
export class Tank01Client {
  private readonly config: ResolvedClientConfiguration;
  /** @internal */
  protected readonly httpClient: HttpClient;

  /**
   * Create a new Tank01 NFL API client
   *
   * @param config - Client configuration options
   * @throws {Tank01AuthenticationError} If no API key is provided or found in environment
   *
   * @example
   * ```typescript
   * const client = new Tank01Client({
   *   apiKey: 'your-api-key',
   *   timeout: 30000,    // optional, defaults to 30s
   *   maxRetries: 3,     // optional, defaults to 3
   *   debug: false,      // optional, defaults to false
   * });
   * ```
   */
  constructor(config: ClientConfiguration = {}) {
    // Load and validate configuration
    this.config = loadConfiguration(config);

    // Initialize HTTP client
    this.httpClient = new HttpClient(this.config);
  }

  // ========================================
  // Teams Methods
  // ========================================

  /**
   * Retrieve all NFL teams with optional additional data
   *
   * @param options - Optional parameters for additional data
   * @param options.sortBy - Sort teams by specific field
   * @param options.rosters - Include team rosters in response
   * @param options.schedules - Include team schedules in response
   * @param options.topPerformers - Include top performers in response
   * @param options.teamStats - Include team statistics in response
   * @param options.teamStatsSeason - Season year for team statistics
   * @param options.standingsSeason - Season year for standings
   * @returns Array of all NFL teams
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01NetworkError} Network failure
   * @throws {Tank01ValidationError} Response schema mismatch
   *
   * @example
   * ```typescript
   * // Basic usage
   * const teams = await client.getNFLTeams();
   * console.log(teams.length); // 32
   *
   * // With rosters and stats
   * const teamsWithData = await client.getNFLTeams({
   *   rosters: true,
   *   teamStats: true,
   *   teamStatsSeason: "2024"
   * });
   * ```
   */
  async getNFLTeams(options?: GetNFLTeamsOptions): Promise<Tank01Response<Team[]>> {
    const params: Record<string, string | boolean> = {};

    if (options) {
      if (options.sortBy) params.sortBy = options.sortBy;
      if (options.rosters !== undefined) params.rosters = options.rosters;
      if (options.schedules !== undefined) params.schedules = options.schedules;
      if (options.topPerformers !== undefined) params.topPerformers = options.topPerformers;
      if (options.teamStats !== undefined) params.teamStats = options.teamStats;
      if (options.teamStatsSeason) params.teamStatsSeason = options.teamStatsSeason;
      if (options.standingsSeason) params.standingsSeason = options.standingsSeason;
    }

    const response = await this.httpClient.get<Team[]>(
      '/getNFLTeams',
      Object.keys(params).length > 0 ? params : undefined
    );
    return response;
  }

  /**
   * Retrieve specific team information
   *
   * @param teamID - Team abbreviation (e.g., "KC", "PHI", "SF")
   * @returns Team object
   * @throws {Tank01NotFoundError} Team not found
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid teamID format
   *
   * @example
   * ```typescript
   * const niners = await client.getNFLTeam("SF");
   * console.log(niners.teamName); // "San Francisco 49ers"
   * ```
   */
  async getNFLTeam(teamID: string): Promise<Tank01Response<Team>> {
    // Validate teamID format
    if (!teamID || teamID.length < 2 || teamID.length > 3) {
      throw new Tank01NotFoundError(
        `Invalid team ID format: ${teamID}. Must be 2-3 uppercase letters.`
      );
    }

    const teams = await this.getNFLTeams();
    const team = teams.body.find(
      (t) => t.teamID === teamID.toUpperCase() || t.teamAbv === teamID.toUpperCase()
    );

    if (!team) {
      throw new Tank01NotFoundError(`Team not found: ${teamID}`);
    }

    return {
      statusCode: teams.statusCode,
      body: team,
      ...(teams.error ? { error: teams.error } : {}),
    };
  }

  /**
   * Retrieve team roster with optional player statistics
   *
   * **OR Parameter Requirement**: Must provide either `teamID` OR `teamAbv` (not both, not neither)
   *
   * @param options - Options object
   * @param options.teamID - Team ID (e.g., "KC") - use this OR teamAbv
   * @param options.teamAbv - Team abbreviation (e.g., "KC") - use this OR teamID
   * @param options.archiveDate - Archive date for historical rosters (format: YYYYMMDD)
   * @param options.getStats - Include player statistics in roster
   * @param options.fantasyPoints - Include fantasy points (requires getStats: true)
   * @returns Array of players on the team roster
   * @throws {TypeError} If neither teamID nor teamAbv provided, or if both provided
   * @throws {Tank01NotFoundError} Team not found
   * @throws {Tank01ValidationError} Invalid parameter format
   *
   * @example
   * ```typescript
   * // Using teamID
   * const roster = await client.getNFLTeamRoster({
   *   teamID: "SF",
   *   getStats: true,
   *   fantasyPoints: true
   * });
   *
   * // Using teamAbv
   * const roster2 = await client.getNFLTeamRoster({
   *   teamAbv: "KC",
   *   archiveDate: "20240901"
   * });
   * ```
   */
  async getNFLTeamRoster(
    options: GetTeamRosterOptions
  ): Promise<Tank01Response<{ team: string; roster: RosterPlayer[] }>> {
    // Validate OR requirement: exactly one of teamID or teamAbv
    validateOneOf(['teamID', 'teamAbv'], options as Record<string, unknown>, 'getNFLTeamRoster');

    const params: Record<string, string | boolean> = {};

    if (options.teamID) {
      params.teamID = options.teamID.toUpperCase();
    } else if (options.teamAbv) {
      params.teamAbv = options.teamAbv.toUpperCase();
    }

    if (options.archiveDate) params.archiveDate = options.archiveDate;
    if (options.getStats !== undefined) params.getStats = options.getStats;
    if (options.fantasyPoints !== undefined) params.fantasyPoints = options.fantasyPoints;

    const response = await this.httpClient.get<{ team: string; roster: RosterPlayer[] }>(
      '/getNFLTeamRoster',
      params
    );

    return response;
  }

  /**
   * Retrieve NFL depth charts for all teams
   *
   * Returns current depth chart information showing starter/backup positions
   * for all NFL teams.
   *
   * @returns Array of team depth charts
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01NetworkError} Network failure
   * @throws {Tank01ValidationError} Response schema mismatch
   *
   * @example
   * ```typescript
   * const depthCharts = await client.getNFLDepthCharts();
   * const sfDepth = depthCharts.find(dc => dc.teamAbv === "SF");
   * console.log(sfDepth.depthChart.QB); // QB depth chart
   * ```
   */
  async getNFLDepthCharts(): Promise<Tank01Response<DepthChart[]>> {
    const response = await this.httpClient.get<DepthChart[]>('/getNFLDepthCharts');
    return response;
  }

  // ========================================
  // Players Methods
  // ========================================

  /**
   * Retrieve all NFL players
   *
   * @returns Array of all NFL players (4,500+ records)
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01NetworkError} Network failure
   *
   * @example
   * ```typescript
   * const players = await client.getNFLPlayerList();
   * console.log(players.length); // 4500+
   * ```
   */
  async getNFLPlayerList(): Promise<Tank01Response<Player[]>> {
    const response = await this.httpClient.get<Player[]>('/getNFLPlayerList');
    return response;
  }

  /**
   * Retrieve specific player information
   *
   * **OR Parameter Requirement**: Must provide either `playerName` OR `playerID` (not both, not neither)
   *
   * @param options - Options object
   * @param options.playerName - Player name (e.g., "Brock Purdy") - use this OR playerID
   * @param options.playerID - Player ID (e.g., "4381786") - use this OR playerName
   * @param options.getStats - Include player statistics
   * @returns Player object
   * @throws {TypeError} If neither playerName nor playerID provided, or if both provided
   * @throws {Tank01NotFoundError} Player not found
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * // Using playerID
   * const purdy = await client.getNFLPlayerInfo({ playerID: "4381786" });
   * console.log(purdy.longName); // "Brock Purdy"
   *
   * // Using playerName
   * const mahomes = await client.getNFLPlayerInfo({
   *   playerName: "Patrick Mahomes",
   *   getStats: true
   * });
   * ```
   */
  async getNFLPlayerInfo(options: GetPlayerInfoOptions): Promise<Tank01Response<Player | Player[]>> {
    // Validate OR requirement: exactly one of playerName or playerID
    validateOneOf(
      ['playerName', 'playerID'],
      options as Record<string, unknown>,
      'getNFLPlayerInfo'
    );

    const params: Record<string, string | boolean> = {};

    if (options.playerName) {
      params.playerName = options.playerName;
    } else if (options.playerID) {
      params.playerID = options.playerID;
    }

    if (options.getStats !== undefined) {
      params.getStats = options.getStats;
    }

    const response = await this.httpClient.get<Player[]>(
      '/getNFLPlayerInfo',
      Object.keys(params).length > 0 ? params : undefined
    );

    return response;
  }

  /**
   * Search for players with filters
   *
   * @param filters - Search filters
   * @returns Array of matching players
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * const qbs = await client.searchNFLPlayers({
   *   team: "SF",
   *   position: "QB"
   * });
   * ```
   */
  async searchNFLPlayers(filters?: PlayerSearchFilters): Promise<Tank01Response<Player[]>> {
    const allPlayers = await this.getNFLPlayerList();

    if (!filters || Object.keys(filters).length === 0) {
      return allPlayers;
    }

    const filteredPlayers = allPlayers.body.filter((player) => {
      if (filters.team && player.team !== filters.team.toUpperCase()) return false;
      if (filters.position && player.pos !== filters.position.toUpperCase()) return false;
      if (filters.name) {
        const searchName = filters.name.toLowerCase();
        if (!player.longName.toLowerCase().includes(searchName)) return false;
      }
      if (filters.availabilityStatus && filters.availabilityStatus !== 'all') {
        const hasInjury = player.injury !== undefined && player.injury !== null;
        if (filters.availabilityStatus === 'injured' && !hasInjury) return false;
        if (filters.availabilityStatus === 'active' && hasInjury) return false;
      }
      if (filters.isRookie !== undefined) {
        const isRookie = player.exp === '0' || player.exp === 'R';
        if (filters.isRookie !== isRookie) return false;
      }
      return true;
    });

    return {
      statusCode: allPlayers.statusCode,
      body: filteredPlayers,
      ...(allPlayers.error ? { error: allPlayers.error } : {}),
    };
  }

  /**
   * Retrieve game logs for a specific player
   *
   * @param options - Options object
   * @param options.playerID - Player ID (required)
   * @param options.teamID - Optional team ID filter
   * @param options.gameID - Optional game ID filter
   * @param options.itemFormat - Response format: "map" or "list"
   * @param options.numberOfGames - Number of games to return
   * @param options.fantasyPoints - Include fantasy points (defaults to false when omitted)
   * @returns Player game logs (Record format)
   * @throws {Tank01NotFoundError} Player or games not found
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * const gameLogs = await client.getNFLGamesForPlayer({
   *   playerID: "4381786",
   *   numberOfGames: 5,
   *   fantasyPoints: true
   * });
   * console.log(gameLogs[0].stats.passingYards);
   * ```
   */
  async getNFLGamesForPlayer(
    options: GetGamesForPlayerOptions
  ): Promise<Tank01Response<PlayerGameLog>> {
    const params: Record<string, string | boolean | number> = {
      playerID: options.playerID,
    };

    if (options.teamID) params.teamID = options.teamID;
    if (options.gameID) params.gameID = options.gameID;
    if (options.itemFormat) params.itemFormat = options.itemFormat;
    if (options.numberOfGames) params.numberOfGames = options.numberOfGames;
    if (options.fantasyPoints !== undefined) params.fantasyPoints = options.fantasyPoints;

    const response = await this.httpClient.get<PlayerGameLog>('/getNFLGamesForPlayer', params);

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Game logs not found for player: ${options.playerID}`);
    }

    return response;
  }

  // ========================================
  // Games Methods
  // ========================================

  /**
   * Retrieve games for a specific week
   *
   * @param options - Options object
   * @param options.week - Week number (required, e.g., "1", "18")
   * @param options.season - Season year (optional, defaults to current)
   * @param options.seasonType - Season type: "reg" (regular), "post" (playoffs), "pre" (preseason), "all"
   * @returns Array of games
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid season or week format
   *
   * @example
   * ```typescript
   * // Regular season games
   * const games = await client.getNFLGamesForWeek({
   *   week: "1",
   *   season: "2024",
   *   seasonType: "reg"
   * });
   *
   * // Playoff games
   * const playoffs = await client.getNFLGamesForWeek({
   *   week: "1",
   *   seasonType: "post"
   * });
   * ```
   */
  async getNFLGamesForWeek(
    options: GetGamesForWeekOptions | string,
    week?: string
  ): Promise<Tank01Response<Game[]>> {
    // Support both old (string, string) and new (options object) signatures
    let params: Record<string, string>;

    if (typeof options === 'string') {
      // Old signature: getNFLGamesForWeek(season, week)
      params = { season: options, week: week! };
    } else {
      // New signature: getNFLGamesForWeek({ week, season?, seasonType? })
      params = { week: options.week };
      if (options.season) params.season = options.season;
      if (options.seasonType) params.seasonType = options.seasonType;
    }

    const response = await this.httpClient.get<Game[]>('/getNFLGamesForWeek', params);
    return response;
  }

  /**
   * Retrieve detailed game information
   *
   * @param gameID - Game ID (format: YYYYMMDD_AWAY@HOME)
   * @returns Game details object
   * @throws {Tank01NotFoundError} Game not found
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * const game = await client.getNFLGameInfo("20240908_SF@PIT");
   * console.log(game.scoringPlays);
   * ```
   */
  async getNFLGameInfo(gameID: string): Promise<Tank01Response<GameDetails>> {
    const response = await this.httpClient.get<GameDetails>('/getNFLGameInfo', {
      gameID,
    });

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Game not found: ${gameID}`);
    }

    return response;
  }

  /**
   * Retrieve team schedule
   *
   * @param teamID - Team abbreviation
   * @param season - Season year (optional, defaults to current season)
   * @returns Array of games for the team
   * @throws {Tank01NotFoundError} Team not found
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * const schedule = await client.getNFLTeamSchedule("SF", "2024");
   * console.log(schedule.length); // 17 regular season games
   * ```
   */
  async getNFLTeamSchedule(teamID: string, season?: string): Promise<Tank01Response<Game[]>> {
    const params: Record<string, string> = { teamID: teamID.toUpperCase() };
    if (season) {
      params.season = season;
    }

    const response = await this.httpClient.get<Game[]>('/getNFLTeamSchedule', params);

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Team schedule not found for: ${teamID}`);
    }

    return response;
  }

  /**
   * Search for games with filters
   *
   * @param filters - Search filters
   * @returns Array of matching games
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * const playoffGames = await client.searchNFLGames({
   *   season: "2024",
   *   playoffsOnly: true
   * });
   * ```
   */
  async searchNFLGames(filters?: GameScheduleFilters): Promise<Tank01Response<Game[]>> {
    if (!filters || !filters.season) {
      throw new Tank01ValidationError('Season is required for game search');
    }

    const currentWeek = filters.week || '1';
    const weekGames = await this.getNFLGamesForWeek(filters.season, currentWeek);
    const allGames = weekGames.body;

    if (!filters.team && !filters.status) {
      return weekGames;
    }

    const filteredGames = allGames.filter((game) => {
      if (filters.team) {
        const teamUpper = filters.team.toUpperCase();
        if (game.away !== teamUpper && game.home !== teamUpper) return false;
      }
      if (filters.status && filters.status !== 'all') {
        const gameStatus = game.gameStatus?.toLowerCase() || '';
        if (filters.status === 'scheduled' && !gameStatus.includes('scheduled')) return false;
        if (filters.status === 'live' && !gameStatus.includes('progress')) return false;
        if (filters.status === 'final' && !gameStatus.includes('final')) return false;
      }
      return true;
    });

    return {
      statusCode: weekGames.statusCode,
      body: filteredGames,
      ...(weekGames.error ? { error: weekGames.error } : {}),
    };
  }

  /**
   * Retrieve games for a specific date
   *
   * @param options - Options object
   * @param options.gameDate - Game date (required, format: YYYYMMDD)
   * @returns Array of games on the specified date
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid date format
   *
   * @example
   * ```typescript
   * const games = await client.getNFLGamesForDate({ gameDate: "20240908" });
   * console.log(games.map(g => `${g.away} @ ${g.home}`));
   * ```
   */
  async getNFLGamesForDate(options: GetGamesForDateOptions): Promise<Tank01Response<Game[]>> {
    const response = await this.httpClient.get<Game[]>('/getNFLGamesForDate', {
      gameDate: options.gameDate,
    });
    return response;
  }

  /**
   * Retrieve scores only (lighter weight endpoint)
   *
   * @param options - Optional filter parameters
   * @param options.season - Season year
   * @param options.week - Week number
   * @param options.gameDate - Game date (format: YYYYMMDD)
   * @param options.topTeamsOnly - Top 25 ranked teams only
   * @returns Array of games with scores
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * // Get all scores for current week
   * const scores = await client.getNFLScoresOnly();
   *
   * // Get scores for specific week
   * const weekScores = await client.getNFLScoresOnly({
   *   season: "2024",
   *   week: "1"
   * });
   * ```
   */
  async getNFLScoresOnly(options?: GetScoresOnlyOptions): Promise<Tank01Response<Game[]>> {
    const params: Record<string, string | boolean> = {};

    if (options) {
      if (options.season) params.season = options.season;
      if (options.week) params.week = options.week;
      if (options.gameDate) params.gameDate = options.gameDate;
      if (options.topTeamsOnly !== undefined) params.topTeamsOnly = options.topTeamsOnly;
    }

    const response = await this.httpClient.get<Game[]>(
      '/getNFLScoresOnly',
      Object.keys(params).length > 0 ? params : undefined
    );
    return response;
  }

  // ========================================
  // Live Methods
  // ========================================

  /**
   * Retrieve live box score for a game
   *
   * @param options - Options object or gameID string (for backward compatibility)
   * @param options.gameID - Game ID (format: YYYYMMDD_AWAY@HOME)
   * @param options.playByPlay - Include play-by-play data
   * @param options.fantasyPoints - Include fantasy points
   * @returns Live box score object
   * @throws {Tank01NotFoundError} Game not found
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * // Basic usage
   * const boxScore = await client.getNFLBoxScore({ gameID: "20240908_SF@PIT" });
   *
   * // With play-by-play and fantasy points
   * const detailed = await client.getNFLBoxScore({
   *   gameID: "20240908_SF@PIT",
   *   playByPlay: true,
   *   fantasyPoints: true
   * });
   * ```
   */
  async getNFLBoxScore(
    options: GetBoxScoreOptions | string
  ): Promise<Tank01Response<LiveBoxScore>> {
    // Support both old (string) and new (options object) signatures
    const params: Record<string, string | boolean> = {};

    if (typeof options === 'string') {
      // Old signature: getNFLBoxScore(gameID)
      params.gameID = options;
    } else {
      // New signature: getNFLBoxScore({ gameID, playByPlay?, fantasyPoints? })
      params.gameID = options.gameID;
      if (options.playByPlay !== undefined) params.playByPlay = options.playByPlay;
      if (options.fantasyPoints !== undefined) params.fantasyPoints = options.fantasyPoints;
    }

    const response = await this.httpClient.get<LiveBoxScore>('/getNFLBoxScore', params);

    if (!response || typeof response !== 'object' || !('body' in response)) {
      throw new Tank01NotFoundError(`Box score not found for game: ${params.gameID}`);
    }

    return response;
  }

  /**
   * Check if a game is currently live
   *
   * @param gameID - Game ID (format: YYYYMMDD_AWAY@HOME)
   * @returns True if game is live, false otherwise
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * const isLive = await client.isNFLGameLive("20240908_SF@PIT");
   * if (isLive) {
   *   console.log("Game is in progress");
   * }
   * ```
   */
  async isNFLGameLive(gameID: string): Promise<boolean> {
    try {
      const scores = await this.getNFLScoresOnly();
      const game = scores.body.find((g) => g.gameID === gameID);
      if (!game) return false;
      const status = game.gameStatus?.toLowerCase() || '';
      return status.includes('progress') || status.includes('live');
    } catch {
      return false;
    }
  }

  // ========================================
  // Fantasy Methods
  // ========================================

  /**
   * Retrieve Average Draft Position (ADP) data
   *
   * @param adpType - Type of ADP data (required): "halfPPR", "PPR", "standard", "bestBall", "IDP", "superFlex"
   * @param options - Optional filters
   * @param options.adpDate - Historical ADP date (format: YYYYMMDD)
   * @param options.pos - Position filter (e.g., "QB", "RB", "WR")
   * @param options.filterOut - Comma-separated list of players to exclude
   * @returns ADP response object with player data
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid adpType or parameters
   *
   * @example
   * ```typescript
   * // Get half-PPR ADP
   * const adp = await client.getNFLADP("halfPPR");
   *
   * // Get PPR ADP for RBs only
   * const rbAdp = await client.getNFLADP("PPR", { pos: "RB" });
   *
   * // Get historical ADP
   * const historicalAdp = await client.getNFLADP("standard", {
   *   adpDate: "20240901"
   * });
   * ```
   */
  async getNFLADP(
    adpType: ADPType,
    options?: Omit<GetADPOptions, 'adpType'>
  ): Promise<Tank01Response<ADPResponse>> {
    const params: Record<string, string> = {
      adpType,
    };

    if (options) {
      if (options.adpDate) params.adpDate = options.adpDate;
      if (options.pos) params.pos = options.pos;
      if (options.filterOut) params.filterOut = options.filterOut;
    }

    const response = await this.httpClient.get<ADPResponse>('/getNFLADP', params);
    return response;
  }

  /**
   * Retrieve fantasy projections for players
   *
   * **Note**: playerID parameter overrides week and teamID filters.
   *
   * @param options - Optional filters
   * @param options.week - Week number (1-18 for regular season)
   * @param options.playerID - Specific player ID (overrides week/teamID)
   * @param options.teamID - Team abbreviation filter
   * @param options.archiveSeason - Season year (e.g., "2023")
   * @param options.itemFormat - Response format: "map" or "list"
   * @returns Projections response object with player and team defense projections
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * // Get projections for current week
   * const projections = await client.getNFLProjections({ week: "1" });
   *
   * // Get projections for specific player
   * const purdyProj = await client.getNFLProjections({
   *   playerID: "4381786"
   * });
   *
   * // Get projections for a team
   * const sfProj = await client.getNFLProjections({
   *   teamID: "SF",
   *   week: "5"
   * });
   * ```
   */
  async getNFLProjections(
    options?: GetProjectionsOptions
  ): Promise<Tank01Response<ProjectionsResponse>> {
    const params: Record<string, string> = {};

    if (options) {
      if (options.week) params.week = options.week;
      if (options.playerID) params.playerID = options.playerID;
      if (options.teamID) params.teamID = options.teamID;
      if (options.archiveSeason) params.archiveSeason = options.archiveSeason;
      if (options.itemFormat) params.itemFormat = options.itemFormat;
    }

    const response = await this.httpClient.get<ProjectionsResponse>(
      '/getNFLProjections',
      Object.keys(params).length > 0 ? params : undefined
    );
    return response;
  }

  /**
   * Retrieve Daily Fantasy Sports (DFS) data and salaries
   *
   * @param date - Date for DFS data (required, format: YYYYMMDD)
   * @param options - Optional parameters
   * @param options.includeTeamDefense - Include team defense/special teams
   * @returns DFS player data with salaries
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid date format
   *
   * @example
   * ```typescript
   * // Get DFS data for a specific date
   * const dfs = await client.getNFLDFS("20240908");
   *
   * // Include team defenses
   * const dfsWithDefense = await client.getNFLDFS("20240908", {
   *   includeTeamDefense: true
   * });
   * ```
   */
  async getNFLDFS(
    date: string,
    options?: Omit<GetDFSOptions, 'date'>
  ): Promise<Tank01Response<DFSPlayer>> {
    const params: Record<string, string | boolean> = {
      date,
    };

    if (options?.includeTeamDefense !== undefined) {
      params.includeTeamDefense = options.includeTeamDefense;
    }

    const response = await this.httpClient.get<DFSPlayer>('/getNFLDFS', params);
    return response;
  }

  // ========================================
  // Odds Methods
  // ========================================

  /**
   * Retrieve NFL betting odds from multiple sportsbooks
   *
   * **OR Parameter Requirement**: Must provide either `gameDate` OR `gameID` (not both, not neither)
   *
   * @param options - Options object
   * @param options.gameDate - Game date (format: YYYYMMDD) - use this OR gameID
   * @param options.gameID - Game ID (format: YYYYMMDD_AWAY@HOME) - use this OR gameDate
   * @param options.itemFormat - Response format: "map" or "list"
   * @param options.impliedTotals - Include implied totals from odds
   * @param options.playerProps - Include player prop bets
   * @param options.playerID - Filter player props by specific player
   * @returns Game odds from multiple sportsbooks (Record format)
   * @throws {TypeError} If neither gameDate nor gameID provided, or if both provided
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid parameter format
   *
   * @example
   * ```typescript
   * // Get odds for a specific date
   * const odds = await client.getNFLBettingOdds({
   *   gameDate: "20240908"
   * });
   *
   * // Get odds for a specific game with player props
   * const gameOdds = await client.getNFLBettingOdds({
   *   gameID: "20240908_SF@PIT",
   *   playerProps: true
   * });
   *
   * // Get player-specific props
   * const purdyProps = await client.getNFLBettingOdds({
   *   gameDate: "20240908",
   *   playerProps: true,
   *   playerID: "4381786"
   * });
   * ```
   */
  async getNFLBettingOdds(
    options: GetBettingOddsOptions
  ): Promise<Tank01Response<BettingOddsResponse>> {
    // Validate OR requirement: exactly one of gameDate or gameID
    validateOneOf(['gameDate', 'gameID'], options as Record<string, unknown>, 'getNFLBettingOdds');

    const params: Record<string, string | boolean> = {};

    if (options.gameDate) {
      params.gameDate = options.gameDate;
    } else if (options.gameID) {
      params.gameID = options.gameID;
    }

    if (options.itemFormat) params.itemFormat = options.itemFormat;
    if (options.impliedTotals !== undefined) params.impliedTotals = options.impliedTotals;
    if (options.playerProps !== undefined) params.playerProps = options.playerProps;
    if (options.playerID) params.playerID = options.playerID;

    const response = await this.httpClient.get<BettingOddsResponse>('/getNFLBettingOdds', params);
    return response;
  }

  // ========================================
  // News Methods
  // ========================================

  /**
   * Retrieve NFL news articles with optional filters
   *
   * @param options - Optional filter parameters
   * @param options.playerID - Filter by player ID
   * @param options.teamID - Filter by team ID
   * @param options.teamAbv - Filter by team abbreviation
   * @param options.topNews - Get top/breaking news only
   * @param options.fantasyNews - Get fantasy-relevant news only
   * @param options.recentNews - Get most recent news only
   * @param options.maxItems - Maximum number of articles to return
   * @returns News articles
   * @throws {Tank01AuthenticationError} Invalid API key
   *
   * @example
   * ```typescript
   * // Get all news
   * const news = await client.getNFLNews();
   *
   * // Get news for a specific team
   * const sfNews = await client.getNFLNews({
   *   teamAbv: "SF",
   *   recentNews: true,
   *   maxItems: 10
   * });
   * ```
   */
  async getNFLNews(options?: GetNewsOptions): Promise<Tank01Response<NewsArticle>> {
    const params: Record<string, string | boolean | number> = {};

    if (options) {
      if (options.playerID) params.playerID = options.playerID;
      if (options.teamID) params.teamID = options.teamID;
      if (options.teamAbv) params.teamAbv = options.teamAbv;
      if (options.topNews !== undefined) params.topNews = options.topNews;
      if (options.fantasyNews !== undefined) params.fantasyNews = options.fantasyNews;
      if (options.recentNews !== undefined) params.recentNews = options.recentNews;
      if (options.maxItems !== undefined) params.maxItems = options.maxItems;
    }

    const response = await this.httpClient.get<NewsArticle>(
      '/getNFLNews',
      Object.keys(params).length > 0 ? params : undefined
    );
    return response;
  }

  // ========================================
  // Info Methods
  // ========================================

  /**
   * Retrieve current NFL season and week information
   *
   * @param date - Optional date (format: YYYYMMDD). If omitted, returns current date info.
   * @returns Current season/week information
   * @throws {Tank01AuthenticationError} Invalid API key
   * @throws {Tank01ValidationError} Invalid date format
   *
   * @example
   * ```typescript
   * // Get current season info
   * const info = await client.getNFLCurrentInfo();
   * console.log(`Season ${info.season}, Week ${info.week}, Type: ${info.seasonType}`);
   *
   * // Get season info for specific date
   * const historicalInfo = await client.getNFLCurrentInfo("20240908");
   * ```
   */
  async getNFLCurrentInfo(date?: string): Promise<Tank01Response<CurrentInfo>> {
    const params: Record<string, string> = {};

    if (date) {
      params.date = date;
    }

    const response = await this.httpClient.get<CurrentInfo>(
      '/getNFLCurrentInfo',
      Object.keys(params).length > 0 ? params : undefined
    );
    return response;
  }

  /**
   * Get the resolved configuration (for testing/debugging)
   * @internal
   */
  getConfig(): ResolvedClientConfiguration {
    return { ...this.config };
  }
}
