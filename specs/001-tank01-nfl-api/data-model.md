# Data Model: Tank01 NFL API Client

**Feature**: Tank01 NFL API Client  
**Date**: 2025-11-20  
**Purpose**: Define all data entities, their relationships, and validation rules

## Entity Overview

This document defines the TypeScript interfaces and zod schemas for all entities used in the Tank01 NFL client. Each entity represents a domain concept from the NFL API.

---

## Configuration Entities

### ClientConfiguration

**Purpose**: Configuration options for initializing the Tank01 client

**Attributes**:

- `apiKey`: string (required) - Tank01/RapidAPI authentication key
- `baseUrl`: string (optional) - API base URL, defaults to Tank01 endpoint
- `timeout`: number (optional) - Request timeout in milliseconds, default 30000
- `maxRetries`: number (optional) - Maximum retry attempts, default 3
- `debug`: boolean (optional) - Enable debug logging, default false

**Validation Rules**:

- `apiKey` must be non-empty string
- `timeout` must be positive integer
- `maxRetries` must be non-negative integer
- `baseUrl` must be valid URL if provided

**Relationships**: Root configuration for Tank01Client instance

---

## Core NFL Entities

### Team

**Purpose**: Represents an NFL team with identifying information and metadata

**Attributes**:

- `teamID`: string (required) - Unique team identifier/abbreviation (e.g., "KC", "PHI")
- `teamName`: string (required) - Full team name (e.g., "Kansas City Chiefs")
- `teamCity`: string (required) - Team's city
- `teamAbv`: string (required) - Team abbreviation
- `conference`: string (required) - "AFC" or "NFC"
- `division`: string (required) - Division name (e.g., "West", "East")
- `wins`: number (optional) - Season wins
- `losses`: number (optional) - Season losses
- `ties`: number (optional) - Season ties
- `seasonYear`: string (optional) - Current season year

**Validation Rules**:

- `teamID` must be 2-3 uppercase letters
- `conference` must be enum ["AFC", "NFC"]
- `division` must be enum ["North", "South", "East", "West"]
- Win/loss/tie counts must be non-negative integers

**Relationships**:

- Has many Players (roster)
- Has many Games (schedule)
- Referenced by Player.team

---

### Player

**Purpose**: Represents an NFL player with biographical and team information

**Attributes**:

- `playerID`: string (required) - Unique player identifier
- `espnID`: string (optional) - ESPN player ID
- `longName`: string (required) - Player's full name
- `firstName`: string (optional) - First name
- `lastName`: string (optional) - Last name
- `team`: string (required) - Team abbreviation
- `teamID`: string (required) - Team identifier
- `pos`: string (required) - Position abbreviation (e.g., "QB", "RB", "WR")
- `jerseyNum`: string (optional) - Jersey number
- `height`: string (optional) - Height (e.g., "6-2")
- `weight`: string (optional) - Weight in pounds
- `age`: number (optional) - Player age
- `college`: string (optional) - College attended
- `exp`: string (optional) - Years of experience
- `injury`: object (optional) - Injury status information

**Validation Rules**:

- `playerID` must be non-empty string
- `pos` must be valid NFL position code (see valid codes below)
- `age` must be positive integer if provided
- `jerseyNum` must be valid jersey number (0-99)

**Valid Position Codes**:

- **Offense**: QB (Quarterback), RB (Running Back), FB (Fullback), WR (Wide Receiver), TE (Tight End), OT (Offensive Tackle), OG (Offensive Guard), C (Center), OL (Offensive Line - generic)
- **Defense**: DT (Defensive Tackle), DE (Defensive End), DL (Defensive Line - generic), MLB (Middle Linebacker), OLB (Outside Linebacker), LB (Linebacker - generic), CB (Cornerback), FS (Free Safety), SS (Strong Safety), S (Safety - generic), DB (Defensive Back - generic)
- **Special Teams**: K (Kicker), P (Punter), LS (Long Snapper)

**Relationships**:

- Belongs to Team
- Has many PlayerStatistics (seasonal/game stats)
- Referenced in Game.players

---

### PlayerStatistics

**Purpose**: Player performance statistics for a season or game

**Attributes**:

**Passing Stats** (for QBs):

- `passAttempts`: number - Pass attempts
- `passCompletions`: number - Completed passes
- `passYards`: number - Passing yards
- `passTD`: number - Passing touchdowns
- `int`: number - Interceptions
- `sacks`: number - Times sacked
- `QBRating`: number - QB rating

**Rushing Stats**:

- `rushAttempts`: number - Rushing attempts
- `rushYards`: number - Rushing yards
- `rushTD`: number - Rushing touchdowns
- `longRush`: number - Longest rush

**Receiving Stats** (for WR/TE/RB):

- `receptions`: number - Receptions
- `targets`: number - Times targeted
- `recYards`: number - Receiving yards
- `recTD`: number - Receiving touchdowns
- `longRec`: number - Longest reception

**Defensive Stats**:

- `tackles`: number - Total tackles
- `soloTackles`: number - Solo tackles
- `sacks`: number - Sacks
- `defensiveINT`: number - Interceptions
- `fumblesRecovered`: number - Fumbles recovered
- `forcedFumbles`: number - Forced fumbles

**Kicking Stats**:

- `fgMade`: number - Field goals made
- `fgAttempts`: number - Field goal attempts
- `xpMade`: number - Extra points made
- `xpAttempts`: number - Extra point attempts

**Common Attributes**:

- `playerID`: string (required) - Reference to player
- `season`: string (required) - Season year
- `week`: number (optional) - Week number if game-specific
- `gameID`: string (optional) - Game identifier if game-specific

**Validation Rules**:

- All numeric stats must be non-negative
- Completions cannot exceed attempts
- Made kicks cannot exceed attempts

**Relationships**:

- Belongs to Player
- Optionally belongs to Game (if game-specific stats)

---

### Game

**Purpose**: Represents an NFL game with teams, timing, and venue information

**Attributes**:

- `gameID`: string (required) - Unique game identifier
- `season`: string (required) - Season year (e.g., "2024")
- `seasonType`: string (required) - "reg", "pre", or "post"
- `week`: number (required) - Week number
- `gameDate`: string (required) - ISO 8601 date/time
- `gameTime`: string (required) - Game time
- `homeTeam`: string (required) - Home team abbreviation
- `awayTeam`: string (required) - Away team abbreviation
- `homeTeamID`: string (required) - Home team identifier
- `awayTeamID`: string (required) - Away team identifier
- `homeScore`: number (optional) - Home team score
- `awayScore`: number (optional) - Away team score
- `gameStatus`: string (required) - "Scheduled", "InProgress", "Final"
- `gameStatusCode`: string (optional) - Status code
- `neutralSite`: boolean (optional) - Played at neutral location
- `venue`: string (optional) - Stadium/venue name
- `gameWeather`: object (optional) - Weather conditions

**Validation Rules**:

- `seasonType` must be enum ["reg", "pre", "post"]
- `week` must be positive integer (1-18 for reg, 1-4 for pre, 1-4 for post)
- `gameStatus` must be enum ["Scheduled", "InProgress", "Final", "Postponed", "Cancelled"]
- Scores must be non-negative integers
- `gameDate` must be valid ISO 8601 date string

**Relationships**:

- References homeTeam (Team)
- References awayTeam (Team)
- Has one GameScore
- Has many PlayerStatistics (game-specific stats)
- May have LiveGameData if in progress

---

### GameScore

**Purpose**: Detailed scoring information for a game

**Attributes**:

- `gameID`: string (required) - Reference to game
- `homeScore`: number (required) - Total home score
- `awayScore`: number (required) - Total away score
- `homeQ1`: number (optional) - Home 1st quarter score
- `homeQ2`: number (optional) - Home 2nd quarter score
- `homeQ3`: number (optional) - Home 3rd quarter score
- `homeQ4`: number (optional) - Home 4th quarter score
- `homeOT`: number (optional) - Home overtime score
- `awayQ1`: number (optional) - Away 1st quarter score
- `awayQ2`: number (optional) - Away 2nd quarter score
- `awayQ3`: number (optional) - Away 3rd quarter score
- `awayQ4`: number (optional) - Away 4th quarter score
- `awayOT`: number (optional) - Away overtime score

**Validation Rules**:

- All scores must be non-negative integers
- Quarterly scores should sum to total (validation warning if mismatch)

**Relationships**:

- Belongs to Game (one-to-one)

---

### LiveGameData

**Purpose**: Real-time game state for games in progress

**Attributes**:

- `gameID`: string (required) - Reference to game
- `gameStatus`: string (required) - Current game status
- `gameClock`: string (required) - Time remaining in quarter (e.g., "10:23")
- `currentQuarter`: number (required) - Current quarter (1-4, 5 for OT)
- `possession`: string (optional) - Team abbreviation with possession
- `down`: number (optional) - Current down (1-4)
- `yardsToGo`: number (optional) - Yards to first down
- `yardLine`: string (optional) - Field position (e.g., "OPP 25")
- `homeScore`: number (required) - Current home score
- `awayScore`: number (required) - Current away score
- `lastPlay`: string (optional) - Description of last play
- `redZone`: boolean (optional) - Ball in red zone

**Validation Rules**:

- `currentQuarter` must be integer 1-5
- `down` must be integer 1-4 if present
- `yardsToGo` must be positive integer if present
- `gameClock` must match time format "MM:SS"

**Relationships**:

- Belongs to Game (one-to-one for in-progress games)

---

### Schedule

**Purpose**: Collection of games for a specific time period

**Attributes**:

- `season`: string (required) - Season year
- `seasonType`: string (required) - Season type
- `week`: number (optional) - Week number if weekly schedule
- `games`: Game[] (required) - Array of Game objects
- `lastUpdated`: string (optional) - ISO timestamp of last update

**Validation Rules**:

- `games` array must not be empty
- All games must have matching season/seasonType/week if weekly

**Relationships**:

- Contains many Games

---

### AdvancedStatistics

**Purpose**: Calculated advanced metrics and analytics

**Attributes**:

- `playerID`: string (required) - Reference to player
- `season`: string (required) - Season year
- `gamesPlayed`: number - Games played
- `yardsPerAttempt`: number (optional) - Yards per pass/rush attempt
- `completionPercentage`: number (optional) - Pass completion %
- `passerRating`: number (optional) - QB rating
- `yardsPerReception`: number (optional) - Avg yards per reception
- `catchPercentage`: number (optional) - Receptions / targets %
- `rushYardsPerGame`: number (optional) - Rush yards per game
- `redZoneTargets`: number (optional) - Targets in red zone
- `redZoneReceptions`: number (optional) - Receptions in red zone
- `redZoneTD`: number (optional) - TDs in red zone

**Validation Rules**:

- Percentages must be between 0-100
- Rates and averages must be non-negative

**Relationships**:

- Belongs to Player
- Derived from PlayerStatistics

---

## Error Entities

### Tank01Error

**Purpose**: Base error class for all client errors

**Attributes**:

- `name`: string - Error type name
- `message`: string - Error description
- `statusCode`: number (optional) - HTTP status code if applicable
- `cause`: Error (optional) - Original error cause
- `context`: object (optional) - Additional error context

**Derived Types**:

- `Tank01AuthenticationError` (401/403)
- `Tank01NotFoundError` (404)
- `Tank01RateLimitError` (429)
- `Tank01ValidationError` (schema validation failure)
- `Tank01NetworkError` (network/timeout)
- `Tank01ApiError` (other API errors)

---

## Entity Relationship Diagram

```
┌─────────────────┐
│ Tank01Client    │
│ (Configuration) │
└────────┬────────┘
         │
         │ uses
         │
    ┌────▼────┐      ┌──────────┐
    │  Team   │◄────┤  Player  │
    └────┬────┘      └─────┬────┘
         │                 │
         │ plays in        │ has stats
         │                 │
    ┌────▼────┐      ┌─────▼──────────┐
    │  Game   │◄────┤ PlayerStatistics│
    └────┬────┘      └────────────────┘
         │
         ├─────────────┐
         │             │
    ┌────▼────┐   ┌───▼──────────┐
    │GameScore│   │LiveGameData  │
    └─────────┘   └──────────────┘
```

## Implementation Notes

### Zod Schema Strategy

1. Define base zod schemas in `schemas.ts` files within each feature folder
2. Export both the zod schema and inferred TypeScript type
3. Use `.strict()` to catch unexpected API fields
4. Implement schema composition for reusable patterns
5. Add custom refinements for business logic validation

### Type Derivation Pattern

```typescript
// Define zod schema
export const TeamSchema = z
  .object({
    teamID: z.string().min(2).max(3),
    teamName: z.string(),
    conference: z.enum(["AFC", "NFC"]),
    // ... other fields
  })
  .strict();

// Derive TypeScript type
export type Team = z.infer<typeof TeamSchema>;
```

### Optional vs Required Fields

- API documentation may not perfectly specify required fields
- Use `.optional()` for fields that may be missing in responses
- Use `.nullable()` for fields that may be explicitly null
- Document any discrepancies found during contract testing

### Future Extensibility

- Design for adding new statistics categories
- Support for additional seasons and season types
- Accommodate API version changes
- Plan for playoff-specific fields
- Consider historical data differences
