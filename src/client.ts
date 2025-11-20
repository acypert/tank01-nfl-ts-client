import type { ClientConfiguration, ResolvedClientConfiguration } from './common/config/types.js';
import { loadConfiguration } from './common/config/loader.js';
import { HttpClient } from './common/http/client.js';
import { TeamsClient } from './teams/client.js';
import { PlayersClient } from './players/client.js';
import { GamesClient } from './games/client.js';
import { LiveClient } from './live/client.js';
import { StatsClient } from './stats/client.js';

/**
 * Main Tank01 NFL API client
 *
 * @example
 * ```typescript
 * // Using environment variable TANK01_API_KEY
 * const client = new Tank01Client();
 *
 * // Explicit API key
 * const client = new Tank01Client({
 *   apiKey: 'your-api-key',
 *   timeout: 30000,
 *   maxRetries: 3,
 * });
 * ```
 */
export class Tank01Client {
  private readonly config: ResolvedClientConfiguration;
  /** @internal */
  protected readonly httpClient: HttpClient;

  /**
   * Teams API client
   *
   * Access NFL team data, rosters, and schedules
   *
   * @example
   * ```typescript
   * const teams = await client.teams.getTeams();
   * const niners = await client.teams.getTeam("SF");
   * const roster = await client.teams.getTeamRoster("SF");
   * ```
   */
  public readonly teams: TeamsClient;

  /**
   * Players API client
   *
   * Access NFL player data, statistics, and search functionality
   *
   * @example
   * ```typescript
   * const players = await client.players.getPlayers();
   * const purdy = await client.players.getPlayer("4381786");
   * const stats = await client.players.getPlayerStats("4381786", "2023");
   * const sanFranciscoQBs = await client.players.searchPlayers({ team: "SF", position: "QB" });
   * ```
   */
  public readonly players: PlayersClient;

  /**
   * Games API client
   *
   * Access NFL game schedules, results, and details
   *
   * @example
   * ```typescript
   * const week1Games = await client.games.getSchedule("2024", "1");
   * const gameDetails = await client.games.getGame("20240908_SF@PIT");
   * const ninersSchedule = await client.games.getTeamSchedule("SF", "2024");
   * const playoffGames = await client.games.searchGames({ season: "2024", playoffsOnly: true });
   * ```
   */
  public readonly games: GamesClient;

  /**
   * Live API client
   *
   * Access real-time NFL game data, box scores, and play-by-play
   *
   * @example
   * ```typescript
   * const liveGames = await client.live.getLiveGames();
   * const boxScore = await client.live.getLiveBoxScore("20240908_SF@PIT");
   * const plays = await client.live.getPlayByPlay("20240908_SF@PIT");
   * const isLive = await client.live.isGameLive("20240908_SF@PIT");
   * ```
   */
  public readonly live: LiveClient;

  /**
   * Stats API client
   *
   * Access advanced NFL statistics, rankings, and projections
   *
   * @example
   * ```typescript
   * const teamStats = await client.stats.getTeamAdvancedStats("SF", "2024");
   * const playerStats = await client.stats.getPlayerAdvancedStats("4381786", "2024");
   * const rankings = await client.stats.getTeamRankings("2024");
   * const projections = await client.stats.getPlayerProjections("4381786", "1");
   * ```
   */
  public readonly stats: StatsClient;

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

    // Initialize feature clients
    this.teams = new TeamsClient(this.httpClient);
    this.players = new PlayersClient(this.httpClient);
    this.games = new GamesClient(this.httpClient);
    this.live = new LiveClient(this.httpClient);
    this.stats = new StatsClient(this.httpClient);
  } /**
   * Get the resolved configuration (for testing/debugging)
   * @internal
   */
  getConfig(): ResolvedClientConfiguration {
    return { ...this.config };
  }
}
