````markdown
# Tank01 NFL Client

A production-ready TypeScript client for the Tank01 NFL API, providing comprehensive access to NFL statistics, fantasy data, betting odds, and live game information.

## Overview

This package provides a clean, type-safe interface for accessing all Tank01 NFL API endpoints. Built with TypeScript strict mode, featuring comprehensive type definitions, optional Zod schemas for validation, and a flat interface design for maximum developer experience.

**Version 1.0.3** is production-ready with 21+ endpoints, full TypeScript support, and comprehensive documentation.

🔗 [Tank01 NFL API Documentation](https://rapidapi.com/tank01/api/tank01-nfl-live-in-game-real-time-statistics-nfl/playground)

## Recent Updates

### Version 1.0.3
- 🚚 Responses now return the HTTP status and raw payload via `Tank01Response<T> { statusCode, body, error? }`
- 🔄 Removed automatic response validation; Zod schemas remain available for optional consumer validation
- 🧰 Updated examples to unwrap `body`

### Version 1.0.2
- 🔧 Fixed published type declarations path (`types` now resolves to `dist/index.d.ts`)
- 📦 Added package `files` whitelist for cleaner publish

### Version 1.0.1
- 📃 Updated README with latest changes

### Version 1.0.0 (Production Release) 🎉
- ✅ **Production Ready**: Stable API with comprehensive testing
- 🔒 **Type Safety**: Full TypeScript strict mode compliance
- ✨ **21+ Endpoints**: Complete coverage of Tank01 NFL API
- 📊 **Validated Types**: Zod schemas available for consumer-side validation of responses
- 🎯 **Flat Interface**: Direct method access for simplicity
- 🛡️ **OR Parameter Validation**: Type-safe either/or constraints
- 📚 **Complete Docs**: JSDoc for every method with examples

### Version 0.2.0
- Flat interface architecture (breaking change from v0.1.x)
- Added 6 new endpoints: fantasy, odds, news, season info
- OR parameter validation with descriptive errors
- Removed 7 non-existent endpoints

**Migrating from v0.1.x?** See [MIGRATION.md](./MIGRATION.md) for the upgrade guide.

## Project Principles

This project follows strict development principles:

- **Type Safety First**: TypeScript strict mode, no `any` types, Zod schemas available for validation
- **Feature Organization**: Code organized by NFL domain (players, teams, games, fantasy, odds, news, info)
- **Comprehensive Testing**: Unit and integration tests for all functionality
- **API Compliance**: Zod schemas help detect API shape changes quickly when you opt in to validation
- **Developer Experience**: Intuitive flat interface, clear errors, complete JSDoc documentation

### Naming Conventions

Consistent naming across all contexts:

- **Product Name**: Tank01 (capitalized)
- **Package Name**: `tank01-nfl-client` (lowercase with hyphens)
- **Environment Variables**: `TANK01_API_KEY` (uppercase with underscores)
- **Class Names**: `Tank01Client`, `Tank01Error` (PascalCase with Tank01 prefix)

## Requirements

- Node.js 18+ (LTS)
- TypeScript 5.x

## Features

- ✅ **Flat Interface**: Direct method access - `client.getNFLTeams()`
- ✅ **Type-Safe OR Validation**: Enforces either/or parameter constraints with clear errors
- ✅ **21 NFL Endpoints**: Complete Tank01 API coverage - teams, players, games, fantasy, odds, news
- ✅ **Optional Validation**: Zod schemas provided for consumers to validate responses as needed
- ✅ **Automatic Retry**: Exponential backoff with configurable retry logic
- ✅ **Flexible Configuration**: Timeouts, retries, debug mode
- ✅ **Dual Module Support**: CommonJS and ES modules (CJS + ESM)
- ✅ **Full TypeScript**: Comprehensive types with strict mode compliance
- ✅ **Production Tested**: Unit and integration test coverage

## Installation

```bash
npm install tank01-nfl-client
```

## Configuration

Set up your Tank01 API credentials via environment variable:

```bash
export TANK01_API_KEY=your_api_key_here
```

Or provide directly in the constructor:

```typescript
import { Tank01Client } from 'tank01-nfl-client';

const client = new Tank01Client({
  apiKey: 'your_api_key_here',
  timeout: 30000,  // optional, default: 30s
  maxRetries: 3,   // optional, default: 3
  debug: false,    // optional, default: false
});
```

**Getting an API Key**: Sign up at [RapidAPI](https://rapidapi.com/tank01/api/tank01-nfl-live-in-game-real-time-statistics-nfl) to get your Tank01 API key.

## Usage

### Response shape

All methods return `Promise<Tank01Response<T>>` with `{ statusCode, body, error? }`. The examples below unwrap `body` for convenience; access `statusCode` to inspect HTTP results or `error` if provided by the API.

### Quick Start

```typescript
import { Tank01Client } from 'tank01-nfl-client';

// Initialize client
const client = new Tank01Client();

// Get all teams
const { body: teams } = await client.getNFLTeams();
console.log(`Total teams: ${teams.length}`); // 32

// Get specific team
const { body: niners } = await client.getNFLTeam('SF');
console.log(niners.teamName); // "San Francisco 49ers"

// Get team roster
const { body: roster } = await client.getNFLTeamRoster({
  teamID: 'SF',
  getStats: true,
});
console.log(`Roster size: ${roster.length}`);

// Get player info
const { body: purdy } = await client.getNFLPlayerInfo({ playerID: '4381786' });
console.log(purdy.longName); // "Brock Purdy"

// Get games for a week
const { body: games } = await client.getNFLGamesForWeek({
  week: '1',
  season: '2024',
});
console.log(`Week 1 games: ${games.length}`);
```

### Teams

```typescript
// Get all teams with optional data
const { body: teams } = await client.getNFLTeams({
  rosters: true,
  teamStats: true,
  teamStatsSeason: '2024',
  topPerformers: true,
});
console.log(`Total teams: ${teams.length}`); // 32

// Get specific team
const { body: niners } = await client.getNFLTeam('SF');
console.log(niners.teamName); // "San Francisco 49ers"
console.log(niners.wins, niners.loss); // Season record

// Get team roster with stats
const { body: roster } = await client.getNFLTeamRoster({
  teamID: 'SF',
  getStats: true,
  fantasyPoints: true,
});
roster.forEach(player => {
  console.log(`${player.longName} - ${player.pos}`);
  if (player.stats?.Passing) {
    console.log(`  ${player.stats.Passing.passYds} yards`);
  }
});

// Historical roster
const { body: archiveRoster } = await client.getNFLTeamRoster({
  teamAbv: 'KC',
  archiveDate: '20240901',
});

// Get depth charts for all teams
const { body: depthCharts } = await client.getNFLDepthCharts();
const sfDepth = depthCharts.find(dc => dc.teamAbv === 'SF');
console.log('QB depth:', sfDepth?.depthChart?.QB);
```

### Players

```typescript
// Get all players (4,500+ records)
const { body: players } = await client.getNFLPlayerList();
console.log(`Total players: ${players.length}`);

// Get player by ID with stats (OR validation: playerID OR playerName required)
const { body: purdy } = await client.getNFLPlayerInfo({
  playerID: '4381786',
  getStats: true,
});
console.log(purdy.longName); // "Brock Purdy"
console.log(purdy.team, purdy.pos); // Team and position

// Get player by name
const { body: mahomes } = await client.getNFLPlayerInfo({
  playerName: 'Patrick Mahomes',
  getStats: true,
});

// Search players with filters
const { body: sfQBs } = await client.searchNFLPlayers({
  team: 'SF',
  position: 'QB',
});

// Find rookies
const { body: rookies } = await client.searchNFLPlayers({
  isRookie: true,
});

// Find injured players
const { body: injured } = await client.searchNFLPlayers({
  availabilityStatus: 'injured',
});

// Get player game logs with fantasy points
const { body: gameLogs } = await client.getNFLGamesForPlayer({
  playerID: '4381786',
  numberOfGames: 5,
  fantasyPoints: true,
});
Object.values(gameLogs).forEach(game => {
  console.log(`Week ${game.gameWeek}: ${game.stats?.passingYards} yards`);
});
```

### Games

```typescript
// Get games for a specific week
const { body: games } = await client.getNFLGamesForWeek({
  week: '1',
  season: '2024',
  seasonType: 'reg', // 'reg', 'post', 'pre', 'all'
});
console.log(`Week 1 games: ${games.length}`);
games.forEach(game => {
  console.log(`${game.away} @ ${game.home}: ${game.awayPts}-${game.homePts}`);
});

// Playoff games
const { body: playoffs } = await client.getNFLGamesForWeek({
  week: '1',
  seasonType: 'post',
});

// Get games by date
const { body: dateGames } = await client.getNFLGamesForDate({
  gameDate: '20240908',
});

// Get detailed game info
const { body: game } = await client.getNFLGameInfo('20240908_SF@PIT');
console.log(game.scoringPlays); // All scoring plays
console.log(game.teamStats); // Team statistics

// Get team schedule
const { body: schedule } = await client.getNFLTeamSchedule('SF', '2024');
console.log(`Season games: ${schedule.length}`);

// Search games with filters
const { body: playoffGames } = await client.searchNFLGames({
  season: '2024',
  playoffsOnly: true,
});

// Quick scores only (lightweight)
const { body: scores } = await client.getNFLScoresOnly({
  week: '1',
  season: '2024',
});
```

### Live Games

```typescript
// Get live box score with play-by-play
const { body: boxScore } = await client.getNFLBoxScore({
  gameID: '20240908_SF@PIT',
  playByPlay: true,
  fantasyPoints: true,
});
console.log('Current quarter:', boxScore.gameStatus);
console.log('Score:', `${boxScore.away}-${boxScore.home}`);
console.log('Player stats:', boxScore.playerStats);

// Check if game is currently live
const isLive = await client.isNFLGameLive('20240908_SF@PIT');
if (isLive) {
  console.log('Game is in progress - fetch live data!');
}
```

### Fantasy Football

```typescript
// Average Draft Position (6 formats available)
const { body: adp } = await client.getNFLADP('halfPPR');
// Available formats: 'halfPPR', 'PPR', 'standard', 'bestBall', 'IDP', 'superFlex'
console.log('Top 10 ADP:', adp.slice(0, 10));

// ADP for specific position
const { body: rbAdp } = await client.getNFLADP('PPR', { pos: 'RB' });
console.log('Top RBs:', rbAdp.filter(p => p.pos === 'RB').slice(0, 10));

// Historical ADP from specific date
const { body: historicalAdp } = await client.getNFLADP('standard', {
  adpDate: '20240901',
});

// Weekly fantasy projections
const { body: projections } = await client.getNFLProjections({ week: '1' });
console.log('Week 1 projections count:', Object.keys(projections).length);

// Player-specific projections
const { body: purdyProj } = await client.getNFLProjections({
  playerID: '4381786',
});

// Team projections
const { body: sfProj } = await client.getNFLProjections({
  teamID: 'SF',
  week: '5',
});

// Daily Fantasy Sports salaries and data
const { body: dfs } = await client.getNFLDFS('20240908');
console.log('DFS players available:', Object.keys(dfs).length);

// DFS with team defense included
const { body: dfsWithDefense } = await client.getNFLDFS('20240908', {
  includeTeamDefense: true,
});
```

### Betting Odds

```typescript
// Get odds for all games on a date (OR validation: gameDate OR gameID required)
const { body: odds } = await client.getNFLBettingOdds({
  gameDate: '20240908',
});
console.log('Games with odds:', Object.keys(odds).length);

// Get odds for specific game with player props
const { body: gameOdds } = await client.getNFLBettingOdds({
  gameID: '20240908_SF@PIT',
  playerProps: true,
});
console.log('Spread:', gameOdds['20240908_SF@PIT']?.odds?.spread);
console.log('Over/Under:', gameOdds['20240908_SF@PIT']?.odds?.total);

// Player-specific prop bets
const { body: purdyProps } = await client.getNFLBettingOdds({
  gameDate: '20240908',
  playerProps: true,
  playerID: '4381786',
});
// View passing yards, TDs, completions props from multiple sportsbooks
```

### NFL News

```typescript
// Get all recent NFL news
const { body: news } = await client.getNFLNews();
console.log('Latest articles:', news.length);

// Team-specific news
const { body: sfNews } = await client.getNFLNews({
  teamAbv: 'SF',
  recentNews: true,
  maxItems: 10,
});
sfNews.forEach(article => {
  console.log(article.title);
  console.log(article.link);
});

// Fantasy-relevant news for a player
const { body: purdyNews } = await client.getNFLNews({
  playerID: '4381786',
  fantasyNews: true,
});

// Top/breaking news only
const { body: topNews } = await client.getNFLNews({
  topNews: true,
  maxItems: 5,
});
```

### Season Information

```typescript
// Get current NFL season, week, and type
const info = await client.getNFLCurrentInfo();
console.log(`Season ${info.season}, Week ${info.week}`);
console.log(`Season type: ${info.seasonType}`); // 'pre', 'reg', 'post'
console.log(`Current date: ${info.currentDate}`);

// Get season info for a historical date
const historical = await client.getNFLCurrentInfo('20240908');
console.log(`Week ${historical.week} of ${historical.season}`);
```

## API Reference

### Complete Method List (21 Methods)

#### Teams (4 methods)

- `getNFLTeams(options?)` - Get all NFL teams with optional roster/stats/performers
- `getNFLTeam(teamID)` - Get specific team by ID
- `getNFLTeamRoster(options)` - Get team roster (requires teamID OR teamAbv)
- `getNFLDepthCharts()` - Get depth charts for all teams

#### Players (4 methods)

- `getNFLPlayerList()` - Get all NFL players (4,500+ records)
- `getNFLPlayerInfo(options)` - Get player info (requires playerID OR playerName)
- `searchNFLPlayers(filters?)` - Search players with filters
- `getNFLGamesForPlayer(options)` - Get player game logs

#### Games (6 methods)

- `getNFLGamesForWeek(options)` - Get games by week
- `getNFLGamesForDate(options)` - Get games by date
- `getNFLGameInfo(gameID)` - Get detailed game information
- `getNFLTeamSchedule(teamID, season?)` - Get team schedule
- `searchNFLGames(filters?)` - Search games with filters
- `getNFLScoresOnly(options?)` - Get scores only (lightweight)

#### Live (2 methods)

- `getNFLBoxScore(options)` - Get live box score with play-by-play
- `isNFLGameLive(gameID)` - Check if game is currently live

#### Fantasy (3 methods)

- `getNFLADP(adpType, options?)` - Get Average Draft Position data
- `getNFLProjections(options?)` - Get fantasy projections
- `getNFLDFS(date, options?)` - Get Daily Fantasy Sports data

#### Odds (1 method)

- `getNFLBettingOdds(options)` - Get betting lines (requires gameDate OR gameID)

#### News (1 method)

- `getNFLNews(options?)` - Get NFL news feed

#### Info (1 method)

- `getNFLCurrentInfo(date?)` - Get current season/week info

### Parameter Validation

**OR Parameters**: Some methods require exactly one of multiple parameters:
- `getNFLTeamRoster`: requires `teamID` **OR** `teamAbv` (not both)
- `getNFLPlayerInfo`: requires `playerID` **OR** `playerName` (not both)
- `getNFLBettingOdds`: requires `gameDate` **OR** `gameID` (not both)

The client validates these requirements and throws descriptive `TypeError` if constraints are violated.

## Error Handling

The client provides specific error types for different failure scenarios:

```typescript
import { 
  Tank01Error,
  Tank01AuthenticationError,
  Tank01NetworkError,
  Tank01NotFoundError,
  Tank01RateLimitError,
  Tank01ValidationError
} from 'tank01-nfl-client';

try {
  const teams = await client.getNFLTeams();
} catch (error) {
  if (error instanceof Tank01AuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof Tank01RateLimitError) {
    console.error('Rate limit exceeded, retry after:', error.retryAfter);
  } else if (error instanceof Tank01NotFoundError) {
    console.error('Resource not found');
  } else if (error instanceof Tank01NetworkError) {
    console.error('Network error:', error.message);
  } else if (error instanceof Tank01ValidationError) {
    console.error('Invalid parameters or response schema mismatch');
  }
}
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/acypert/tank01-nfl-ts-client.git
cd tank01-nfl-ts-client

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your TANK01_API_KEY to .env
```

### Development Commands

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build the package (generates CJS and ESM)
npm run build

# Development build with watch mode
npm run dev

# Type checking
npm run typecheck

# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check
```

### Testing Strategy

This project uses Vitest for testing with multiple test types:

- **Unit Tests**: Test individual functions in isolation
- **Integration Tests**: Test API client with mocked HTTP responses
- **Type Tests**: Validate TypeScript type correctness

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode for development
npm run test:coverage     # Generate coverage report
```

## Project Structure

```
src/
├── client.ts            # Main Tank01Client class (flat interface)
├── index.ts             # Package entry point with exports
├── teams/               # Team-related methods, types, and schemas
│   ├── index.ts
│   ├── types.ts
│   └── schemas.ts
├── players/             # Player-related methods, types, and schemas
│   ├── index.ts
│   ├── types.ts
│   └── schemas.ts
├── games/               # Game-related methods, types, and schemas
│   ├── index.ts
│   ├── types.ts
│   └── schemas.ts
├── live/                # Live game methods, types, and schemas
│   ├── index.ts
│   ├── types.ts
│   └── schemas.ts
├── fantasy/             # Fantasy football methods, types, and schemas
│   ├── index.ts
│   ├── types.ts
│   └── schemas.ts
├── odds/                # Betting odds methods, types, and schemas
│   ├── index.ts
│   ├── types.ts
│   └── schemas.ts
├── news/                # NFL news methods, types, and schemas
│   ├── index.ts
│   ├── types.ts
│   └── schemas.ts
├── info/                # Season info methods, types, and schemas
│   ├── index.ts
│   ├── types.ts
│   └── schemas.ts
└── common/              # Shared utilities
    ├── http/            # HTTP client with retry logic
    │   ├── client.ts
    │   ├── retry.ts
    │   └── validator.ts
    ├── errors/          # Custom error types
    │   ├── api.ts
    │   ├── authentication.ts
    │   ├── network.ts
    │   ├── not-found.ts
    │   ├── rate-limit.ts
    │   ├── validation.ts
    │   └── index.ts
    ├── config/          # Configuration management
    │   ├── loader.ts
    │   ├── schema.ts
    │   └── types.ts
    ├── validation/      # OR parameter validation
    │   ├── parameters.ts
    │   └── __tests__/
    └── utils/           # Utility functions
        ├── logger.ts
        └── jsdoc.ts
```

### Architecture Principles

- **Feature Folders**: Code organized by NFL domain (teams, players, games, etc.)
- **Flat Interface**: All methods directly on client for simple API
- **Type Safety**: Zod schemas validate all responses at runtime
- **Separation of Concerns**: Types, schemas, and logic are separated
- **Testability**: Each module can be tested independently

## Package Distribution

Dual-format (CommonJS + ES Modules) with consolidated type declarations:

- **CommonJS**: `dist/cjs/index.js`
- **ES Modules**: `dist/esm/index.js`
- **Type Definitions**: `dist/index.d.ts`

Current `package.json` excerpt:
```jsonc
{
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js"
    }
  }
}
```

### Using in Next.js / React

No special configuration required. For best results:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext", // or 'node16' / 'bundler'
    "module": "NodeNext",           // optional; works with default too
    "strict": true
  }
}
```

After upgrading to v1.0.2, if your editor still shows `any` types:

```bash
rm -rf node_modules package-lock.json
npm install
```

Then reload your IDE TypeScript server (e.g. VS Code: Command Palette → TypeScript: Restart TS Server).

### Error Handling Pattern (Next.js API Route Example)

```typescript
// app/api/game/[gameID]/route.ts (Next.js App Router)
import { NextResponse } from 'next/server';
import { Tank01Client, Tank01Error, Tank01NotFoundError } from 'tank01-nfl-client';

const client = new Tank01Client({ apiKey: process.env.TANK01_API_KEY });

export async function GET(_: Request, { params }: { params: { gameID: string } }) {
  try {
    const game = await client.getNFLGameInfo(params.gameID);
    return NextResponse.json(game);
  } catch (e) {
    if (e instanceof Tank01NotFoundError) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }
    if (e instanceof Tank01Error) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode ?? 500 });
    }
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Code Quality**: 
   - Pass all TypeScript strict checks
   - Include tests for new functionality
   - Follow existing code organization patterns
   
2. **Commits**: Use conventional commits format:
   ```
   feat(players): add getPlayerStats method
   fix(teams): correct roster parameter validation
   docs(readme): update usage examples
   ```

3. **Pull Requests**:
   - Include description of changes
   - Link related issues
   - Ensure all tests pass
   - Update documentation as needed

4. **Development Workflow**:
   ```bash
   # Create a feature branch
   git checkout -b feat/my-feature
   
   # Make changes and test
   npm test
   npm run typecheck
   npm run lint
   
   # Commit and push
   git commit -m "feat(module): description"
   git push origin feat/my-feature
   ```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a detailed history of changes.

## Migration Guides

- **v0.1.x → v0.2.0**: See [MIGRATION.md](./MIGRATION.md) for breaking changes and upgrade guide
- **v0.2.x → v1.0.0**: Production release with stable API, no breaking changes

## Repository

- **GitHub**: [acypert/tank01-nfl-ts-client](https://github.com/acypert/tank01-nfl-ts-client)
- **npm**: [tank01-nfl-client](https://www.npmjs.com/package/tank01-nfl-client)
- **Issues**: [Report bugs or request features](https://github.com/acypert/tank01-nfl-ts-client/issues)

## Author

**Antonio Cypert**  
Email: acypert@derivital.com  
Organization: Sports Genius Group

## License

ISC License - See [LICENSE](./LICENSE) file for details.

---

**Built with TypeScript • Validated with Zod • Tested with Vitest**
````
