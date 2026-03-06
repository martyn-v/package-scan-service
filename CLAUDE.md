# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Node.js (TypeScript) microservice that receives and processes logistics events from external devices/systems. Example: a warehouse camera+scale combo sending `package-scan` events with ID, dimensions, and weight.

- **Runtime:** Node 24, Yarn 4 (managed via mise)
- **HTTP layer:** Express
- **Persistence:** In-memory (no database) — use a simple cache/store layer within the app
- **Deployment:** Docker container

## Build & Run Commands

```bash
yarn install          # Install dependencies
yarn build            # Compile TypeScript
yarn start            # Run the compiled service
yarn dev              # Run in development mode (ts-node or nodemon)
yarn test             # Run all tests with coverage (HTML + JUnit output)
yarn run test:unit    # Run unit tests only (tests/unit/)
yarn run test:e2e     # Run e2e tests only (tests/e2e/)
yarn lint             # Run ESLint
yarn lint --fix       # Auto-fix lint issues
make test_success     # curl test against running server
docker build -t package-scan-handler .  # Build Docker image
docker run -p 3000:3000 package-scan-handler  # Run container
```

## Architecture

```
src/
  app.ts              # Express app setup (routes, middleware)
  server.ts           # Entry point (starts listening)
  routes/             # Route handlers (thin — delegate to services)
  services/           # Business logic
  models/             # TypeScript types/interfaces for events
  store/              # In-memory persistence layer (injectable/mockable)
```

- **Routes** are thin controllers that validate input and delegate to **services**.
- **Services** contain business logic and depend on the **store** abstraction.
- **Store** provides an in-memory persistence interface, injected into services for testability.

## Gotchas

- **Yarn PnP:** Use `yarn start` / `yarn build` — not `node dist/server.js` directly (PnP won't resolve modules)
- **Coverage & JUnit output are committed** to the repo for demo purposes — do not gitignore them

## Development Rules

- **TDD (red-green-refactor):** Write a failing test first, make it pass, then refactor. Every feature/fix starts with a test.
- **All dependencies must be mockable:** Use a DI-friendly pattern. Use an external mocking library (e.g., sinon, jest mocks, or ts-mockito).
- **Test coverage:** Generate HTML coverage report and JUnit XML output on every test run.
- **Clean code:** Small functions, clear naming, single responsibility. Favor composition over inheritance.
- **JSDoc:** All functions, interfaces, and classes must have appropriate JSDoc comments.
- **Conventional Commits:** All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g. `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`).

## Pre-Push Checklist

Before every `git push`, run all three in order. All must pass. If any fail, fix issues in a separate commit before pushing.

1. `yarn lint`
2. `yarn test`
3. `yarn build`

## Decision Log

All interactions and decisions are logged in `DECISIONS.md`. Every prompt/response pair is recorded. Architectural decisions use ADR format in that file.
