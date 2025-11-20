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
import { Tank01Client } from "tank01-nfl-client";

const client = new Tank01Client({
  apiKey: "your_api_key_here",
  timeout: 30000, // optional, defaults to 30s
  retries: 3, // optional, defaults to 3
});
```

## Usage

```typescript
import { Tank01Client } from "tank01-nfl-client";

// Initialize client
const client = new Tank01Client();

// Example usage (will be expanded as features are implemented)
const playerStats = await client.players.getStats("player-id");
const teamRoster = await client.teams.getRoster("team-id");
const gameDetails = await client.games.getDetails("game-id");
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
