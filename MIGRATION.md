# Migration Guide: v0.1.x → v0.2.0

This guide will help you migrate from v0.1.x to v0.2.0 of the Tank01 NFL Client.

## Overview

Version 0.2.0 introduces a **flat interface architecture** that eliminates nested client properties and provides direct access to all methods on the main `Tank01Client` instance. This change improves discoverability, reduces typing complexity, and aligns with modern API design patterns.

## Breaking Changes Summary

1. **Flat Interface**: No more nested clients (`client.teams.*` → `client.getNFLTeams()`)
2. **Method Signatures**: Several methods now use options objects with OR validation
3. **Removed Endpoints**: 7 fake endpoints removed, replaced with real alternatives
4. **Enhanced Parameters**: Existing methods support more parameters

---

## 1. Flat Interface Migration

### Teams Methods

```typescript
// ❌ Before (v0.1.x)
const teams = await client.teams.getTeams();
const niners = await client.teams.getTeam('SF');
const roster = await client.teams.getTeamRoster('SF', { getStats: true });

// ✅ After (v0.2.0)
const teams = await client.getNFLTeams();
const niners = await client.getNFLTeam('SF');
const roster = await client.getNFLTeamRoster({ teamID: 'SF', getStats: true });
```

### Players Methods

```typescript
// ❌ Before (v0.1.x)
const players = await client.players.getPlayers();
const purdy = await client.players.getPlayer('4381786');
const stats = await client.players.getPlayerStats('4381786', '2024');
const qbs = await client.players.searchPlayers({ team: 'SF', position: 'QB' });

// ✅ After (v0.2.0)
const players = await client.getNFLPlayerList();
const purdy = await client.getNFLPlayerInfo({ playerID: '4381786' });
// getPlayerStats removed - use getNFLPlayerInfo with getStats: true
const purdyWithStats = await client.getNFLPlayerInfo({
  playerID: '4381786',
  getStats: true,
});
const qbs = await client.searchNFLPlayers({ team: 'SF', position: 'QB' });
```

### Games Methods

```typescript
// ❌ Before (v0.1.x)
const week1 = await client.games.getSchedule('2024', '1');
const schedule = await client.games.getTeamSchedule('SF', '2024');
const game = await client.games.getGame('20240908_SF@PIT');
const results = await client.games.searchGames({ season: '2024' });

// ✅ After (v0.2.0)
const week1 = await client.getNFLGamesForWeek({ week: '1', season: '2024' });
const schedule = await client.getNFLTeamSchedule('SF', '2024');
const game = await client.getNFLGameInfo('20240908_SF@PIT');
const results = await client.searchNFLGames({ season: '2024' });
```

### Live Methods

```typescript
// ❌ Before (v0.1.x)
const liveGames = await client.live.getLiveGames();
const boxScore = await client.live.getLiveBoxScore('20240908_SF@PIT');
const plays = await client.live.getPlayByPlay('20240908_SF@PIT');

// ✅ After (v0.2.0)
// getLiveGames removed - use getNFLScoresOnly()
const liveGames = await client.getNFLScoresOnly();
const boxScore = await client.getNFLBoxScore({ gameID: '20240908_SF@PIT' });
// getPlayByPlay removed - use getNFLBoxScore with playByPlay: true
const boxScoreWithPlays = await client.getNFLBoxScore({
  gameID: '20240908_SF@PIT',
  playByPlay: true,
});
```

### Stats Methods (All Removed)

```typescript
// ❌ Before (v0.1.x)
const teamStats = await client.stats.getTeamStats('SF', '2024');
const advanced = await client.stats.getPlayerAdvancedStats('4381786', '2024');
const rankings = await client.stats.getTeamRankings('2024');
const projections = await client.stats.getPlayerProjections('4381786', '1');

// ✅ After (v0.2.0)
// All stats methods removed - use alternatives:
const teamsWithStats = await client.getNFLTeams({
  teamStats: true,
  teamStatsSeason: '2024',
});
const purdyWithStats = await client.getNFLPlayerInfo({
  playerID: '4381786',
  getStats: true,
});
// Rankings: derive from team stats
const rankings = teamsWithStats.sort((a, b) => (b.wins || 0) - (a.wins || 0));
// Projections: use new fantasy endpoint
const projections = await client.getNFLProjections({
  playerID: '4381786',
  week: '1',
});
```

---

## 2. OR Parameter Validation

Several methods now enforce **either/or** parameter requirements with runtime validation.

### getNFLTeamRoster

**Must provide exactly ONE of: `teamID` OR `teamAbv`**

```typescript
// ✅ Correct - using teamID
const roster = await client.getNFLTeamRoster({
  teamID: 'SF',
  getStats: true,
});

// ✅ Correct - using teamAbv
const roster = await client.getNFLTeamRoster({
  teamAbv: 'SF',
  archiveDate: '20240901',
});

// ❌ Error - neither provided
await client.getNFLTeamRoster({ getStats: true });
// TypeError: getNFLTeamRoster requires exactly one of: teamID, teamAbv

// ❌ Error - both provided
await client.getNFLTeamRoster({
  teamID: 'SF',
  teamAbv: 'SF',
});
// TypeError: getNFLTeamRoster requires exactly one of: teamID, teamAbv (found: teamID, teamAbv)
```

### getNFLPlayerInfo

**Must provide exactly ONE of: `playerName` OR `playerID`**

```typescript
// ✅ Correct - using playerID
const purdy = await client.getNFLPlayerInfo({
  playerID: '4381786',
});

// ✅ Correct - using playerName
const mahomes = await client.getNFLPlayerInfo({
  playerName: 'Patrick Mahomes',
  getStats: true,
});

// ❌ Error - neither provided
await client.getNFLPlayerInfo({ getStats: true });
// TypeError: getNFLPlayerInfo requires exactly one of: playerName, playerID

// ❌ Error - both provided
await client.getNFLPlayerInfo({
  playerName: 'Brock Purdy',
  playerID: '4381786',
});
// TypeError: getNFLPlayerInfo requires exactly one of: playerName, playerID (found: playerName, playerID)
```

### getNFLBettingOdds (New)

**Must provide exactly ONE of: `gameDate` OR `gameID`**

```typescript
// ✅ Correct - using gameDate
const odds = await client.getNFLBettingOdds({
  gameDate: '20240908',
});

// ✅ Correct - using gameID
const gameOdds = await client.getNFLBettingOdds({
  gameID: '20240908_SF@PIT',
  playerProps: true,
});

// ❌ Error - neither provided
await client.getNFLBettingOdds({ playerProps: true });
// TypeError: getNFLBettingOdds requires exactly one of: gameDate, gameID
```

---

## 3. New Endpoints & Features

### Fantasy Football

```typescript
// Average Draft Position
const adp = await client.getNFLADP('halfPPR'); // or 'PPR', 'standard', etc.
const rbAdp = await client.getNFLADP('PPR', { pos: 'RB' });

// Weekly Projections
const projections = await client.getNFLProjections({ week: '1' });
const purdyProj = await client.getNFLProjections({ playerID: '4381786' });

// Daily Fantasy Sports
const dfs = await client.getNFLDFS('20240908');
const dfsWithDefense = await client.getNFLDFS('20240908', {
  includeTeamDefense: true,
});
```

### Betting Odds

```typescript
// Get odds for a specific date
const odds = await client.getNFLBettingOdds({ gameDate: '20240908' });

// Get odds with player props
const gameOdds = await client.getNFLBettingOdds({
  gameID: '20240908_SF@PIT',
  playerProps: true,
  playerID: '4381786', // filter to specific player
});
```

### NFL News

```typescript
// All news
const news = await client.getNFLNews();

// Team-specific news
const sfNews = await client.getNFLNews({
  teamAbv: 'SF',
  recentNews: true,
  maxItems: 10,
});

// Fantasy-relevant player news
const purdyNews = await client.getNFLNews({
  playerID: '4381786',
  fantasyNews: true,
});
```

### Current Season Info

```typescript
// Current week/season
const info = await client.getNFLCurrentInfo();
console.log(`Season ${info.season}, Week ${info.week}, Type: ${info.seasonType}`);

// Historical date
const historical = await client.getNFLCurrentInfo('20240908');
```

### Enhanced Existing Endpoints

```typescript
// Teams with additional data
const teams = await client.getNFLTeams({
  rosters: true,
  teamStats: true,
  teamStatsSeason: '2024',
  topPerformers: true,
});

// Depth charts
const depthCharts = await client.getNFLDepthCharts();

// Games by date
const games = await client.getNFLGamesForDate({ gameDate: '20240908' });

// Lightweight scores
const scores = await client.getNFLScoresOnly({ week: '1', season: '2024' });

// Player game logs
const gameLogs = await client.getNFLGamesForPlayer({
  playerID: '4381786',
  numberOfGames: 5,
  fantasyPoints: true,
});

// Games with season type
const playoffs = await client.getNFLGamesForWeek({
  week: '1',
  seasonType: 'post',
});
```

---

## 4. Backward Compatibility

Some methods maintain backward compatibility through **overloaded signatures**:

### getNFLGamesForWeek

```typescript
// ✅ Old signature still works
const games = await client.getNFLGamesForWeek('2024', '1');

// ✅ New signature with more options
const games = await client.getNFLGamesForWeek({
  week: '1',
  season: '2024',
  seasonType: 'reg',
});
```

### getNFLBoxScore

```typescript
// ✅ Old signature still works
const boxScore = await client.getNFLBoxScore('20240908_SF@PIT');

// ✅ New signature with more options
const boxScore = await client.getNFLBoxScore({
  gameID: '20240908_SF@PIT',
  playByPlay: true,
  fantasyPoints: true,
});
```

---

## 5. Quick Migration Checklist

- [ ] Replace all `client.teams.*` with `client.getNFL*`
- [ ] Replace all `client.players.*` with `client.getNFL*` or `client.searchNFL*`
- [ ] Replace all `client.games.*` with `client.getNFL*` or `client.searchNFL*`
- [ ] Replace all `client.live.*` with `client.getNFL*`
- [ ] Remove all `client.stats.*` calls and use alternatives
- [ ] Update `getNFLTeamRoster()` calls to use options object
- [ ] Update `getNFLPlayerInfo()` calls to use options object
- [ ] Replace `getNFLPlayerStats()` with `getNFLPlayerInfo({ playerID, getStats: true })`
- [ ] Replace `getNFLGamesLive()` with `getNFLScoresOnly()`
- [ ] Replace `getNFLPlayByPlay()` with `getNFLBoxScore({ gameID, playByPlay: true })`
- [ ] Update tests to reflect new method names
- [ ] Run TypeScript compiler to catch any remaining issues

---

## 6. TypeScript Benefits

The new flat interface provides better type inference and autocomplete:

```typescript
const client = new Tank01Client();

// IDE shows all 21 methods directly on client
client. // autocomplete shows: getNFLTeams, getNFLPlayerInfo, getNFLADP, etc.

// No more nested navigation
client.teams. // ❌ No longer exists
```

---

## Need Help?

- Check the updated [README.md](./README.md) for complete examples
- Review [CHANGELOG.md](./CHANGELOG.md) for detailed changes
- All methods have comprehensive JSDoc documentation
- Run `npm run typecheck` to catch migration issues early

---

**Estimated Migration Time**: 15-30 minutes for small projects, 1-2 hours for large projects with extensive API usage.
