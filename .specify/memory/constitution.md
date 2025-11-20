<!--
SYNC IMPACT REPORT
==================
Version Change: Template → 1.0.0
Constitution Type: TypeScript Client Library
Ratification Date: 2025-11-20
Last Amended: 2025-11-20

Modified Principles:
- Added: Type Safety First (Critical for TypeScript client)
- Added: Feature Folder Organization (Per user requirement)
- Added: Comprehensive Testing
- Added: API Contract Compliance
- Added: Developer Experience

Added Sections:
- Technical Standards
- Development Workflow

Removed Sections:
- None (initial version)

Templates Requiring Updates:
✅ plan-template.md - Aligned with single-project TypeScript structure
✅ spec-template.md - Already generic, no changes required
✅ tasks-template.md - Aligned with TypeScript testing patterns

Follow-up TODOs:
- None
-->

# Tank01 NFL Client Constitution

## Core Principles

### I. Type Safety First (NON-NEGOTIABLE)

**All code MUST be fully typed with TypeScript strict mode enabled.**

- No use of `any` type except for explicitly justified cases documented in code comments
- All API responses MUST have corresponding TypeScript interfaces or types
- All function parameters and return values MUST be explicitly typed
- Type guards MUST be used when narrowing union types or handling external data
- Generic types MUST be used appropriately to maintain type safety across operations

**Rationale**: Type safety prevents runtime errors, improves IDE support, enables refactoring confidence, and serves as living documentation. For an API client library, strict typing ensures consumers have accurate intellisense and compile-time validation.

### II. Feature Folder Organization

**Source code MUST follow feature-based folder structure, NOT technical layer separation.**

- Organize by domain feature/resource (e.g., `src/players/`, `src/teams/`, `src/games/`)
- Each feature folder contains related types, services, utilities, and tests
- Shared/common code goes in `src/common/` or `src/shared/`
- Index files (`index.ts`) MUST explicitly export public API surface
- Internal implementation files SHOULD be suffixed with `.internal.ts` to signal non-public APIs

**Rationale**: Feature folders improve discoverability, reduce merge conflicts, enable team ownership boundaries, and make it clear what functionality relates to which domain concepts. This is especially valuable as the API client grows to support more Tank01 endpoints.

### III. Comprehensive Testing

**Every public function MUST have corresponding tests before implementation is considered complete.**

Required test coverage:

- **Unit tests**: Test individual functions/methods in isolation with mocked dependencies
- **Integration tests**: Test API client methods with mocked HTTP responses
- **Contract tests**: Validate actual API responses match expected TypeScript types (can use recorded responses)
- **Error handling tests**: Every error path MUST be tested

**Test organization**: Tests live alongside source in `__tests__/` subdirectories within each feature folder, OR in a parallel `tests/` structure mirroring `src/`.

**Rationale**: API clients are integration points with external systems. Comprehensive tests catch breaking changes in upstream APIs, validate type definitions match reality, and ensure proper error handling for network failures and API errors.

### IV. API Contract Compliance

**All API interactions MUST validate responses against expected schemas.**

- Use runtime validation libraries (e.g., `zod`, `io-ts`) to validate API responses
- Type definitions MUST be derived from or validated against validation schemas
- Failed validations MUST throw descriptive errors indicating schema mismatch
- API version compatibility MUST be documented and enforced
- Breaking changes in Tank01 API MUST be detected via contract tests

**Rationale**: External APIs can change without notice. Runtime validation ensures type safety extends beyond compile time and catches API contract violations before they cause subtle bugs in consuming applications.

### V. Developer Experience

**The client library MUST be simple, discoverable, and well-documented.**

- All public APIs MUST have TSDoc comments with examples
- Error messages MUST be actionable (e.g., "API key missing: set TANK01_API_KEY environment variable")
- Provide typed configuration objects with sensible defaults
- Export clear, consistent naming (e.g., `getNFLPlayerStats`, not `fetchPlyrStts`)
- Include quickstart guide and API reference in README
- Package MUST export both CommonJS and ES modules

**Rationale**: A client library's value is measured by adoption and ease of use. Clear documentation, helpful errors, and ergonomic APIs reduce friction for consumers and minimize support burden.

## Technical Standards

### Technology Stack

- **Language**: TypeScript 5.x with strict mode enabled
- **Runtime**: Node.js 18+ (LTS)
- **HTTP Client**: `node-fetch` v3.x for HTTP requests
- **Build Tool**: `tsup` or `tsc` for dual-format builds (CJS + ESM)
- **Testing**: `vitest` or `jest` with `ts-jest`
- **Validation**: `zod` for runtime schema validation
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier

### Code Quality Gates

- **Build**: Must compile without TypeScript errors
- **Lint**: Must pass ESLint checks with zero warnings
- **Format**: Code must be formatted with Prettier
- **Tests**: All tests must pass with minimum 80% code coverage
- **Types**: Must generate `.d.ts` files for TypeScript consumers

### Performance & Reliability

- API client MUST support request retry with exponential backoff
- API client MUST support request timeout configuration (default: 30s)
- API client MUST handle rate limiting gracefully (detect 429 responses)
- Large list responses SHOULD support pagination
- HTTP client MUST reuse connections (keep-alive)

### Security

- API keys MUST be configurable via environment variables or constructor parameters
- API keys MUST NOT be logged or included in error messages
- HTTPS MUST be used for all API requests
- Dependencies MUST be audited regularly with `npm audit`

## Development Workflow

### Feature Development Process

1. **Specify**: Create feature spec in `specs/[###-feature-name]/spec.md`
2. **Plan**: Generate implementation plan via `/speckit.plan` command
3. **Design**: Document data models and API contracts
4. **Test-First**: Write failing tests for acceptance criteria
5. **Implement**: Write code to pass tests
6. **Refactor**: Improve code quality while keeping tests green
7. **Document**: Update README and TSDoc comments
8. **Review**: Ensure Constitution compliance before merge

### Branch Strategy

- **Main branch**: `main` - production-ready code only
- **Feature branches**: `###-feature-name` format (e.g., `001-player-stats-api`)
- **Branch protection**: Require PR reviews and passing CI checks before merge

### Commit Standards

- Use conventional commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Examples: `feat(players): add getPlayerStats method`, `fix(auth): handle expired API keys`

## Governance

This Constitution supersedes all other development practices and guidelines. Any code, architecture, or workflow that conflicts with this Constitution MUST be justified in writing and approved before implementation.

### Amendment Process

1. Propose amendment with rationale and impact analysis
2. Update Constitution with version bump (semantic versioning)
3. Update affected templates and documentation
4. Communicate changes to all contributors
5. Add migration guidance for existing code if needed

### Versioning Policy

Constitution follows semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Removal or redefinition of core principles (backward incompatible)
- **MINOR**: New principles added or material expansions to guidance
- **PATCH**: Clarifications, wording improvements, typo fixes

### Compliance Reviews

- **Pre-merge**: All PRs MUST verify compliance via PR template checklist
- **Quarterly**: Review Constitution relevance and effectiveness
- **Post-incident**: Update Constitution if gaps identified

### Complexity Justification

Any violation of Constitution principles MUST be documented in `specs/[feature]/plan.md` Complexity Tracking section with:

1. What principle is being violated
2. Why the violation is necessary
3. What simpler alternatives were considered and rejected

**Version**: 1.0.0 | **Ratified**: 2025-11-20 | **Last Amended**: 2025-11-20
