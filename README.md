# Package Scan Handler

A Node.js (TypeScript) microservice that receives and processes logistics events from external devices and systems.

## Overview

This service simulates a warehouse microservice that handles `package-scan` events — triggered by devices like camera + scale combinations. Each event contains a package ID, dimensions, and weight. The service validates, normalizes, and persists events in memory, returning a structured response explaining why the event was accepted or rejected.

### Key Behaviours

- **Validation** — rejects missing/invalid fields, negative or zero dimensions, and future timestamps.
- **Warnings** — flags absurd dimensions (e.g. < 5cm, height > 500cm) without rejecting.
- **Idempotency** — duplicate `eventId` submissions are rejected.
- **Normalization** — unknown fields are stripped; the cleaned payload is returned as `normalizedEvent`.

## Tech Stack

- **Runtime:** Node.js 24 (managed via [mise](https://mise.jdx.dev/))
- **Language:** TypeScript
- **HTTP Framework:** Express 5
- **Validation:** Joi
- **Testing:** Vitest, supertest, vitest-mock-extended
- **Package Manager:** Yarn 4 (PnP)
- **Containerization:** Docker

## Getting Started

```bash
# Install dependencies
yarn install

# Run in development mode
yarn dev

# Run tests (unit + e2e with coverage)
yarn test

# Run unit or e2e tests separately
yarn run test:unit
yarn run test:e2e

# Lint
yarn lint

# Build for production
yarn build

# Start production server
yarn start
```

## API

### `POST /events/package-scan`

```json
{
  "eventId": "evt_123",
  "source": "edge-camera",
  "timestamp": "2026-01-20T10:15:00Z",
  "package": {
    "trackingId": "PKG-001",
    "dimensions": { "length": 120, "width": 80, "height": 60, "unit": "cm" },
    "weight": { "value": 25, "unit": "kg" }
  }
}
```

**Response:**

```json
{
  "status": "accepted | accepted_with_warnings | rejected",
  "reasons": ["duplicate_event", "invalid_dimensions", "..."],
  "normalizedEvent": { "...": "normalized payload" }
}
```

### `GET /health`

Returns `{ "status": "ok" }`.

## Manual Testing

Shell scripts in `scripts/` cover common scenarios. Run them via Make against a running dev server:

```bash
yarn dev &
make test_success
make test_fail_idempotency
make test_warn_small_dimensions
```

See the `Makefile` for all available targets.

## Docker

```bash
docker build -t package-scan-handler .
docker run -p 3000:3000 package-scan-handler
```

## Architecture

```
src/
  app.ts              # Express app setup (routes, middleware)
  server.ts           # Entry point (starts listening)
  routes/             # Thin route handlers — delegate to services
  services/           # Business logic (validation + persistence)
  models/             # TypeScript types/interfaces
  store/              # In-memory persistence layer (injectable/mockable)
  validation/         # Joi schemas, validator logic, and warning checks
```

Dependencies are injected: repository interface into service, service into route factory. This makes all layers independently testable with mocks.

## Persistence

This service uses in-memory storage — no external database is required. Data does not persist across restarts.

## Files Included for Demonstration

The following files are committed to the repository for demonstration and review purposes, even though they would typically be excluded from version control:

- **`coverage/`** — HTML test coverage report, allowing reviewers to inspect coverage without running tests locally.
- **`test-results.junit.xml`** — JUnit XML test output, demonstrating CI-compatible test reporting.
- **`DECISIONS.md`** — Full interaction log and architectural decision records (ADRs), showing the thought process behind every feature.
- **`REVIEW.md`** — Code review against the functional specification, with findings and sign-off.

## Project Documentation

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Development rules, build commands, architecture, and gotchas |
| `DECISIONS.md` | Interaction log and ADRs for all project decisions |
| `REVIEW.md` | Code review findings and remediation sign-off |
