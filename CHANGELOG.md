# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2024-11-21
## [1.0.2] - 2025-11-24

### Fixed

- Corrected published TypeScript declaration path (`types` field and `exports.types` now point to `dist/index.d.ts` instead of non-existent `dist/esm/index.d.ts`). This resolves IDE and build errors where consumers (e.g. Next.js projects) saw methods like `getNFLGameInfo` and `getNFLGamesForWeek` returning `any` and custom error classes narrowing to `unknown`.
- Added `files` whitelist to `package.json` to ensure consistent publish contents (dist output and key docs only).

### Note

No code logic changes; runtime behavior is unchanged. Safe upgrade—just reinstall to pick up proper type metadata.


### 🎉 Major Refactor: Flat Interface Architecture

This release represents a complete refactor of the Tank01 NFL Client with a flat interface design, correct parameter handling, and 6 new endpoints.

### ✨ Added

#### New Endpoints

- **Fantasy Module** (`src/fantasy/`)
  - `getNFLADP(adpType, options?)` - Average Draft Position data (6 formats: halfPPR, PPR, standard, bestBall, IDP, superFlex)
  - `getNFLProjections(options?)` - Weekly fantasy projections with multiple filters
  - `getNFLDFS(date, options?)` - Daily fantasy sports salaries and data

- **Odds Module** (`src/odds/`)
  - `getNFLBettingOdds(options)` - Betting lines from multiple sportsbooks with OR validation (gameDate/gameID)

- **News Module** (`src/news/`)
  - `getNFLNews(options?)` - NFL news feed with 7 filter options

- **Info Module** (`src/info/`)
  - `getNFLCurrentInfo(date?)` - Current NFL season/week metadata

#### Enhanced Endpoints

- `getNFLDepthCharts()` - Team depth charts for all positions
- `getNFLGamesForPlayer(options)` - Player game logs with fantasy points
- `getNFLGamesForDate(options)` - Games by specific date
- `getNFLScoresOnly(options?)` - Lightweight score-only endpoint

#### OR Parameter Validation

- Added `validateOneOf()` helper for mutually exclusive parameters
- Throws descriptive `TypeError` when OR constraints violated
- 17 comprehensive validation tests covering all edge cases

### 🔄 Changed

#### Breaking Changes - Flat Interface

- **BREAKING**: Removed nested client properties (`client.teams.*`, `client.players.*`, etc.)
- **BREAKING**: All methods now accessible directly on client instance

  ```typescript
  // Before (v0.1.x)
  const teams = await client.teams.getTeams();
  const purdy = await client.players.getPlayer('4381786');

  // After (v0.2.0)
  const teams = await client.getNFLTeams();
  const purdy = await client.getNFLPlayerInfo({ playerID: '4381786' });
  ```

#### Breaking Changes - Method Signatures

- **BREAKING**: `getNFLTeamRoster(teamID, options)` → `getNFLTeamRoster(options)`
  - Now requires options object with `teamID` OR `teamAbv` (either/or validation)
  - Old: `client.getNFLTeamRoster('SF', { getStats: true })`
  - New: `client.getNFLTeamRoster({ teamID: 'SF', getStats: true })`

- **BREAKING**: `getNFLPlayerInfo(playerID)` → `getNFLPlayerInfo(options)`
  - Now requires options object with `playerName` OR `playerID` (either/or validation)
  - Old: `client.getNFLPlayerInfo('4381786')`
  - New: `client.getNFLPlayerInfo({ playerID: '4381786' })`

- **BREAKING**: `getNFLGamesForWeek(season, week)` → `getNFLGamesForWeek(options)`
  - Backward compatible overload maintained, but new signature preferred
  - Old: `client.getNFLGamesForWeek('2024', '1')`
  - New: `client.getNFLGamesForWeek({ week: '1', season: '2024', seasonType: 'reg' })`

- **BREAKING**: `getNFLBoxScore(gameID)` → `getNFLBoxScore(options)`
  - Backward compatible overload maintained
  - New: `client.getNFLBoxScore({ gameID: '20240908_SF@PIT', playByPlay: true })`

#### Enhanced Parameters

- `getNFLTeams()` now accepts 7 optional parameters:
  - `sortBy`, `rosters`, `schedules`, `topPerformers`, `teamStats`, `teamStatsSeason`, `standingsSeason`
- `getNFLTeamRoster()` enhanced with:
  - `archiveDate` - Historical rosters (YYYYMMDD format)
  - `getStats` - Include player statistics
  - `fantasyPoints` - Include fantasy point data

- `getNFLGamesForWeek()` enhanced with:
  - `seasonType` - Filter by "reg", "post", "pre", or "all"

- `getNFLBoxScore()` enhanced with:
  - `playByPlay` - Include play-by-play data
  - `fantasyPoints` - Include fantasy points

- `getNFLPlayerInfo()` enhanced with:
  - `getStats` - Include career statistics

### 🗑️ Removed

#### Removed Fake Endpoints

- **BREAKING**: `getNFLPlayerStats(playerID, season?)` - Use `getNFLPlayerInfo({ playerID, getStats: true })` instead
- **BREAKING**: `getNFLGamesLive()` - Use `getNFLScoresOnly()` instead
- **BREAKING**: `getNFLPlayByPlay(gameID)` - Use `getNFLBoxScore({ gameID, playByPlay: true })` instead
- **BREAKING**: `getNFLTeamStats(teamID, season?)` - Use `getNFLTeams({ teamStats: true })` instead
- **BREAKING**: `getNFLPlayerAdvancedStats(playerID, season?)` - Data embedded in player stats
- **BREAKING**: `getNFLTeamRankings(season?)` - Derive from team stats
- **BREAKING**: `getNFLPlayerProjections(playerID, week)` - Use `getNFLProjections()` instead

#### Removed Modules

- **BREAKING**: Deleted entire `src/stats/` module (all endpoints were fake)

### 📦 Package Size

- **Optimized**: 61.30 KB CJS (down from ~75 KB with fake endpoints)
- **ESM**: 55.48 KB
- **DTS**: 45.94 KB
- Net reduction: 17.5% from removing fake endpoints, then +33% from adding real endpoints
- Final result: Leaner, more accurate API coverage

### 🏗️ Architecture

- Maintained feature folder organization (teams/, players/, games/, live/, fantasy/, odds/, news/, info/)
- All methods use consistent OR parameter validation pattern
- Comprehensive JSDoc documentation for all 21 public methods
- Strict TypeScript compliance with `exactOptionalPropertyTypes`

### 📝 Documentation

- Updated README with flat interface examples
- Added migration guide for v0.1.x → v0.2.0
- All JSDoc examples updated to reflect new API
- Added breaking changes section

### 🧪 Testing

- 17 validation tests for OR parameter constraints
- All existing tests updated for flat interface
- Build validation passing with strict TypeScript checks

## [0.1.0] - 2024-11-15

### Initial Release

- Basic NFL API client with nested structure
- Support for teams, players, games, live data
- TypeScript types and zod validation
- HTTP client with retry logic
