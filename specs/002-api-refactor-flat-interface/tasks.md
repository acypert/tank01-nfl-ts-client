# Tasks: Tank01 NFL API Refactor - Flat Interface

**Feature**: 002-api-refactor-flat-interface  
**Generated**: 2025-11-21  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Task Organization

Tasks are organized by user story to enable independent implementation and testing. Each phase represents a complete, independently testable increment.

**Total Tasks**: 205  
**Estimated Duration**: 2-3 days

---

## Phase 1: Setup & Infrastructure (5 tasks)

**Goal**: Prepare project structure and validation infrastructure before refactoring.

- [ ] T001 Create src/common/validation/ directory structure
- [ ] T002 Implement validateOneOf() helper in src/common/validation/parameters.ts for OR parameter validation
- [ ] T003 [P] Add ValidationError class in src/common/errors/validation-error.ts
- [ ] T004 [P] Create test file src/common/validation/**tests**/parameters.test.ts
- [ ] T005 Add JSDoc template helper in src/common/utils/jsdoc.ts for consistent documentation

---

## Phase 2: Foundational - Remove Nested Clients (8 tasks)

**Goal**: Refactor Tank01Client to flat interface architecture. This is blocking for all other work.

**Why Foundational**: Must complete before any user story work since it changes how all methods are exposed.

- [ ] T006 Read src/client.ts to understand current nested client architecture
- [ ] T007 Read all feature client files (teams/client.ts, players/client.ts, games/client.ts, live/client.ts, stats/client.ts)
- [ ] T008 Remove nested client properties (this.teams, this.players, this.games, this.live, this.stats) from src/client.ts
- [ ] T009 Import all existing methods from feature folders into src/client.ts
- [ ] T010 Add method delegation stubs for all ~19 existing methods directly on Tank01Client class
- [ ] T011 Update src/index.ts to export only Tank01Client (remove sub-client exports)
- [ ] T012 Update src/client.ts JSDoc to document flat interface with @example showing client.getNFLTeams() not client.teams.getTeams()
- [ ] T013 Verify npm run build passes with flat interface changes

---

## Phase 3: User Story 1 - Flat Interface Access (12 tasks)

**Story Goal**: All methods accessible directly on client instance without nested property access.

**Independent Test**: TypeScript autocomplete shows all methods when typing `client.`. No nested client properties exist.

### Implementation

- [ ] T014 [US1] Delete src/teams/client.ts (TeamsClient class no longer needed)
- [ ] T015 [US1] Delete src/players/client.ts (PlayersClient class no longer needed)
- [ ] T016 [US1] Delete src/games/client.ts (GamesClient class no longer needed)
- [ ] T017 [US1] Delete src/live/client.ts (LiveClient class no longer needed)
- [ ] T018 [US1] Delete src/stats/client.ts (StatsClient class no longer needed - all fake endpoints)
- [ ] T019 [US1] Update src/teams/index.ts to export individual functions not TeamsClient class
- [ ] T020 [US1] Update src/players/index.ts to export individual functions not PlayersClient class
- [ ] T021 [US1] Update src/games/index.ts to export individual functions not GamesClient class
- [ ] T022 [US1] Update src/live/index.ts to export individual functions not LiveClient class

### Testing & Documentation

- [ ] T023 [US1] Update all tests in src/**tests**/client.test.ts to use flat interface (client.getNFLTeams() not client.teams.getTeams())
- [ ] T024 [US1] Verify TypeScript autocomplete shows all methods on `client.`
- [ ] T025 [US1] Update README.md with flat interface examples and migration guide section

**Completion Criteria**: All methods callable as `client.methodName()`, no nested properties, TypeScript compilation succeeds.

---

## Phase 4: User Story 2a - Fix Teams Endpoint Parameters (14 tasks)

**Story Goal**: getNFLTeams, getNFLTeamRoster, getNFLTeamSchedule have correct parameters per Tank01 API.

**Independent Test**: Can call each endpoint with all documented parameters and get successful responses.

### getNFLTeams (7 params to add)

- [ ] T026 [P] [US2] Add GetNFLTeamsOptions interface in src/teams/types.ts with sortBy, rosters, schedules, topPerformers, teamStats, teamStatsSeason, standingsSeason
- [ ] T027 [P] [US2] Add zod schema for GetNFLTeamsOptions in src/teams/schemas.ts
- [ ] T028 [US2] Update getNFLTeams() signature in src/teams/getNFLTeams.ts to accept options parameter
- [ ] T029 [US2] Add comprehensive JSDoc to getNFLTeams() with all parameter descriptions and example
- [ ] T030 [US2] Update getNFLTeams() in Tank01Client class (src/client.ts) to pass options
- [ ] T031 [US2] Update tests in src/teams/**tests**/getNFLTeams.test.ts for new parameters
- [ ] T032 [US2] Add example in examples/get-teams.ts using new parameters (rosters: true, teamStats: true)

### getNFLTeamRoster (OR validation + 3 params)

- [ ] T033 [P] [US2] Update GetTeamRosterOptions interface in src/teams/types.ts with teamID, teamAbv, archiveDate, getStats, fantasyPoints
- [ ] T034 [P] [US2] Update zod schema for GetTeamRosterOptions in src/teams/schemas.ts
- [ ] T035 [US2] Add validateOneOf(['teamID', 'teamAbv']) call in src/teams/getNFLTeamRoster.ts
- [ ] T036 [US2] Update getNFLTeamRoster() implementation to handle teamID OR teamAbv
- [ ] T037 [US2] Add comprehensive JSDoc with OR requirement clearly documented
- [ ] T038 [US2] Update tests to verify OR validation throws TypeError when both/neither provided
- [ ] T039 [US2] Update example in examples/get-team-roster.ts

### getNFLDepthCharts (NEW endpoint)

- [ ] T040 [P] [US2] Create src/teams/getNFLDepthCharts.ts with implementation
- [ ] T041 [P] [US2] Add DepthChart types in src/teams/types.ts
- [ ] T042 [P] [US2] Add zod schema for depth chart response in src/teams/schemas.ts
- [ ] T043 [US2] Add getNFLDepthCharts() method to Tank01Client in src/client.ts
- [ ] T044 [US2] Add comprehensive JSDoc to getNFLDepthCharts()
- [ ] T045 [US2] Create test file src/teams/**tests**/getNFLDepthCharts.test.ts
- [ ] T046 [US2] Add example in examples/get-depth-charts.ts
- [ ] T047 [US2] Export getNFLDepthCharts from src/teams/index.ts

**Completion Criteria**: All 3 teams endpoints accept correct parameters, OR validation works, JSDoc complete, tests pass.

---

## Phase 5: User Story 2b - Fix Players Endpoint Parameters (11 tasks)

**Story Goal**: getNFLPlayerInfo has correct parameters with OR validation, getNFLPlayerList unchanged.

**Independent Test**: Can call with playerName OR playerID (but not both/neither).

### getNFLPlayerInfo (OR validation)

- [ ] T048 [P] [US2] Update GetPlayerInfoOptions interface in src/players/types.ts with playerName OR playerID + getStats
- [ ] T049 [P] [US2] Update zod schema for GetPlayerInfoOptions in src/players/schemas.ts
- [ ] T050 [US2] Add validateOneOf(['playerName', 'playerID']) call in src/players/getNFLPlayerInfo.ts
- [ ] T051 [US2] Update getNFLPlayerInfo() to handle either parameter type
- [ ] T052 [US2] Add comprehensive JSDoc with OR requirement and examples for both parameter types
- [ ] T053 [US2] Update tests to verify OR validation throws TypeError appropriately
- [ ] T054 [US2] Update example in examples/get-player.ts to show both playerName and playerID usage

### getNFLGamesForPlayer (NEW endpoint)

- [ ] T055 [P] [US2] Create src/players/getNFLGamesForPlayer.ts with implementation
- [ ] T056 [P] [US2] Add PlayerGameLog types in src/players/types.ts
- [ ] T057 [P] [US2] Add zod schema for player game log response in src/players/schemas.ts
- [ ] T058 [US2] Add GetGamesForPlayerOptions interface with playerID, teamID, gameID, itemFormat, numberOfGames, fantasyPoints (optional, defaults to false when omitted)
- [ ] T059 [US2] Add getNFLGamesForPlayer() method to Tank01Client in src/client.ts
- [ ] T060 [US2] Add comprehensive JSDoc with all parameter descriptions
- [ ] T061 [US2] Create test file src/players/**tests**/getNFLGamesForPlayer.test.ts
- [ ] T062 [US2] Add example in examples/get-player-games.ts
- [ ] T063 [US2] Export getNFLGamesForPlayer from src/players/index.ts

**Completion Criteria**: getNFLPlayerInfo OR validation works, getNFLGamesForPlayer functional, JSDoc complete, tests pass.

---

## Phase 6: User Story 2c - Fix Games Endpoint Parameters (15 tasks)

**Story Goal**: All games endpoints have correct parameters including 2 new endpoints.

**Independent Test**: Can call each endpoint with correct parameters and verify responses.

### getNFLGamesForWeek (add seasonType param)

- [ ] T064 [P] [US2] Update GetGamesForWeekOptions interface in src/games/types.ts with week (required), seasonType, season
- [ ] T065 [P] [US2] Update zod schema for GetGamesForWeekOptions in src/games/schemas.ts
- [ ] T066 [US2] Update getNFLGamesForWeek() implementation in src/games/getNFLGamesForWeek.ts
- [ ] T067 [US2] Add comprehensive JSDoc with seasonType options ("reg", "post", "pre", "all")
- [ ] T068 [US2] Update tests to verify seasonType parameter works
- [ ] T069 [US2] Update example in examples/get-games-week.ts to show playoff usage

### getNFLScoresOnly (NEW endpoint)

- [ ] T070 [P] [US2] Create src/games/getNFLScoresOnly.ts with implementation
- [ ] T071 [P] [US2] Add ScoreOnly types in src/games/types.ts
- [ ] T072 [P] [US2] Add zod schema for scores response in src/games/schemas.ts
- [ ] T073 [US2] Add GetScoresOnlyOptions interface with gameDate, gameID, topPerformers, gameWeek, season, seasonType
- [ ] T074 [US2] Add getNFLScoresOnly() method to Tank01Client in src/client.ts
- [ ] T075 [US2] Add comprehensive JSDoc documenting default behavior (current day scores)
- [ ] T076 [US2] Create test file src/games/**tests**/getNFLScoresOnly.test.ts
- [ ] T077 [US2] Add example in examples/get-scores.ts
- [ ] T078 [US2] Export getNFLScoresOnly from src/games/index.ts

### getNFLGamesForDate (NEW endpoint)

- [ ] T079 [P] [US2] Create src/games/getNFLGamesForDate.ts with implementation requiring gameDate parameter
- [ ] T080 [P] [US2] Add types for games by date response in src/games/types.ts
- [ ] T081 [P] [US2] Add zod schema in src/games/schemas.ts
- [ ] T082 [US2] Add getNFLGamesForDate(gameDate: string) method to Tank01Client
- [ ] T083 [US2] Add comprehensive JSDoc with YYYYMMDD format documentation
- [ ] T084 [US2] Create test file src/games/**tests**/getNFLGamesForDate.test.ts
- [ ] T085 [US2] Add example in examples/get-games-by-date.ts
- [ ] T086 [US2] Export getNFLGamesForDate from src/games/index.ts

**Completion Criteria**: All 5 games endpoints functional with correct parameters, JSDoc complete, tests pass.

---

## Phase 7: User Story 2d - Fix Live Endpoint Parameters (6 tasks)

**Story Goal**: getNFLBoxScore has correct parameters (playByPlay, fantasyPoints).

**Independent Test**: Can request box score with/without play-by-play and fantasy points.

### getNFLBoxScore (add 2 params)

- [ ] T087 [P] [US2] Update GetBoxScoreOptions interface in src/live/types.ts with gameID, playByPlay, fantasyPoints
- [ ] T088 [P] [US2] Update zod schema for GetBoxScoreOptions in src/live/schemas.ts
- [ ] T089 [US2] Update getNFLBoxScore() implementation in src/live/getNFLBoxScore.ts
- [ ] T090 [US2] Add comprehensive JSDoc documenting playByPlay and fantasyPoints parameters
- [ ] T091 [US2] Update tests in src/live/**tests**/getNFLBoxScore.test.ts
- [ ] T092 [US2] Update example in examples/get-box-score.ts showing both parameters

**Completion Criteria**: getNFLBoxScore accepts playByPlay and fantasyPoints params, JSDoc complete, tests pass.

---

## Phase 8: User Story 3 - Remove Non-Existent Endpoints (9 tasks)

**Story Goal**: Remove 7 fake endpoints that don't exist in Tank01 API.

**Independent Test**: Attempting to import/use removed methods causes TypeScript compilation errors.

### Remove from Players

- [ ] T093 [US3] Delete src/players/getNFLPlayerStats.ts file
- [ ] T094 [US3] Remove getNFLPlayerStats export from src/players/index.ts
- [ ] T095 [US3] Remove getNFLPlayerStats() method from Tank01Client in src/client.ts
- [ ] T096 [US3] Delete src/players/**tests**/getNFLPlayerStats.test.ts
- [ ] T097 [US3] Remove getNFLPlayerStats example from examples/

### Remove from Live

- [ ] T098 [US3] Delete src/live/getNFLGamesLive.ts file
- [ ] T099 [US3] Delete src/live/getNFLPlayByPlay.ts file
- [ ] T100 [US3] Remove both exports from src/live/index.ts
- [ ] T101 [US3] Remove both methods from Tank01Client in src/client.ts
- [ ] T102 [US3] Delete associated test files and examples

### Remove Stats Folder (all fake)

- [ ] T103 [US3] Delete entire src/stats/ directory (all 4 endpoints fake: getTeamStats, getPlayerAdvancedStats, getTeamRankings, getPlayerProjections)
- [ ] T104 [US3] Remove stats imports from src/client.ts
- [ ] T105 [US3] Delete all stats examples from examples/
- [ ] T106 [US3] Verify npm run build succeeds with removals

**Completion Criteria**: All 7 fake endpoints removed, no TypeScript errors, imports fail as expected.

---

## Phase 9: User Story 4a - Add Fantasy Endpoints (16 tasks)

**Story Goal**: Add getNFLADP, getNFLProjections, getNFLDFS endpoints.

**Independent Test**: Can call each endpoint with correct parameters and get validated responses.

### Create Fantasy Feature Folder

- [ ] T107 [P] [US4] Create src/fantasy/ directory structure
- [ ] T108 [P] [US4] Create src/fantasy/index.ts with exports
- [ ] T109 [P] [US4] Create src/fantasy/types.ts for all fantasy-related types
- [ ] T110 [P] [US4] Create src/fantasy/schemas.ts for zod schemas
- [ ] T111 [P] [US4] Create src/fantasy/**tests**/ directory

### getNFLADP

- [ ] T112 [P] [US4] Create src/fantasy/getNFLADP.ts with implementation
- [ ] T113 [US4] Add ADPOptions interface with adpType (required), adpDate, pos, filterOut in src/fantasy/types.ts
- [ ] T114 [US4] Add zod schema for ADP response with validation for adpType enum values
- [ ] T115 [US4] Add getNFLADP(adpType, options?) method to Tank01Client
- [ ] T116 [US4] Add comprehensive JSDoc with adpType values ("halfPPR", "PPR", "standard", "bestBall", "IDP", "superFlex")
- [ ] T117 [US4] Create test file src/fantasy/**tests**/getNFLADP.test.ts
- [ ] T118 [US4] Add example in examples/get-adp.ts
- [ ] T119 [US4] Export from src/fantasy/index.ts

### getNFLProjections

- [ ] T120 [P] [US4] Create src/fantasy/getNFLProjections.ts with implementation
- [ ] T121 [US4] Add ProjectionsOptions interface with week, playerID, teamID, archiveSeason, itemFormat in src/fantasy/types.ts
- [ ] T122 [US4] Add zod schema for projections response
- [ ] T123 [US4] Add getNFLProjections(options?) method to Tank01Client
- [ ] T124 [US4] Add comprehensive JSDoc documenting parameter overrides (playerID overrides week/teamID, etc.)
- [ ] T125 [US4] Create test file src/fantasy/**tests**/getNFLProjections.test.ts
- [ ] T126 [US4] Add example in examples/get-projections.ts
- [ ] T127 [US4] Export from src/fantasy/index.ts

### getNFLDFS

- [ ] T128 [P] [US4] Create src/fantasy/getNFLDFS.ts with implementation
- [ ] T129 [US4] Add DFSOptions interface with date (required), includeTeamDefense in src/fantasy/types.ts
- [ ] T130 [US4] Add zod schema for DFS response
- [ ] T131 [US4] Add getNFLDFS(date, options?) method to Tank01Client
- [ ] T132 [US4] Add comprehensive JSDoc with YYYYMMDD format requirement
- [ ] T133 [US4] Create test file src/fantasy/**tests**/getNFLDFS.test.ts
- [ ] T134 [US4] Add example in examples/get-dfs.ts
- [ ] T135 [US4] Export from src/fantasy/index.ts

**Completion Criteria**: All 3 fantasy endpoints functional, zod validation working, JSDoc complete, tests pass.

---

## Phase 10: User Story 4b - Add Odds Endpoint (10 tasks)

**Story Goal**: Add getNFLBettingOdds endpoint with OR validation.

**Independent Test**: Can call with gameDate OR gameID (but not both/neither).

### Create Odds Feature Folder

- [ ] T136 [P] [US4] Create src/odds/ directory structure
- [ ] T137 [P] [US4] Create src/odds/index.ts with exports
- [ ] T138 [P] [US4] Create src/odds/types.ts for betting-related types
- [ ] T139 [P] [US4] Create src/odds/schemas.ts for zod schemas
- [ ] T140 [P] [US4] Create src/odds/**tests**/ directory

### getNFLBettingOdds (OR validation)

- [ ] T141 [P] [US4] Create src/odds/getNFLBettingOdds.ts with implementation
- [ ] T142 [US4] Add BettingOddsOptions interface with gameDate OR gameID (required), itemFormat, impliedTotals, playerProps, playerID
- [ ] T143 [US4] Add validateOneOf(['gameDate', 'gameID']) call in implementation
- [ ] T144 [US4] Add zod schema for betting odds response with nested sportsbook data
- [ ] T145 [US4] Add getNFLBettingOdds(gameDate|gameID, options?) method to Tank01Client
- [ ] T146 [US4] Add comprehensive JSDoc documenting OR requirement and all optional parameters
- [ ] T147 [US4] Create test file src/odds/**tests**/getNFLBettingOdds.test.ts with OR validation tests
- [ ] T148 [US4] Add example in examples/get-odds.ts showing both gameDate and gameID usage
- [ ] T149 [US4] Export from src/odds/index.ts

**Completion Criteria**: Betting odds endpoint functional with OR validation, zod schemas work, JSDoc complete, tests pass.

---

## Phase 11: User Story 4c - Add News Endpoint (9 tasks)

**Story Goal**: Add getNFLNews endpoint with filtering options.

**Independent Test**: Can filter news by player, team, and news type.

### Create News Feature Folder

- [ ] T150 [P] [US4] Create src/news/ directory structure
- [ ] T151 [P] [US4] Create src/news/index.ts with exports
- [ ] T152 [P] [US4] Create src/news/types.ts for news-related types
- [ ] T153 [P] [US4] Create src/news/schemas.ts for zod schemas
- [ ] T154 [P] [US4] Create src/news/**tests**/ directory

### getNFLNews

- [ ] T155 [P] [US4] Create src/news/getNFLNews.ts with implementation
- [ ] T156 [US4] Add NewsOptions interface with playerID, teamID, teamAbv, topNews, fantasyNews, recentNews, maxItems
- [ ] T157 [US4] Add zod schema for news response with article structure
- [ ] T158 [US4] Add getNFLNews(options?) method to Tank01Client
- [ ] T159 [US4] Add comprehensive JSDoc documenting all filtering options
- [ ] T160 [US4] Create test file src/news/**tests**/getNFLNews.test.ts
- [ ] T161 [US4] Add example in examples/get-news.ts showing team and player filters
- [ ] T162 [US4] Export from src/news/index.ts

**Completion Criteria**: News endpoint functional with all filters, zod validation works, JSDoc complete, tests pass.

---

## Phase 12: User Story 4d - Add Info Endpoint (9 tasks)

**Story Goal**: Add getNFLCurrentInfo endpoint for season/week information.

**Independent Test**: Can retrieve current NFL season info with optional date parameter.

### Create Info Feature Folder

- [ ] T163 [P] [US4] Create src/info/ directory structure
- [ ] T164 [P] [US4] Create src/info/index.ts with exports
- [ ] T165 [P] [US4] Create src/info/types.ts for info-related types
- [ ] T166 [P] [US4] Create src/info/schemas.ts for zod schemas
- [ ] T167 [P] [US4] Create src/info/**tests**/ directory

### getNFLCurrentInfo

- [ ] T168 [P] [US4] Create src/info/getNFLCurrentInfo.ts with implementation
- [ ] T169 [US4] Add CurrentInfo type with season, week, seasonType fields
- [ ] T170 [US4] Add zod schema for current info response
- [ ] T171 [US4] Add getNFLCurrentInfo(date?) method to Tank01Client
- [ ] T172 [US4] Add comprehensive JSDoc documenting optional date parameter (YYYYMMDD format)
- [ ] T173 [US4] Create test file src/info/**tests**/getNFLCurrentInfo.test.ts
- [ ] T174 [US4] Add example in examples/get-current-info.ts
- [ ] T175 [US4] Export from src/info/index.ts

**Completion Criteria**: Current info endpoint functional, zod validation works, JSDoc complete, tests pass.

---

## Phase 13: Documentation & Migration Guide (8 tasks)

**Goal**: Complete all user-facing documentation with migration guidance.

- [ ] T176 Update README.md with complete API reference for all 30 methods
- [ ] T177 Add "Breaking Changes in v0.2.0" section to README.md
- [ ] T178 Create detailed migration guide with before/after code examples for all changed endpoints
- [ ] T179 Document OR parameter validation behavior with examples
- [ ] T180 Update all JSDoc @example blocks to use realistic 49ers data (Brock Purdy #4381786, team "SF")
- [ ] T181 Create CHANGELOG.md entry for v0.2.0 with all breaking changes listed
- [ ] T182 Update package.json version to 0.2.0
- [ ] T183 Update API reference documentation with all new endpoints categorized by feature

---

## Phase 14: Testing & Quality (12 tasks)

**Goal**: Comprehensive test coverage including minimal contract tests.

### Unit Tests

- [ ] T184 [P] Run full unit test suite: npm test
- [ ] T185 [P] Verify test coverage >80% with npm run test:coverage
- [ ] T186 Fix any failing unit tests from refactor
- [ ] T187 Add missing unit tests for edge cases (empty parameters, invalid formats)

### Contract Tests (Minimal - API Quota Aware)

- [ ] T188 Create tests/contract/ directory
- [ ] T189 Create tests/contract/README.md documenting quota limits, manual execution, and priority endpoint list (see plan.md Contract Test Priority section for 8-endpoint list totaling ~50 requests)
- [ ] T190 [P] Create tests/contract/teams.contract.test.ts testing getNFLTeams and getNFLTeamRoster
- [ ] T191 [P] Create tests/contract/players.contract.test.ts testing getNFLPlayerInfo with both playerName and playerID
- [ ] T192 [P] Create tests/contract/games.contract.test.ts testing getNFLGamesForWeek and getNFLScoresOnly
- [ ] T193 [P] Create tests/contract/fantasy.contract.test.ts testing getNFLADP and getNFLProjections
- [ ] T194 [P] Create tests/contract/odds.contract.test.ts testing getNFLBettingOdds with OR validation
- [ ] T195 Run contract tests manually: npm run test:contract (verify <100 API requests)
- [ ] T196 Document contract test execution in README (manual only, not in CI)

### Build & Type Checking

- [ ] T197 Run TypeScript type check: npm run typecheck (verify zero errors)
- [ ] T198 Run full build: npm run build (verify CJS + ESM outputs)
- [ ] T199 Verify package size increase <20% compared to v0.1.0
- [ ] T200 Run ESLint: npm run lint (verify zero warnings)

---

## Phase 15: Final Polish & Release Preparation (5 tasks)

**Goal**: Prepare for v0.2.0 release.

- [ ] T201 Review all examples/ files ensure they use correct flat interface
- [ ] T202 Update all examples to use San Francisco 49ers data consistently
- [ ] T203 Run final Constitution Check verification (all gates must pass)
- [ ] T204 Generate final build and verify dist/ contents (index.js, index.cjs, index.d.ts)
- [ ] T205 Create git tag v0.2.0 and push to remote

---

## Dependencies & Parallel Execution

### Critical Path (Must Complete in Order)

1. Phase 1 (Setup) → Phase 2 (Remove Nested Clients) → All other phases
2. Phase 2 must complete before any user story work begins

### Parallelizable Work

After Phase 2 completes, these can run in parallel:

- **Group A** (User Story 2 - Parameter Fixes):
  - Phase 4 (Teams parameters)
  - Phase 5 (Players parameters)
  - Phase 6 (Games parameters)
  - Phase 7 (Live parameters)

- **Group B** (User Story 3 - Removals):
  - Phase 8 (Remove fake endpoints) - can run alongside Group A

- **Group C** (User Story 4 - New Endpoints):
  - Phase 9 (Fantasy endpoints)
  - Phase 10 (Odds endpoint)
  - Phase 11 (News endpoint)
  - Phase 12 (Info endpoint)
  - All 4 phases can run in parallel after Phase 2

- **Group D** (Final):
  - Phase 13 (Documentation) - can start once Phases 4-12 complete
  - Phase 14 (Testing) - requires all implementation phases complete
  - Phase 15 (Release) - requires Phase 14 complete

### Parallel Execution Examples

**After Phase 2 Completes**:

```
Can work on simultaneously:
- T026-T047 (Teams endpoints)
- T048-T063 (Players endpoints)
- T093-T106 (Remove fake endpoints)
- T107-T135 (Fantasy folder creation + all 3 endpoints)
```

**After All Implementation (Phases 4-12)**:

```
Can work on simultaneously:
- T176-T183 (Documentation)
- T184-T200 (Testing)
```

---

## Implementation Strategy

### MVP Approach

**Minimum Viable Product** (can ship after):

- Phase 1: Setup ✓
- Phase 2: Flat interface ✓
- Phase 4: Teams parameters ✓
- Phase 5: Players parameters ✓
- Phase 6: Games parameters ✓
- Phase 7: Live parameters ✓
- Phase 8: Remove fakes ✓
- Phase 13: Documentation ✓
- Phase 14: Testing ✓

**Incremental Additions** (can ship later):

- Phase 9: Fantasy endpoints (nice to have)
- Phase 10: Odds endpoint (nice to have)
- Phase 11: News endpoint (nice to have)
- Phase 12: Info endpoint (nice to have)

### Task Execution Tips

1. **Use [P] markers**: Tasks marked [P] can be done in parallel with other [P] tasks in the same phase
2. **Complete phases fully**: Don't jump between phases - finish each phase's user story completely
3. **Test as you go**: Run tests after each endpoint implementation, don't wait until Phase 14
4. **Commit frequently**: Commit after completing each phase for easy rollback if needed
5. **Review JSDoc**: Ensure every public method has comprehensive documentation before moving on

---

## Progress Tracking

**Suggested Completion Order**:

Week 1 Day 1:

- [ ] Phase 1 (Setup) - 30 min
- [ ] Phase 2 (Flat interface) - 2-3 hours
- [ ] Phase 4 (Teams) - 2 hours

Week 1 Day 2:

- [ ] Phase 5 (Players) - 2 hours
- [ ] Phase 6 (Games) - 2 hours
- [ ] Phase 7 (Live) - 1 hour
- [ ] Phase 8 (Removals) - 1 hour

Week 1 Day 3:

- [ ] Phase 9 (Fantasy) - 3 hours
- [ ] Phase 10 (Odds) - 2 hours
- [ ] Phase 11 (News) - 1.5 hours
- [ ] Phase 12 (Info) - 1.5 hours

Week 2 Day 1:

- [ ] Phase 13 (Documentation) - 2 hours
- [ ] Phase 14 (Testing) - 3 hours
- [ ] Phase 15 (Release) - 1 hour

**Total Estimated Time**: 24-28 hours over 4 days

---

## Notes

**Critical Reminders**:

- All `fantasyPoints` parameters default to `false`
- OR parameters must use `validateOneOf()` helper and throw descriptive TypeErrors
- Date parameters always use `YYYYMMDD` string format (not Date objects)
- GameID format: `YYYYMMDD_AWAY@HOME`
- Contract tests must stay under 100 API requests total
- All methods need comprehensive JSDoc with @example blocks
- Use San Francisco 49ers (Brock Purdy #4381786, team "SF") in all examples

**Quality Gates**:

- TypeScript must compile with zero errors
- ESLint must pass with zero warnings
- Test coverage must be >80%
- All JSDoc must be complete
- Package size increase <20%
- Contract tests <100 API requests

---

**Ready to begin implementation!** Start with Phase 1: Setup & Infrastructure.
