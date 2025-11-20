# Implementation Plan: Tank01 NFL API Client

**Branch**: `001-tank01-nfl-api` | **Date**: 2025-11-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-tank01-nfl-api/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a comprehensive TypeScript client library for the Tank01 NFL API that exposes all documented endpoints with full type safety, runtime validation, and robust error handling. The client will provide intuitive access to NFL teams, players, games, schedules, live data, and advanced statistics through a feature-organized architecture with node-fetch for HTTP requests and zod for schema validation.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: node-fetch v3.x, zod (runtime validation)
**Storage**: N/A (API client library)
**Testing**: vitest or jest with ts-jest
**Target Platform**: Node.js 18+ (LTS)
**Project Type**: Single TypeScript library (feature-folder organized)
**Performance Goals**: <100ms per API call overhead, connection reuse via keep-alive
**Constraints**: Type-safe API, dual export (CJS + ESM), 80%+ test coverage
**Scale/Scope**: Tank01 NFL API endpoints, published npm package

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Phase 0 Check (Pre-Research)**: ✅ PASSED
**Phase 1 Check (Post-Design)**: ✅ PASSED

### Type Safety First

- [x] All new code uses TypeScript strict mode (no `any` types without justification)
  - _Design confirms_: All entities have explicit TypeScript types derived from zod schemas
- [x] All API responses have corresponding TypeScript interfaces
  - _Design confirms_: data-model.md defines all entity types with complete interfaces
- [x] Function signatures are fully typed (parameters + return values)
  - _Design confirms_: api-contract.md specifies all method signatures with explicit types
- [x] Type guards used for runtime type narrowing where needed
  - _Design confirms_: zod validation provides runtime type narrowing

### Feature Folder Organization

- [x] Code organized by feature/resource, not technical layers
  - _Design confirms_: Structure uses src/teams/, src/players/, src/games/, src/live/, src/stats/
- [x] Each feature folder exports public API via `index.ts`
  - _Design confirms_: Each feature folder includes index.ts for exports
- [x] Shared code appropriately placed in `src/common/` or `src/shared/`
  - _Design confirms_: Common utilities in src/common/ (http, errors, config, retry)

### Comprehensive Testing

- [x] Unit tests cover all public functions
  - _Design confirms_: Each feature has **tests**/ directory for co-located tests
- [x] Integration tests validate API client with mocked responses
  - _Design confirms_: Testing strategy includes integration tests with HTTP mocking
- [x] Contract tests validate response types match schemas
  - _Design confirms_: Contract tests planned with recorded API responses
- [x] Error handling paths are tested
  - _Design confirms_: Error hierarchy designed for testable error scenarios

### API Contract Compliance

- [x] Runtime validation (zod schemas) for all API responses
  - _Design confirms_: All entities have zod schemas for validation
- [x] Type definitions derived from or validated against schemas
  - _Design confirms_: TypeScript types derived from zod schemas using z.infer
- [x] Failed validations throw descriptive errors
  - _Design confirms_: Tank01ValidationError with detailed error messages
- [x] API version compatibility documented
  - _Design confirms_: research.md documents API version handling strategy

### Developer Experience

- [x] TSDoc comments on all public APIs with examples
  - _Design confirms_: api-contract.md includes example usage for all methods
- [x] Error messages are actionable
  - _Design confirms_: Error classes include actionable messages (e.g., "set TANK01_API_KEY")
- [x] Configuration has sensible defaults
  - _Design confirms_: Default timeout 30s, retries 3, optional API key from env
- [x] Naming is clear and consistent (e.g., `getNFLPlayerStats`)
  - _Design confirms_: Method names follow consistent pattern (getTeams, getPlayer, getWeeklySchedule)
- [x] README includes quickstart and API reference
  - _Design confirms_: quickstart.md provides comprehensive getting started guide

### Technical Standards

- [x] Builds without TypeScript errors
  - _Design confirms_: TypeScript 5.x strict mode with tsup build tool
- [x] Passes ESLint with zero warnings
  - _Design confirms_: ESLint with TypeScript rules in tech stack
- [x] Code formatted with Prettier
  - _Design confirms_: Prettier configured for consistent formatting
- [x] Generates `.d.ts` type definition files
  - _Design confirms_: tsup automatically generates type definitions
- [x] 80%+ test coverage achieved
  - _Design confirms_: Vitest with c8 coverage, target 80%+

**Constitution Compliance**: ✅ **ALL GATES PASSED** - No violations, no complexity justifications needed

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# TypeScript Client Library - Feature Folder Structure
src/
├── [feature-name]/           # Feature-based organization (e.g., players/, teams/, games/)
│   ├── index.ts             # Public API exports
│   ├── types.ts             # TypeScript interfaces/types
│   ├── schemas.ts           # Zod validation schemas
│   ├── client.ts            # API client methods
│   ├── utils.ts             # Feature-specific utilities
│   └── __tests__/           # Tests co-located with source
│       ├── client.test.ts
│       ├── schemas.test.ts
│       └── integration.test.ts
├── common/                   # Shared utilities
│   ├── http/                # HTTP client wrapper
│   ├── errors/              # Custom error types
│   └── utils/               # Common utilities
├── types/                    # Global type definitions
└── index.ts                 # Main package entry point

tests/                        # Alternative: separate test directory
├── contract/                # Contract tests (validate API responses)
├── integration/             # Integration tests (full client workflows)
└── fixtures/                # Test data and mocks

dist/                         # Build output (git-ignored)
├── cjs/                     # CommonJS build
└── esm/                     # ES Module build
```

**Structure Decision**: Feature folder organization per Constitution Principle II.
Each Tank01 API resource (players, teams, games, etc.) gets its own feature folder
containing types, schemas, client methods, and tests. This enables independent
development and clear ownership boundaries as the client grows.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
