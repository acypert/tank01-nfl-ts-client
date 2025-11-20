````markdown
# Tank01 NFL Client

A TypeScript client package for retrieving NFL statistics from the Tank01 sports data provider.

## Overview

This package provides a clean, type-safe interface for accessing Tank01 NFL API endpoints, enabling easy integration of NFL statistics into your applications. Built with TypeScript and featuring comprehensive type definitions, runtime validation, and extensive test coverage.

API documentation: https://rapidapi.com/tank01/api/tank01-nfl-live-in-game-real-time-statistics-nfl/playground

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

- ✅ Type-safe API client for Tank01 NFL data
- ✅ Runtime validation of API responses with zod
- ✅ Automatic retry with exponential backoff
- ✅ Configurable timeouts and rate limiting
- ✅ Support for both CommonJS and ES modules
- ✅ Comprehensive TypeScript definitions
- ✅ Full test coverage (unit, integration, contract tests)

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

```typescript
import { Tank01Client } from 'tank01-nfl-client';

// Initialize client
const client = new Tank01Client();

// Team data
const teams = await client.teams.getTeams();
console.log(`Total teams: ${teams.length}`); // 32

const niners = await client.teams.getTeam('SF');
console.log(niners.teamName); // "San Francisco 49ers"
console.log(niners.conference); // "NFC"
console.log(niners.division); // "West"

const roster = await client.teams.getTeamRoster('SF', {
  season: '2024',
  getStats: false,
});
console.log(`Roster size: ${roster.length}`);

// Player data
const players = await client.players.getPlayers();
console.log(`Total players: ${players.length}`); // ~2500+

const purdy = await client.players.getPlayer('4381786');
console.log(purdy.longName); // "Brock Purdy"
console.log(purdy.pos); // "QB"
console.log(purdy.team); // "SF"

const purdyStats = await client.players.getPlayerStats('4381786', '2023');
console.log(purdyStats.passingYards); // 4280
console.log(purdyStats.passingTDs); // 31

// Search for players
const sanFranciscoQBs = await client.players.searchPlayers({
  team: 'SF',
  position: 'QB',
});
console.log(sanFranciscoQBs.map((p) => p.longName));

// Find injured players
const injuredPlayers = await client.players.searchPlayers({
  availabilityStatus: 'injured',
});

// Game schedules and results
const week1Games = await client.games.getSchedule('2024', '1');
console.log(`Week 1 games: ${week1Games.length}`);

const ninersSchedule = await client.games.getTeamSchedule('SF', '2024');
console.log(`49ers games: ${ninersSchedule.length}`);

const gameDetails = await client.games.getGame('20240908_SF@PIT');
console.log(`${gameDetails.away} @ ${gameDetails.home}`);
console.log(`Score: ${gameDetails.awayPts} - ${gameDetails.homePts}`);
console.log(`Status: ${gameDetails.gameStatus}`);

// Search for playoff games
const playoffGames = await client.games.searchGames({
  season: '2024',
  playoffsOnly: true,
});

// Live game data
const liveGames = await client.live.getLiveGames();
console.log(`${liveGames.length} games currently in progress`);

if (liveGames.length > 0) {
  const boxScore = await client.live.getLiveBoxScore(liveGames[0].gameID);
  console.log(`Live: ${boxScore.away} ${boxScore.awayPts} @ ${boxScore.home} ${boxScore.homePts}`);
  console.log(`${boxScore.quarter} quarter, ${boxScore.gameClock} remaining`);

  const plays = await client.live.getPlayByPlay(liveGames[0].gameID);
  console.log(`Latest play: ${plays[plays.length - 1]?.description}`);
}

// Advanced statistics
const ninersStats = await client.stats.getTeamAdvancedStats('SF', '2024');
console.log(`49ers Points/Game: ${ninersStats.pointsPerGame}`);
console.log(`Turnover Differential: ${ninersStats.turnoverDifferential}`);

const purdyAdvanced = await client.stats.getPlayerAdvancedStats('4381786', '2024');
console.log(`Brock Purdy QB Rating: ${purdyAdvanced.qbRating}`);

const rankings = await client.stats.getTeamRankings('2024');
const ninersRank = rankings.find((r) => r.team === 'SF');
console.log(`49ers Offensive Rank: ${ninersRank?.offensiveRank}`);
```

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
├── players/              # Player-related API methods
├── teams/                # Team-related API methods
├── games/                # Game-related API methods
├── common/               # Shared utilities
│   ├── http/            # HTTP client wrapper
│   ├── errors/          # Custom error types
│   └── config/          # Configuration
└── index.ts             # Main package entry
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
