# Feature Specification: Tank01 NFL API Refactor - Flat Interface

**Feature Branch**: `002-api-refactor-flat-interface`  
**Created**: 2025-11-21  
**Status**: Draft  
**Parent Feature**: 001-tank01-nfl-api
**Input**: Refactor Tank01 client to:

1. Expose all methods directly on client (flat interface: `client.getTeams()` not `client.teams.getTeams()`)
2. Fix all endpoint parameters to match actual Tank01 API documentation
3. Remove 7 non-existent endpoints that were incorrectly implemented
4. Add 10 missing endpoints from the actual API
5. Maintain internal organization by feature folders (teams/, players/, games/, etc.)

## Background & Motivation

The initial implementation (001-tank01-nfl-api) was based on incomplete API documentation and used a nested client structure (`client.teams.getTeams()`). After reviewing the complete Tank01 NFL API documentation, we discovered:

**Critical Issues:**

1. **Wrong API Structure**: Implemented nested clients when flat interface is desired
2. **Incorrect Parameters**: Many endpoints have wrong or missing parameters
3. **Fake Endpoints**: 7 endpoints don't exist in the real API and must be removed
4. **Missing Endpoints**: 10 real endpoints were not discovered initially

**Impact:** Current implementation cannot correctly call most Tank01 endpoints due to parameter mismatches and missing functionality.

**Goal:** Refactor to create a production-ready client that accurately represents the Tank01 NFL API with correct parameters and all available endpoints.

## Clarifications

### Session 2025-11-21

- Q: How should existing v0.1.0 users be handled when upgrading to v0.2.0 with the flat interface? → A: Hard break with no deprecation warnings - remove nested clients immediately, force upgrade
- Q: Should the 10 new endpoints have zod schemas for response validation like existing endpoints? → A: Yes, create full zod schemas for all new endpoint responses (consistent with existing pattern)
- Q: How strict should parameter validation be for OR parameters (e.g., `playerName OR playerID` where exactly one is required)? → A: Strict validation - throw TypeError if OR requirements not met (exactly one required)
- Q: Should tests validate against the live Tank01 API or use mocked responses? → A: Contract tests against live API but keep minimal (1,000 requests/month limit)
- Q: How detailed should JSDoc documentation be for each method's parameters? → A: Comprehensive - full JSDoc with descriptions, valid values, examples for each parameter

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Flat Interface Access (Priority: P0 - Breaking Change)

A developer wants simple, direct access to all NFL data methods without navigating nested client objects.

**Why this priority**: This is a breaking architectural change that affects how all developers interact with the library. Must be done before public release.

**Independent Test**: Can be tested by verifying all methods are accessible directly on the Tank01Client instance without intermediate property access.

**Acceptance Scenarios**:

1. **Given** a Tank01Client instance, **When** the developer calls any NFL data method, **Then** the method is available directly on the client object (e.g., `client.getNFLTeams()` not `client.teams.getTeams()`)
2. **Given** the internal codebase, **When** examining the project structure, **Then** feature-specific code remains organized in separate folders (teams/, players/, games/, etc.) for maintainability
3. **Given** TypeScript autocomplete, **When** a developer types `client.`, **Then** all ~30 methods are visible in the autocomplete dropdown
4. **Given** existing code using nested clients, **When** developers upgrade to v0.2.0, **Then** code breaks immediately with TypeScript errors directing them to the flat interface (hard break, no deprecation period)

---

### User Story 2 - Correct Parameter Support (Priority: P0 - Correctness)

A developer needs to pass the correct parameters as documented in the Tank01 API to successfully retrieve data.

**Why this priority**: Current parameter mismatches cause API calls to fail or return incorrect data. This blocks all real-world usage.

**Independent Test**: Can be tested by calling each endpoint with parameters matching Tank01 documentation and verifying successful responses.

**Acceptance Scenarios**:

1. **Given** the `getNFLGamesForWeek` endpoint, **When** the developer passes `seasonType: "post"`, **Then** the client correctly sends this parameter and retrieves playoff games
2. **Given** the `getNFLTeams` endpoint, **When** the developer passes `rosters: true`, **Then** the client returns teams with full roster data embedded
3. **Given** the `getNFLPlayerInfo` endpoint, **When** the developer provides either `playerName` OR `playerID`, **Then** the client accepts either parameter format
4. **Given** any endpoint with optional parameters, **When** the developer omits them, **Then** the API uses sensible defaults (current season, regular season type, etc.)

---

### User Story 3 - Remove Non-Existent Endpoints (Priority: P0 - Correctness)

A developer should not have access to methods that don't correspond to real Tank01 API endpoints.

**Why this priority**: Calling non-existent endpoints always fails, creating confusion and breaking applications.

**Independent Test**: Can be tested by verifying removed methods are no longer exported and attempting to call them results in TypeScript compilation errors.

**Acceptance Scenarios**:

1. **Given** the refactored client, **When** a developer attempts to access `getNFLPlayerStats()`, **Then** TypeScript shows a compilation error indicating the method doesn't exist
2. **Given** the client documentation, **When** a developer reviews available methods, **Then** only methods corresponding to real Tank01 endpoints are listed
3. **Given** migration from old version, **When** code references removed endpoints, **Then** clear error messages guide developers to correct alternatives

**Endpoints to Remove**:

- `getNFLPlayerStats` → Use `getNFLPlayerInfo` with `getStats: true`
- `getNFLGamesLive` → Use `getNFLScoresOnly` or `getNFLBoxScore`
- `getNFLPlayByPlay` → Use `getNFLBoxScore` with `playByPlay: true`
- `getNFLTeamStats` → Use `getNFLTeams` with `teamStats: true`
- `getNFLPlayerAdvancedStats` → No direct replacement, data embedded in player stats
- `getNFLTeamRankings` → No direct replacement, derive from team stats
- `getNFLPlayerProjections` → Use `getNFLProjections`

---

### User Story 4 - Add Missing Endpoints (Priority: P1)

A developer needs access to all Tank01 API functionality including endpoints that were initially overlooked.

**Why this priority**: Missing endpoints prevent developers from accessing complete NFL data, limiting the library's usefulness.

**Independent Test**: Can be tested by calling each new endpoint with valid parameters and verifying expected data structures are returned.

**Acceptance Scenarios**:

1. **Given** the need for fantasy football data, **When** the developer calls `getADP("halfPPR")`, **Then** average draft position data is returned for all players
2. **Given** the need for betting information, **When** the developer calls `getNFLBettingOdds({ gameDate: "20241215" })`, **Then** odds from multiple sportsbooks are returned
3. **Given** the need for news, **When** the developer calls `getNews({ teamAbv: "SF", recentNews: true })`, **Then** recent news articles for the 49ers are returned
4. **Given** the need for depth charts, **When** the developer calls `getDepthCharts()`, **Then** current depth chart information for all teams is returned

**New Endpoints to Add**:

- `getNFLDepthCharts()` - Team depth charts
- `getNFLADP(adpType, options?)` - Fantasy draft positions
- `getNFLGamesForPlayer(options)` - Player game logs
- `getNFLScoresOnly(options?)` - Quick score access
- `getNFLProjections(options?)` - Fantasy projections
- `getNFLDFS(date, options?)` - Daily fantasy data
- `getNFLBettingOdds(gameDate|gameID, options?)` - Betting lines
- `getNFLNews(options?)` - NFL news feed
- `getNFLGamesForDate(gameDate)` - Games by specific date
- `getNFLCurrentInfo(date?)` - Current NFL season/week info

---

## Requirements _(mandatory)_

### Functional Requirements

**API Interface**:

- **FR-001**: All public methods MUST be accessible directly on Tank01Client instance (flat interface)
- **FR-002**: Internal code MUST remain organized by feature folders (teams/, players/, games/, odds/, news/, fantasy/, info/)
- **FR-003**: Method names MUST match Tank01 endpoint names for clarity (e.g., `getNFLTeams`, `getNFLBoxScore`)

**Parameter Correctness**:

- **FR-004**: `getNFLTeams` MUST support: sortBy, rosters, schedules, topPerformers, teamStats, teamStatsSeason, standingsSeason
- **FR-005**: `getNFLTeamRoster` MUST support: teamID/teamAbv (either/or), archiveDate, getStats, fantasyPoints with client-side validation throwing TypeError if neither teamID nor teamAbv provided
- **FR-006**: `getNFLGamesForWeek` MUST support: week (required), seasonType, season
- **FR-007**: `getNFLPlayerInfo` MUST support: playerName OR playerID (either/or required), getStats with client-side validation throwing TypeError if neither or both provided
- **FR-008**: `getNFLBoxScore` MUST support: gameID, playByPlay, fantasyPoints
- **FR-009**: All parameters marked optional in API MUST be optional in client methods
- **FR-010**: All parameters marked required in API MUST be required in client methods
- **FR-011**: Parameter types MUST match API expectations (string "20241215" not Date object)
- **FR-012**: `fantasyPoints` parameter is optional (can be omitted). When omitted, it defaults to false. TypeScript signature: `fantasyPoints?: boolean`
- **FR-013**: `itemFormat` parameter MUST accept "map" or "list" values where applicable
- **FR-034**: Client MUST validate OR parameter requirements (teamID/teamAbv, playerName/playerID, gameDate/gameID) and throw descriptive TypeError before making API calls when constraints violated

**Endpoint Removal** (Breaking Changes):

- **FR-014**: Client MUST NOT export `getNFLPlayerStats` method
- **FR-015**: Client MUST NOT export `getNFLGamesLive` method
- **FR-016**: Client MUST NOT export `getNFLPlayByPlay` method
- **FR-017**: Client MUST NOT export `getNFLTeamStats` method
- **FR-018**: Client MUST NOT export `getNFLPlayerAdvancedStats` method
- **FR-019**: Client MUST NOT export `getNFLTeamRankings` method
- **FR-020**: Client MUST NOT export `getNFLPlayerProjections` method (replaced by `getNFLProjections`)

**New Endpoints**:

- **FR-021**: Client MUST expose `getNFLDepthCharts()` method with no parameters and full zod schema validation
- **FR-022**: Client MUST expose `getNFLADP(adpType, options?)` method with adpDate, pos, filterOut options and full zod schema validation
- **FR-023**: Client MUST expose `getNFLGamesForPlayer(options)` with playerID, teamID, gameID, itemFormat, numberOfGames, fantasyPoints and full zod schema validation
- **FR-024**: Client MUST expose `getNFLScoresOnly(options?)` with gameDate, gameID, topPerformers, gameWeek, season, seasonType and full zod schema validation
- **FR-025**: Client MUST expose `getNFLGamesForDate(gameDate)` method with full zod schema validation
- **FR-026**: Client MUST expose `getNFLProjections(options?)` with week, playerID, teamID, archiveSeason, itemFormat and full zod schema validation
- **FR-027**: Client MUST expose `getNFLDFS(date, options?)` with includeTeamDefense option and full zod schema validation
- **FR-028**: Client MUST expose `getNFLBettingOdds(gameDate|gameID, options?)` with itemFormat, impliedTotals, playerProps, playerID and full zod schema validation
- **FR-029**: Client MUST expose `getNFLNews(options?)` with playerID, teamID, teamAbv, topNews, fantasyNews, recentNews, maxItems and full zod schema validation
- **FR-030**: Client MUST expose `getNFLCurrentInfo(date?)` method with full zod schema validation

**Backward Compatibility**:

- **FR-031**: README MUST include migration guide from v0.1.0 to v0.2.0 documenting breaking changes (hard break, no backward compatibility layer)
- **FR-032**: CHANGELOG MUST document all breaking changes with clear before/after code examples
- **FR-033**: Package version MUST be bumped to 0.2.0 (minor version for breaking changes in pre-1.0)
- **FR-035**: Migration guide MUST state that nested client access is completely removed with no deprecation period
- **FR-036**: All public methods MUST have comprehensive JSDoc documentation including parameter descriptions, valid values (enums, formats), default values, and @example blocks with working code

### Key Entities

**Existing (Updated)**:

- **Tank01Client**: Main client class exposing all ~30 methods directly
- **Team**: Updated to include roster/schedule/stats when requested via parameters
- **Player**: Updated to include stats when requested via getStats parameter
- **Game**: Updated with seasonType awareness

**New**:

- **DepthChart**: Team depth chart by position
- **ADP**: Average draft position data
- **PlayerGameLog**: Individual game performance history
- **ScoreOnly**: Lightweight score data without full game details
- **Projection**: Fantasy point projections (weekly or seasonal)
- **DFS**: Daily fantasy sports data
- **BettingOdds**: Sportsbook lines and props
- **News**: NFL news articles and updates
- **CurrentInfo**: Current NFL season/week/playoff status

## Success Criteria _(mandatory)_

### Measurable Outcomes

**Interface**:

- **SC-001**: All 30+ methods are accessible as `client.methodName()` without nested property access
- **SC-002**: TypeScript autocomplete shows all methods when typing `client.`
- **SC-003**: Zero methods exist on sub-client properties (client.teams, client.players, etc. don't exist in public API)

**Correctness**:

- **SC-004**: 100% of endpoint calls use parameters that match Tank01 API documentation
- **SC-005**: Contract tests pass for all 30+ endpoints against live Tank01 API
- **SC-006**: Zero fake/non-existent endpoints are exposed in public API
- **SC-007**: All 10 previously missing endpoints are now accessible and functional

**Quality**:

- **SC-008**: Build passes with zero TypeScript errors
- **SC-009**: All tests pass (unit, integration, contract)
- **SC-010**: API response time remains under 100ms overhead per call
- **SC-011**: Package size increases by less than 20% despite additional endpoints
- **SC-012**: Contract tests consume less than 100 API requests per full test run (respecting 1,000/month quota)

## Assumptions

- Existing internal folder structure (teams/, players/, games/) is good for maintainability
- Developers prefer flat interface over nested clients for simplicity
- Breaking changes are acceptable since current version is 0.1.0 (pre-release)
- Tank01 API will not change parameter requirements during this refactor
- Most developers upgrading will need to update all their method calls anyway
- Migration from nested to flat interface is straightforward to document
- Additional endpoints will add value without significant performance cost
- Parameter validation should happen before API calls to fail fast
- Default parameter values match Tank01 API defaults (current season, "reg" season type, etc.)
- `fantasyPoints: false` default is appropriate for most use cases to reduce payload size
- API quota limit of 1,000 requests/month requires minimal contract test coverage (1-2 tests per endpoint category, not per endpoint)
- Contract tests should be skipped by default in CI, run manually via flag before releases

## Out of Scope

- Changing error handling patterns (keep existing error classes)
- Changing retry/timeout logic (keep existing implementation)
- Adding request caching or memoization
- Creating helper methods that combine multiple API calls
- Implementing rate limiting beyond what's already present
- Adding GraphQL or alternative query interfaces
- Browser/edge runtime support (remains Node.js focused)
- Backward-compatible shim layer (clean break for v0.2.0)
