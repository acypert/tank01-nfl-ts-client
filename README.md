````markdown
# Tank01 NFL Client

A TypeScript client package for retrieving NFL statistics from the Tank01 sports data provider.

## Overview

This package provides a clean, type-safe interface for accessing Tank01 NFL API endpoints, enabling easy integration of NFL statistics into your applications. Built with TypeScript and featuring comprehensive type definitions, runtime validation, and extensive test coverage.

**Version 0.2.0** introduces a **flat interface architecture** with direct method access, OR parameter validation, and 6 new endpoints for fantasy, odds, news, and more.

API documentation: https://rapidapi.com/tank01/api/tank01-nfl-live-in-game-real-time-statistics-nfl/playground

## What's New in v0.2.0 🎉

- ✨ **Flat Interface**: All methods directly on client (no more `client.teams.*`)
- 🔒 **OR Validation**: Type-safe either/or parameter constraints
- 📊 **Fantasy Endpoints**: ADP, projections, DFS data
- 💰 **Betting Odds**: Multi-sportsbook lines with player props
- 📰 **News Feed**: NFL news with filters
- ℹ️ **Season Info**: Current week/season metadata
- 🗑️ **Cleaner API**: Removed 7 fake endpoints
- 📦 **Optimized**: 17.5% smaller package size

**Migrating from v0.1.x?** See [MIGRATION.md](./MIGRATION.md) for a complete guide.

## Project Principles

This project follows a strict [Constitution](.specify/memory/constitution.md) that governs:

- **Type Safety First**: Fully typed with TypeScript strict mode, no `any` types
- **Feature Folder Organization**: Code organized by NFL domain resources (players, teams, games)
- **Comprehensive Testing**: Unit, integration, and contract tests for all functionality
- **API Contract Compliance**: Runtime validation using zod to catch API changes
- **Developer Experience**: Clear documentation, helpful errors, intuitive API design

### Naming Conventions

This project uses consistent naming across different contexts:

- **Product Name**: Tank01 (capitalized)
- **Package Name**: `tank01-nfl-client` (lowercase with hyphens)
- **Environment Variables**: `TANK01_API_KEY` (uppercase with underscores)
- **Class Names**: `Tank01Client`, `Tank01Error` (PascalCase with Tank01 prefix)

## Requirements

- Node.js 18+ (LTS)
- TypeScript 5.x

## Features

- ✅ **Flat Interface**: Direct method access on client instance
- ✅ **Type-safe OR Validation**: Enforces either/or parameter constraints
- ✅ **21 NFL Endpoints**: Teams, players, games, fantasy, odds, news, more
- ✅ **Runtime Validation**: zod schemas validate all API responses
- ✅ **Automatic Retry**: Exponential backoff for failed requests
- ✅ **Configurable**: Timeouts, retries, debug mode
- ✅ **Dual Module Support**: CommonJS and ES modules
- ✅ **Full TypeScript**: Comprehensive type definitions
- ✅ **Tested**: Unit, integration, and contract tests

## Installation

```bash
npm install tank01-nfl-client
```

## Configuration

Set up your Tank01 API credentials:

```bash
export TANK01_API_KEY=your_api_key_here
```

Or provide via constructor:

```typescript
import { Tank01Client } from 'tank01-nfl-client';

const client = new Tank01Client({
  apiKey: 'your_api_key_here',
  timeout: 30000, // optional, defaults to 30s
  retries: 3, // optional, defaults to 3
});
```

## Usage

### Quick Start

```typescript
import { Tank01Client } from 'tank01-nfl-client';

// Initialize client
const client = new Tank01Client();

// Get all teams
const teams = await client.getNFLTeams();
console.log(`Total teams: ${teams.length}`); // 32

// Get specific team
const niners = await client.getNFLTeam('SF');
console.log(niners.teamName); // "San Francisco 49ers"

// Get team roster
const roster = await client.getNFLTeamRoster({
  teamID: 'SF',
  getStats: true,
});
console.log(`Roster size: ${roster.length}`);

// Get player info
const purdy = await client.getNFLPlayerInfo({ playerID: '4381786' });
console.log(purdy.longName); // "Brock Purdy"

// Get games for a week
const games = await client.getNFLGamesForWeek({
  week: '1',
  season: '2024',
});
console.log(`Week 1 games: ${games.length}`);
```

### Teams

```typescript
// Get all teams with additional data
const teams = await client.getNFLTeams({
  rosters: true,
  teamStats: true,
  teamStatsSeason: '2024',
  topPerformers: true,
});

// Get team by ID
const niners = await client.getNFLTeam('SF');

// Get team roster (OR validation: teamID OR teamAbv required)
const roster = await client.getNFLTeamRoster({
  teamID: 'SF',
  getStats: true,
  fantasyPoints: true,
});

// Historical roster
const archiveRoster = await client.getNFLTeamRoster({
  teamAbv: 'KC',
  archiveDate: '20240901',
});

// Get depth charts
const depthCharts = await client.getNFLDepthCharts();
const sfDepth = depthCharts.find((dc) => dc.teamAbv === 'SF');
```

### Players

```typescript
// Get all players
const players = await client.getNFLPlayerList();

// Get player by ID (OR validation: playerID OR playerName required)
const purdy = await client.getNFLPlayerInfo({
  playerID: '4381786',
  getStats: true,
});

// Get player by name
const mahomes = await client.getNFLPlayerInfo({
  playerName: 'Patrick Mahomes',
  getStats: true,
});

// Search players
const sfQBs = await client.searchNFLPlayers({
  team: 'SF',
  position: 'QB',
});

// Find injured players
const injured = await client.searchNFLPlayers({
  availabilityStatus: 'injured',
});

// Get player game logs
const gameLogs = await client.getNFLGamesForPlayer({
  playerID: '4381786',
  numberOfGames: 5,
  fantasyPoints: true,
});
```

### Games

```typescript
// Get games for a week
const games = await client.getNFLGamesForWeek({
  week: '1',
  season: '2024',
  seasonType: 'reg', // 'reg', 'post', 'pre', 'all'
});

// Playoff games
const playoffs = await client.getNFLGamesForWeek({
  week: '1',
  seasonType: 'post',
});

// Get games by date
const dateGames = await client.getNFLGamesForDate({
  gameDate: '20240908',
});

// Get game details
const game = await client.getNFLGameInfo('20240908_SF@PIT');

// Get team schedule
const schedule = await client.getNFLTeamSchedule('SF', '2024');

// Search games
const playoffGames = await client.searchNFLGames({
  season: '2024',
  playoffsOnly: true,
});

// Quick scores only
const scores = await client.getNFLScoresOnly({
  week: '1',
  season: '2024',
});
```

### Live Games

```typescript
// Get live box score
const boxScore = await client.getNFLBoxScore({
  gameID: '20240908_SF@PIT',
  playByPlay: true,
  fantasyPoints: true,
});

// Check if game is live
const isLive = await client.isNFLGameLive('20240908_SF@PIT');
```

### Fantasy Football

```typescript
// Average Draft Position
const adp = await client.getNFLADP('halfPPR');
// Formats: 'halfPPR', 'PPR', 'standard', 'bestBall', 'IDP', 'superFlex'

// ADP for specific position
const rbAdp = await client.getNFLADP('PPR', { pos: 'RB' });

// Historical ADP
const historicalAdp = await client.getNFLADP('standard', {
  adpDate: '20240901',
});

// Weekly projections
const projections = await client.getNFLProjections({ week: '1' });

// Player-specific projections
const purdyProj = await client.getNFLProjections({
  playerID: '4381786',
});

// Team projections
const sfProj = await client.getNFLProjections({
  teamID: 'SF',
  week: '5',
});

// Daily Fantasy Sports (DFS)
const dfs = await client.getNFLDFS('20240908');

// DFS with team defense
const dfsWithDefense = await client.getNFLDFS('20240908', {
  includeTeamDefense: true,
});
```

### Betting Odds

```typescript
// Get odds for a date (OR validation: gameDate OR gameID required)
const odds = await client.getNFLBettingOdds({
  gameDate: '20240908',
});

// Get odds for specific game with player props
const gameOdds = await client.getNFLBettingOdds({
  gameID: '20240908_SF@PIT',
  playerProps: true,
});

// Player-specific props
const purdyProps = await client.getNFLBettingOdds({
  gameDate: '20240908',
  playerProps: true,
  playerID: '4381786',
});
```

### NFL News

```typescript
// Get all news
const news = await client.getNFLNews();

// Team-specific news
const sfNews = await client.getNFLNews({
  teamAbv: 'SF',
  recentNews: true,
  maxItems: 10,
});

// Fantasy news for a player
const purdyNews = await client.getNFLNews({
  playerID: '4381786',
  fantasyNews: true,
});

// Top/breaking news
const topNews = await client.getNFLNews({
  topNews: true,
  maxItems: 5,
});
```

### Season Information

```typescript
// Get current week/season
const info = await client.getNFLCurrentInfo();
console.log(`Season ${info.season}, Week ${info.week}`);
console.log(`Type: ${info.seasonType}`); // 'pre', 'reg', 'post'

// Historical date
const historical = await client.getNFLCurrentInfo('20240908');
```

## API Reference

### All Available Methods

#### Teams (4 methods)

- `getNFLTeams(options?)` - All teams with optional data
- `getNFLTeam(teamID)` - Specific team by ID
- `getNFLTeamRoster(options)` - Team roster (requires teamID OR teamAbv)
- `getNFLDepthCharts()` - Depth charts for all teams

#### Players (4 methods)

- `getNFLPlayerList()` - All players
- `getNFLPlayerInfo(options)` - Player info (requires playerID OR playerName)
- `searchNFLPlayers(filters?)` - Search with filters
- `getNFLGamesForPlayer(options)` - Player game logs

#### Games (6 methods)

- `getNFLGamesForWeek(options)` - Games by week
- `getNFLGamesForDate(options)` - Games by date
- `getNFLGameInfo(gameID)` - Game details
- `getNFLTeamSchedule(teamID, season?)` - Team schedule
- `searchNFLGames(filters?)` - Search games
- `getNFLScoresOnly(options?)` - Quick scores

#### Live (2 methods)

- `getNFLBoxScore(options)` - Live box score
- `isNFLGameLive(gameID)` - Check if game is live

#### Fantasy (3 methods)

- `getNFLADP(adpType, options?)` - Average Draft Position
- `getNFLProjections(options?)` - Fantasy projections
- `getNFLDFS(date, options?)` - Daily fantasy data

#### Odds (1 method)

- `getNFLBettingOdds(options)` - Betting lines (requires gameDate OR gameID)

#### News (1 method)

- `getNFLNews(options?)` - NFL news feed

#### Info (1 method)

- `getNFLCurrentInfo(date?)` - Current season/week info

**Total: 21 methods**

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build (generates CJS and ESM)
npm run build

# Lint
npm run lint

# Format
npm run format
```

## Project Structure

```
src/
├── teams/                # Team-related methods and types
├── players/              # Player-related methods and types
├── games/                # Game-related methods and types
├── live/                 # Live game methods and types
├── fantasy/              # Fantasy football methods and types (NEW)
├── odds/                 # Betting odds methods and types (NEW)
├── news/                 # NFL news methods and types (NEW)
├── info/                 # Season info methods and types (NEW)
├── common/               # Shared utilities
│   ├── http/            # HTTP client wrapper
│   ├── errors/          # Custom error types
│   ├── config/          # Configuration
│   └── validation/      # OR parameter validation (NEW)
├── client.ts            # Main Tank01Client class (flat interface)
└── index.ts             # Package entry point
```

## Testing

This project maintains high test coverage with multiple test types:

- **Unit Tests**: Test individual functions in isolation
- **Integration Tests**: Test API client with mocked responses
- **Contract Tests**: Validate actual API responses match types

```bash
npm test                  # Run all tests
npm run test:unit         # Unit tests only
npm run test:integration  # Integration tests only
npm run test:contract     # Contract tests only
```

## Contributing

1. Check the [Constitution](.specify/memory/constitution.md) for project principles
2. Features should follow the spec → plan → tasks workflow (see `.github/agents/`)
3. All code must pass TypeScript strict checks and have tests
4. Use conventional commits: `feat(players): add getPlayerStats method`

## License

ISC
````
