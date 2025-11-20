# Research & Technology Decisions: Tank01 NFL API Client

**Feature**: Tank01 NFL API Client  
**Date**: 2025-11-20  
**Purpose**: Document technology choices, API research, and implementation approaches

## Phase 0: Research Findings

### HTTP Client Selection

**Decision**: Use `node-fetch` v3.x

**Rationale**:

- Native fetch API compatibility (familiar to developers)
- Well-maintained with strong TypeScript support
- Lightweight and focused (no unnecessary features)
- Works seamlessly with async/await patterns
- Widely adopted in the Node.js ecosystem
- ES Module first with CommonJS compatibility

**Alternatives Considered**:

- `axios`: More features than needed, larger bundle size, older API patterns
- `got`: Excellent library but heavier, stream-focused which we don't need
- `undici`: Node.js native but requires Node 18+, less mature TypeScript types
- Native Node.js `http`/`https`: Too low-level, would require significant wrapper code

**Implementation Notes**:

- Configure with custom Agent for keep-alive connection reuse
- Wrap in retry logic with exponential backoff
- Add timeout support via AbortController
- Inject Tank01/RapidAPI required headers

---

### Runtime Validation Library

**Decision**: Use `zod` for schema validation

**Rationale**:

- TypeScript-first design with excellent type inference
- Can derive TypeScript types directly from schemas (single source of truth)
- Descriptive error messages for validation failures
- Composable schemas enable reuse across endpoints
- Active development and strong community support
- Minimal performance overhead for validation
- Clear, readable schema definitions

**Alternatives Considered**:

- `io-ts`: Good but more complex API, steeper learning curve
- `yup`: Primarily for form validation, less TypeScript integration
- `joi`: Great for Node.js but doesn't integrate as well with TypeScript types
- `ajv`: JSON Schema based, less intuitive for TypeScript developers
- Manual validation: Error-prone, no type derivation, high maintenance

**Implementation Notes**:

- Define schemas in `schemas.ts` files within each feature folder
- Export both the zod schema and the inferred TypeScript type
- Use `.parse()` for validation, catch errors and re-throw with context
- Leverage `.partial()`, `.pick()`, `.omit()` for schema composition
- Use `.strict()` to catch unexpected fields from API changes

---

### Testing Framework

**Decision**: Use `vitest` as primary testing framework

**Rationale**:

- Native TypeScript and ESM support (no configuration needed)
- Extremely fast test execution with smart watch mode
- Jest-compatible API (easy migration if needed)
- Built-in coverage with c8/v8
- Excellent developer experience with clear error messages
- First-class Vite integration for potential future tooling
- Active development and growing adoption

**Alternatives Considered**:

- `jest`: Mature and widely used, but slower, requires ts-jest configuration
- `ava`: Fast but less familiar API, smaller community
- `mocha` + `chai`: Classic but more configuration, less integrated

**Implementation Notes**:

- Co-locate tests in `__tests__/` folders within feature directories
- Use `vitest.config.ts` for configuration
- Separate test types: `*.test.ts` (unit), `*.integration.test.ts`, `*.contract.test.ts`
- Mock HTTP responses using `vitest.mock()` or `msw` for integration tests
- Use recorded real API responses for contract tests

---

### Build Tooling

**Decision**: Use `tsup` for dual CommonJS/ESM builds

**Rationale**:

- Zero-config TypeScript builds with sensible defaults
- Built on esbuild (extremely fast)
- Automatic dual format output (CJS + ESM)
- Generates type definitions (.d.ts) automatically
- Handles dependencies correctly (external by default)
- Minification and source maps support
- Simple configuration for most use cases

**Alternatives Considered**:

- `tsc` only: Slow, requires separate configs for dual format
- `esbuild` directly: Fast but requires more configuration
- `rollup`: Powerful but overkill for library builds, complex config
- `webpack`: Too heavy for library bundling

**Implementation Notes**:

- Configure in `tsup.config.ts` or `package.json`
- Output to `dist/cjs/` and `dist/esm/`
- Set `package.json` `main`, `module`, and `exports` fields correctly
- Include source maps for debugging
- Minify for production builds

---

### Tank01 NFL API Research

**API Base URL**: `https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com`

**Authentication**: RapidAPI key-based authentication

- Header: `X-RapidAPI-Key: <api-key>`
- Header: `X-RapidAPI-Host: tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com`

**Key Endpoints Identified** (from API documentation):

1. **GET /getNFLTeams** - Retrieve all NFL teams
2. **GET /getPlayerList** - Get comprehensive player list
3. **GET /getNFLGamesForWeek** - Weekly schedule with parameters: `week`, `season`, `seasonType`
4. **GET /getNFLGamesForPlayer** - Player-specific game data with `playerID`
5. **GET /getNFLPlayerInfo** - Player details with `playerID`
6. **GET /getNFLTeamRoster** - Team roster with `teamID`, `getStats`
7. **GET /getNFLTeamSchedule** - Team schedule with `teamID`, `season`
8. **GET /getNFLScoreboard** - Live scores (current games)
9. **GET /getNFLBoxScore** - Detailed game stats with `gameID`
10. **GET /getNFLProjections** - Player projections with `week`, `season`

**Common Query Parameters**:

- `season`: Year (e.g., "2024")
- `seasonType`: "reg" (regular season), "pre" (preseason), "post" (playoffs)
- `week`: Week number (1-18 for regular season)
- `playerID`: Unique player identifier
- `teamID`: Team abbreviation (e.g., "KC", "PHI")
- `gameID`: Unique game identifier

**Response Format**: JSON with consistent structure

- Success responses contain data objects
- Error responses include status codes (401, 404, 429, 500)

**Rate Limiting**: Standard RapidAPI rate limits apply

- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- 429 status code when limit exceeded
- Implement exponential backoff for retries

---

### Error Handling Strategy

**Decision**: Implement typed error hierarchy

**Error Types**:

1. **Tank01AuthenticationError**: 401/403 - Invalid or missing API key
2. **Tank01NotFoundError**: 404 - Resource not found
3. **Tank01RateLimitError**: 429 - Rate limit exceeded
4. **Tank01ValidationError**: Response schema validation failure
5. **Tank01NetworkError**: Network/timeout failures
6. **Tank01ApiError**: Generic API errors (500, unexpected status codes)

**Rationale**:

- Allows consumers to handle specific error types
- Clear error messages with actionable guidance
- Preserves original error context and HTTP status codes
- Enables proper retry logic for transient failures
- Type-safe error handling with TypeScript

**Implementation Notes**:

- All errors extend base `Tank01Error` class
- Include `statusCode`, `message`, `cause`, `context` properties
- Add helper methods like `isRetryable()` for retry logic
- Log errors with appropriate levels (debug for retries, error for unrecoverable)

---

### Retry Logic

**Decision**: Exponential backoff with jitter

**Configuration**:

- Default max retries: 3
- Initial delay: 1000ms
- Backoff multiplier: 2
- Max delay: 30000ms (30 seconds)
- Jitter: ±20% randomization

**Retry Conditions**:

- Network errors (ECONNRESET, ETIMEDOUT, etc.)
- HTTP 429 (rate limit) - respect Retry-After header if present
- HTTP 500, 502, 503, 504 (server errors)
- Timeout errors

**Non-Retry Conditions**:

- HTTP 400 (bad request)
- HTTP 401, 403 (authentication failures)
- HTTP 404 (not found)
- Validation errors (response schema mismatch)

**Rationale**:

- Handles transient failures gracefully
- Prevents thundering herd with jitter
- Respects server rate limiting
- Configurable for different use cases

---

### Code Organization

**Decision**: Feature folder structure with domain-based organization

**Structure**:

```
src/
├── teams/              # Team-related endpoints
├── players/            # Player-related endpoints
├── games/              # Game schedule and results
├── live/               # Live game data
├── stats/              # Advanced statistics
├── common/             # Shared utilities
│   ├── http/          # HTTP client wrapper
│   ├── errors/        # Error classes
│   ├── config/        # Configuration management
│   └── retry/         # Retry logic
└── index.ts           # Main entry point
```

**Rationale**:

- Aligns with Constitution Principle II (Feature Folder Organization)
- Each feature is independently testable and developable
- Clear ownership boundaries for API endpoints
- Shared infrastructure in common/ for reuse
- Mirrors NFL domain concepts (teams, players, games)

---

### Package Configuration

**Decision**: Dual package.json configuration for CJS/ESM

**Key Fields**:

```json
{
  "name": "tank01-nfl-client",
  "type": "module",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/esm/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/cjs/index.js",
      "import": "./dist/esm/index.js",
      "types": "./dist/esm/index.d.ts"
    }
  }
}
```

**Rationale**:

- Supports both CommonJS and ES Module consumers
- Modern package.json `exports` field for proper resolution
- Type definitions included for TypeScript consumers
- Aligns with Node.js best practices

---

## Summary of Key Decisions

| Decision Area     | Choice                       | Justification                                      |
| ----------------- | ---------------------------- | -------------------------------------------------- |
| HTTP Client       | node-fetch v3                | Familiar API, lightweight, good TypeScript support |
| Validation        | zod                          | TypeScript-first, type derivation, clear errors    |
| Testing           | vitest                       | Fast, native TS/ESM support, great DX              |
| Build Tool        | tsup                         | Zero-config, dual format, fast                     |
| Code Organization | Feature folders              | Domain-driven, independent development             |
| Error Handling    | Typed error hierarchy        | Type-safe, actionable errors                       |
| Retry Strategy    | Exponential backoff + jitter | Resilient, respectful of rate limits               |
| Package Format    | Dual CJS/ESM                 | Broad compatibility                                |

## Next Steps (Phase 1)

1. Define data models for all entities (Team, Player, Game, etc.)
2. Create zod schemas for API responses
3. Design client API contracts
4. Create quickstart documentation
5. Update agent context with technology stack
