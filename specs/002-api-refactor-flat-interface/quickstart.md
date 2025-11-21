# Quickstart: Tank01 NFL API Refactor - Flat Interface

**Feature**: 002-api-refactor-flat-interface  
**Branch**: `002-api-refactor-flat-interface`  
**Status**: Ready for Implementation

---

## Overview

This refactor transforms the Tank01 NFL client from a nested client architecture to a flat interface while fixing all endpoint parameters and adding missing endpoints.

**Before (v0.1.0)**:

```typescript
const client = new Tank01Client({ apiKey: 'xxx' });
const teams = await client.teams.getTeams(); // Nested access
const player = await client.players.getPlayer(123); // Wrong params
```

**After (v0.2.0)**:

```typescript
const client = new Tank01Client({ apiKey: 'xxx' });
const teams = await client.getNFLTeams({ rosters: true }); // Flat access
const player = await client.getNFLPlayerInfo({ playerID: 123, getStats: true }); // Correct params
```

---

## What Changed

### 1. Architecture: Nested → Flat Interface

**Removed**: All nested sub-clients (`client.teams`, `client.players`, `client.games`, `client.live`, `client.stats`)

**Added**: All ~30 methods directly on `Tank01Client` class:

- Teams: `getNFLTeams()`, `getNFLTeamRoster()`, `getNFLDepthCharts()`
- Players: `getNFLPlayerList()`, `getNFLPlayerInfo()`, `getNFLADP()`, `getNFLGamesForPlayer()`
- Games: `getNFLGamesForWeek()`, `getNFLGameInfo()`, `getNFLTeamSchedule()`, `getNFLScoresOnly()`, `getNFLGamesForDate()`
- Live: `getNFLBoxScore()`
- Projections: `getNFLProjections()`, `getNFLDFS()`
- Odds: `getNFLBettingOdds()`
- News: `getNFLNews()`
- Info: `getNFLCurrentInfo()`

### 2. Fixed Parameters (All Endpoints)

Every endpoint now accepts the correct parameters per Tank01 API documentation:

**Example - getNFLTeams**:

```typescript
// Before (missing parameters)
client.teams.getTeams();

// After (all optional params available)
client.getNFLTeams({
  sortBy: 'division',
  rosters: true,
  schedules: true,
  topPerformers: true,
  teamStats: true,
  teamStatsSeason: 2024,
  standingsSeason: 2024,
});
```

**Example - getNFLPlayerInfo** (OR parameters):

```typescript
// One of playerName OR playerID required
await client.getNFLPlayerInfo({ playerName: 'brock_purdy', getStats: true });
// OR
await client.getNFLPlayerInfo({ playerID: 4381786, getStats: true });
// ERROR: Neither provided → TypeError thrown
```

### 3. Removed Fake Endpoints (7 total)

These methods are **completely removed**:

| Old Method                    | Replacement                                      |
| ----------------------------- | ------------------------------------------------ |
| `getNFLPlayerStats()`         | `getNFLPlayerInfo({ playerID, getStats: true })` |
| `getNFLGamesLive()`           | `getNFLScoresOnly()` or `getNFLBoxScore()`       |
| `getNFLPlayByPlay()`          | `getNFLBoxScore({ gameID, playByPlay: true })`   |
| `getNFLTeamStats()`           | `getNFLTeams({ teamStats: true })`               |
| `getNFLPlayerAdvancedStats()` | Data embedded in `getNFLPlayerInfo()`            |
| `getNFLTeamRankings()`        | Derive from `getNFLTeams({ teamStats: true })`   |
| `getNFLPlayerProjections()`   | `getNFLProjections()`                            |

### 4. Added Missing Endpoints (10 total)

New methods now available:

| Method                                          | Purpose                                   |
| ----------------------------------------------- | ----------------------------------------- |
| `getNFLDepthCharts()`                           | Team depth charts by position             |
| `getNFLADP(adpType, options?)`                  | Average draft positions for fantasy       |
| `getNFLGamesForPlayer(options)`                 | Player game logs                          |
| `getNFLScoresOnly(options?)`                    | Quick score access without full game data |
| `getNFLGamesForDate(gameDate)`                  | Games by specific date                    |
| `getNFLProjections(options?)`                   | Fantasy point projections                 |
| `getNFLDFS(date, options?)`                     | Daily fantasy sports data                 |
| `getNFLBettingOdds(gameDate\|gameID, options?)` | Betting lines and props                   |
| `getNFLNews(options?)`                          | NFL news feed                             |
| `getNFLCurrentInfo(date?)`                      | Current season/week/playoff info          |

---

## Migration Guide: v0.1.0 → v0.2.0

### Step 1: Update Import (No Change)

```typescript
import { Tank01Client } from '@tank01/nfl-client';
```

### Step 2: Update All Method Calls

**Teams**:

```typescript
// Before
client.teams.getTeams()
client.teams.getTeam(teamID)
client.teams.getTeamRoster(teamID, options)

// After
client.getNFLTeams(options?)
client.getNFLTeams({ teamID }) // Filter by single team
client.getNFLTeamRoster({ teamID, ...options })
```

**Players**:

```typescript
// Before
client.players.getPlayers();
client.players.getPlayer(playerID);
client.players.getPlayerStats(playerID); // ❌ REMOVED

// After
client.getNFLPlayerList();
client.getNFLPlayerInfo({ playerID, getStats: true });
client.getNFLPlayerInfo({ playerID, getStats: true }); // Replacement
```

**Games**:

```typescript
// Before
client.games.getSchedule(season, week)
client.games.getGame(gameID)

// After
client.getNFLGamesForWeek({ week, season?, seasonType? })
client.getNFLGameInfo({ gameID })
```

**Live/Box Scores**:

```typescript
// Before
client.live.getLiveGames(); // ❌ REMOVED
client.live.getLiveBoxScore(gameID);
client.live.getPlayByPlay(gameID); // ❌ REMOVED

// After
client.getNFLScoresOnly(); // Current day scores
client.getNFLBoxScore({ gameID });
client.getNFLBoxScore({ gameID, playByPlay: true }); // Replacement
```

### Step 3: Update Parameter Validation

OR parameters now throw `TypeError` if validation fails:

```typescript
// ❌ ERROR: Neither playerName nor playerID
try {
  await client.getNFLPlayerInfo({ getStats: true });
} catch (error) {
  // TypeError: Either playerName or playerID must be provided
}

// ✅ CORRECT: Exactly one provided
await client.getNFLPlayerInfo({ playerName: 'brock_purdy' });
await client.getNFLPlayerInfo({ playerID: 4381786 });

// ❌ ERROR: Both provided
try {
  await client.getNFLPlayerInfo({
    playerName: 'brock_purdy',
    playerID: 4381786,
  });
} catch (error) {
  // TypeError: Provide either playerName or playerID, not both
}
```

### Step 4: Adopt New Endpoints

```typescript
// Fantasy football
const adp = await client.getNFLADP('halfPPR', { pos: 'QB' });
const projections = await client.getNFLProjections({ week: '1' });
const dfs = await client.getNFLDFS('20241215');

// Betting
const odds = await client.getNFLBettingOdds('20241215', {
  playerProps: true,
});

// News
const news = await client.getNFLNews({
  teamAbv: 'SF',
  recentNews: true,
  maxItems: 10,
});

// Season info
const currentInfo = await client.getNFLCurrentInfo();
```

---

## Quick Reference: All Methods

### Teams (3 methods)

- `getNFLTeams(options?)` - All teams with optional filters
- `getNFLTeamRoster({ teamID|teamAbv, ...options })` - Team roster
- `getNFLDepthCharts()` - Depth charts for all teams

### Players (4 methods)

- `getNFLPlayerList()` - All 4,500+ players (use with caution)
- `getNFLPlayerInfo({ playerName|playerID, getStats? })` - Player details
- `getNFLADP(adpType, options?)` - Fantasy draft positions
- `getNFLGamesForPlayer(options)` - Player game logs

### Games (5 methods)

- `getNFLGamesForWeek({ week, ...options })` - Games by week
- `getNFLGameInfo({ gameID })` - Single game details
- `getNFLTeamSchedule({ teamID|teamAbv, ...options })` - Team schedule
- `getNFLScoresOnly(options?)` - Quick scores
- `getNFLGamesForDate(gameDate)` - Games on specific date

### Live (1 method)

- `getNFLBoxScore({ gameID, playByPlay?, fantasyPoints? })` - Box score with optional play-by-play

### Projections (2 methods)

- `getNFLProjections(options?)` - Fantasy projections
- `getNFLDFS(date, options?)` - Daily fantasy data

### Odds (1 method)

- `getNFLBettingOdds(gameDate|gameID, options?)` - Betting lines and props

### News (1 method)

- `getNFLNews(options?)` - NFL news feed

### Info (1 method)

- `getNFLCurrentInfo(date?)` - Current season/week info

---

## Common Patterns

### Pattern 1: Enriched Data Retrieval

```typescript
// Get teams with rosters, schedules, and stats
const teams = await client.getNFLTeams({
  rosters: true,
  schedules: true,
  teamStats: true,
  teamStatsSeason: 2024,
});
```

### Pattern 2: Player Lookup by Name

```typescript
// Find player by name, get stats
const purdy = await client.getNFLPlayerInfo({
  playerName: 'brock_purdy',
  getStats: true,
});
```

### Pattern 3: Weekly Games with Playoff Support

```typescript
// Regular season week 15
const week15 = await client.getNFLGamesForWeek({
  week: '15',
  seasonType: 'reg',
  season: 2024,
});

// Playoffs
const playoffs = await client.getNFLGamesForWeek({
  week: '1',
  seasonType: 'post',
});
```

### Pattern 4: Full Game Data

```typescript
// Get box score with play-by-play and fantasy points
const gameData = await client.getNFLBoxScore({
  gameID: '20241215_SF@BUF',
  playByPlay: true,
  fantasyPoints: true,
});
```

### Pattern 5: Fantasy Research

```typescript
// Get ADP for RBs in half-PPR
const rbAdp = await client.getNFLADP('halfPPR', { pos: 'RB' });

// Get week 1 projections
const projections = await client.getNFLProjections({ week: '1' });

// Get DFS data for today
const dfs = await client.getNFLDFS('20241215', {
  includeTeamDefense: true,
});
```

---

## Parameter Formats

### Date Parameters

Always use `YYYYMMDD` format (string):

```typescript
client.getNFLScoresOnly({ gameDate: '20241215' });
client.getNFLDFS('20241215');
client.getNFLBettingOdds('20241215');
```

### Game ID Format

Always `YYYYMMDD_AWAY@HOME`:

```typescript
client.getNFLBoxScore({ gameID: '20241215_SF@BUF' });
```

### Season Parameters

Use 4-digit year (number) representing season start year:

```typescript
// 2024 season (2024-2025)
client.getNFLTeams({ teamStatsSeason: 2024 });
```

### Item Format

Choose `'map'` (default) or `'list'`:

```typescript
// Map format: { [playerID]: data }
client.getNFLProjections({ itemFormat: 'map' });

// List format: [data, data, ...]
client.getNFLProjections({ itemFormat: 'list' });
```

---

## Testing Notes

Contract tests are minimal due to API quota (1,000 requests/month):

- Tests run via flag: `npm run test:contract` (not in default CI)
- ~1-2 tests per endpoint category
- Focus on parameter validation and response schema

Run tests manually before releases:

```bash
npm run test          # Unit tests (fast, no API calls)
npm run test:contract # Contract tests (uses API quota)
```

---

## Need Help?

- **Full API Documentation**: See `specs/001-tank01-nfl-api/endpoints-and-params.md`
- **Implementation Plan**: See `specs/002-api-refactor-flat-interface/plan.md`
- **Breaking Changes**: See CHANGELOG.md
- **Type Definitions**: All methods have comprehensive JSDoc with examples

---

**Version**: 0.2.0  
**Breaking Changes**: Yes (hard break from v0.1.0)  
**Backward Compatibility**: None (clean break)
