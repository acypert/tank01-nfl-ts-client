# Tank01 NFL Client API Contracts

**Feature**: Tank01 NFL API Client  
**Date**: 2025-11-20  
**Purpose**: Define all public client methods, parameters, and return types

## Client Structure

The Tank01 client exposes methods through feature-specific sub-clients organized by NFL domain concepts:

```typescript
class Tank01Client {
  teams: TeamsClient; // Team-related operations
  players: PlayersClient; // Player-related operations
  games: GamesClient; // Game and schedule operations
  live: LiveClient; // Live game data
  stats: StatsClient; // Advanced statistics
}
```

---

## TeamsClient Contract

**Purpose**: Access NFL team information and rosters

### Methods

#### `getTeams(): Promise<Team[]>`

**Description**: Retrieve all NFL teams

**Parameters**: None

**Returns**: Array of Team objects

**Example**:

```typescript
const teams = await client.teams.getTeams();
// Returns: [{ teamID: "KC", teamName: "Kansas City Chiefs", ... }, ...]
```

**Errors**:

- `Tank01AuthenticationError`: Invalid API key
- `Tank01NetworkError`: Network failure
- `Tank01ValidationError`: Response schema mismatch

---

#### `getTeam(teamID: string): Promise<Team>`

**Description**: Retrieve specific team information

**Parameters**:

- `teamID` (required): Team abbreviation (e.g., "KC", "PHI")

**Returns**: Team object

**Example**:

```typescript
const chiefs = await client.teams.getTeam("KC");
// Returns: { teamID: "KC", teamName: "Kansas City Chiefs", ... }
```

**Errors**:

- `Tank01NotFoundError`: Team not found
- `Tank01AuthenticationError`: Invalid API key
- `Tank01ValidationError`: Invalid teamID format

---

#### `getTeamRoster(teamID: string, options?: { season?: string, getStats?: boolean }): Promise<Player[]>`

**Description**: Retrieve team roster with optional player statistics

**Parameters**:

- `teamID` (required): Team abbreviation
- `options.season` (optional): Season year, defaults to current season
- `options.getStats` (optional): Include player statistics, defaults to false

**Returns**: Array of Player objects

**Example**:

```typescript
const roster = await client.teams.getTeamRoster("KC", {
  season: "2024",
  getStats: true,
});
// Returns: [{ playerID: "...", longName: "Patrick Mahomes", ... }, ...]
```

**Errors**:

- `Tank01NotFoundError`: Team not found
- `Tank01ValidationError`: Invalid season format

---

## PlayersClient Contract

**Purpose**: Access NFL player information and statistics

### Methods

#### `getPlayers(): Promise<Player[]>`

**Description**: Retrieve comprehensive list of NFL players

**Parameters**: None

**Returns**: Array of Player objects

**Example**:

```typescript
const players = await client.players.getPlayers();
// Returns: [{ playerID: "...", longName: "Patrick Mahomes", ... }, ...]
```

---

#### `getPlayer(playerID: string): Promise<Player>`

**Description**: Retrieve specific player information

**Parameters**:

- `playerID` (required): Unique player identifier

**Returns**: Player object with detailed information

**Example**:

```typescript
const player = await client.players.getPlayer("4039329");
// Returns: { playerID: "4039329", longName: "Patrick Mahomes", ... }
```

**Errors**:

- `Tank01NotFoundError`: Player not found

---

#### `getPlayerStats(playerID: string, options?: { season?: string, week?: number }): Promise<PlayerStatistics>`

**Description**: Retrieve player statistics for season or specific game

**Parameters**:

- `playerID` (required): Unique player identifier
- `options.season` (optional): Season year
- `options.week` (optional): Specific week number for game stats

**Returns**: PlayerStatistics object

**Example**:

```typescript
// Season stats
const seasonStats = await client.players.getPlayerStats("4039329", {
  season: "2024",
});

// Specific week stats
const weekStats = await client.players.getPlayerStats("4039329", {
  season: "2024",
  week: 10,
});
```

---

#### `searchPlayers(filters: PlayerSearchFilters): Promise<Player[]>`

**Description**: Search players with filters

**Parameters**:

- `filters.position` (optional): Position filter (e.g., "QB", "RB")
- `filters.team` (optional): Team filter
- `filters.name` (optional): Name search string

**Returns**: Filtered array of Player objects

**Example**:

```typescript
const quarterbacks = await client.players.searchPlayers({
  position: "QB",
  team: "KC",
});
```

---

## GamesClient Contract

**Purpose**: Access game schedules, results, and details

### Methods

#### `getWeeklySchedule(options: WeeklyScheduleOptions): Promise<Schedule>`

**Description**: Retrieve NFL schedule for a specific week

**Parameters**:

- `options.season` (required): Season year (e.g., "2024")
- `options.week` (required): Week number (1-18)
- `options.seasonType` (optional): "reg", "pre", or "post", defaults to "reg"

**Returns**: Schedule object with games array

**Example**:

```typescript
const week10 = await client.games.getWeeklySchedule({
  season: "2024",
  week: 10,
  seasonType: "reg",
});
// Returns: { season: "2024", week: 10, games: [...] }
```

**Errors**:

- `Tank01ValidationError`: Invalid week/season combination

---

#### `getGame(gameID: string): Promise<Game>`

**Description**: Retrieve detailed game information

**Parameters**:

- `gameID` (required): Unique game identifier

**Returns**: Game object with complete details

**Example**:

```typescript
const game = await client.games.getGame("20241110_KC@BUF");
// Returns: { gameID: "...", homeTeam: "BUF", awayTeam: "KC", ... }
```

---

#### `getTeamSchedule(teamID: string, options?: { season?: string }): Promise<Schedule>`

**Description**: Retrieve all games for a specific team

**Parameters**:

- `teamID` (required): Team abbreviation
- `options.season` (optional): Season year

**Returns**: Schedule object with team's games

**Example**:

```typescript
const chiefsSchedule = await client.games.getTeamSchedule("KC", {
  season: "2024",
});
```

---

#### `getBoxScore(gameID: string): Promise<GameScore>`

**Description**: Retrieve detailed game scoring information

**Parameters**:

- `gameID` (required): Unique game identifier

**Returns**: GameScore object with quarter-by-quarter scores

**Example**:

```typescript
const boxScore = await client.games.getBoxScore("20241110_KC@BUF");
// Returns: { gameID: "...", homeScore: 28, awayScore: 24, homeQ1: 7, ... }
```

---

## LiveClient Contract

**Purpose**: Access live, in-game data and real-time statistics

### Methods

#### `getScoreboard(): Promise<LiveGameData[]>`

**Description**: Retrieve current live scores for all active games

**Parameters**: None

**Returns**: Array of LiveGameData objects for games in progress

**Example**:

```typescript
const liveGames = await client.live.getScoreboard();
// Returns: [{ gameID: "...", gameClock: "10:23", currentQuarter: 2, ... }]
```

---

#### `getLiveGame(gameID: string): Promise<LiveGameData>`

**Description**: Retrieve live data for a specific game

**Parameters**:

- `gameID` (required): Unique game identifier

**Returns**: LiveGameData object with real-time game state

**Example**:

```typescript
const liveGame = await client.live.getLiveGame("20241110_KC@BUF");
// Returns: { gameClock: "5:42", currentQuarter: 3, possession: "KC", ... }
```

**Errors**:

- `Tank01NotFoundError`: Game not in progress or not found

---

#### `getLivePlayerStats(gameID: string): Promise<Map<string, PlayerStatistics>>`

**Description**: Retrieve current in-game statistics for all players

**Parameters**:

- `gameID` (required): Unique game identifier

**Returns**: Map of playerID to PlayerStatistics

**Example**:

```typescript
const liveStats = await client.live.getLivePlayerStats("20241110_KC@BUF");
// Returns: Map { "4039329" => { passYards: 245, passTD: 2, ... }, ... }
```

---

## StatsClient Contract

**Purpose**: Access advanced statistics and analytics

### Methods

#### `getAdvancedStats(playerID: string, options?: { season?: string }): Promise<AdvancedStatistics>`

**Description**: Retrieve advanced metrics for a player

**Parameters**:

- `playerID` (required): Unique player identifier
- `options.season` (optional): Season year

**Returns**: AdvancedStatistics object with calculated metrics

**Example**:

```typescript
const advancedStats = await client.stats.getAdvancedStats("4039329", {
  season: "2024",
});
// Returns: { yardsPerAttempt: 7.2, completionPercentage: 68.5, ... }
```

---

#### `getProjections(options: ProjectionOptions): Promise<Map<string, PlayerStatistics>>`

**Description**: Retrieve player projections for upcoming games

**Parameters**:

- `options.week` (required): Week number for projections
- `options.season` (required): Season year
- `options.position` (optional): Filter by position

**Returns**: Map of playerID to projected PlayerStatistics

**Example**:

```typescript
const projections = await client.stats.getProjections({
  week: 11,
  season: "2024",
  position: "QB",
});
```

---

#### `compareStats(playerIDs: string[], options?: { season?: string }): Promise<PlayerStatistics[]>`

**Description**: Compare statistics for multiple players

**Parameters**:

- `playerIDs` (required): Array of player identifiers to compare
- `options.season` (optional): Season year for comparison

**Returns**: Array of PlayerStatistics for comparison

**Example**:

```typescript
const comparison = await client.stats.compareStats(
  ["4039329", "3139477"], // Mahomes vs Allen
  { season: "2024" }
);
```

---

## Configuration and Initialization

### Constructor

```typescript
constructor(config?: ClientConfiguration)
```

**Parameters**:

- `config.apiKey` (optional): API key, defaults to env variable TANK01_API_KEY
- `config.baseUrl` (optional): Custom base URL
- `config.timeout` (optional): Request timeout in ms, default 30000
- `config.maxRetries` (optional): Max retry attempts, default 3
- `config.debug` (optional): Enable debug logging, default false

**Example**:

```typescript
// Using environment variable
const client = new Tank01Client();

// Explicit configuration
const client = new Tank01Client({
  apiKey: "your-api-key-here",
  timeout: 45000,
  maxRetries: 5,
  debug: true,
});
```

**Errors**:

- `Tank01AuthenticationError`: No API key provided or found

---

## Common Types

### WeeklyScheduleOptions

```typescript
interface WeeklyScheduleOptions {
  season: string; // e.g., "2024"
  week: number; // 1-18 for regular season
  seasonType?: "reg" | "pre" | "post";
}
```

### PlayerSearchFilters

```typescript
interface PlayerSearchFilters {
  position?: string; // e.g., "QB", "RB", "WR"
  team?: string; // Team abbreviation
  name?: string; // Name search string
}
```

### ProjectionOptions

```typescript
interface ProjectionOptions {
  week: number;
  season: string;
  position?: string;
}
```

---

## Error Handling

All methods may throw the following errors:

- **Tank01AuthenticationError**: API key invalid or missing
- **Tank01NotFoundError**: Requested resource not found (404)
- **Tank01RateLimitError**: Rate limit exceeded (429)
- **Tank01ValidationError**: Input validation or response schema mismatch
- **Tank01NetworkError**: Network timeout or connection failure
- **Tank01ApiError**: Other API errors (500, 502, 503)

All errors include:

- `message`: Human-readable error description
- `statusCode`: HTTP status code (if applicable)
- `cause`: Original error (if applicable)
- `context`: Additional error context

---

## HTTP Headers

All requests include:

- `X-RapidAPI-Key`: Authentication key
- `X-RapidAPI-Host`: Tank01 API host
- `Content-Type`: `application/json`
- `User-Agent`: `tank01-nfl-client/{version}`

---

## Rate Limiting

The client automatically handles rate limiting:

- Detects 429 responses
- Respects `Retry-After` header if present
- Implements exponential backoff with jitter
- Throws `Tank01RateLimitError` after max retries exceeded

---

## Response Caching

**Note**: This client does NOT implement response caching. Consumers should implement their own caching strategy if needed for their use case.

---

## TypeScript Support

All methods are fully typed with:

- Explicit parameter types
- Return type promises with inferred types
- No use of `any` types
- Comprehensive JSDoc comments with examples
- Exported type definitions for all entities
