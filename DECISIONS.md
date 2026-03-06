# Decision Log

All interactions and architectural decisions for the package-scan-handler project.

---

## Interaction Log

### 2026-03-06 — Project Initialization

**Summary of prompt:** Initialize the project as a Node.js (TypeScript) microservice with Express for HTTP, Docker for deployment, and in-memory persistence. Apply TDD, clean code standards, mockable dependencies, and generate HTML + JUnit test coverage. Log all interactions to DECISIONS.md with ADR format for decisions.

**Summary of response:** Created `CLAUDE.md` with project overview, build/run commands, architecture outline, and development rules. Created `DECISIONS.md` for tracking interactions and decisions. The repo starts from an empty state with only `mise.toml` (Node 24, Yarn 4).

**Questions asked:** None — requirements were clear from the initial prompt.

### 2026-03-06 — Git Repository Setup

**Summary of prompt:** Initialize a git repository, create a README explaining the project, add `https://github.com/martyn-v/package-scan-service.git` as origin, commit and push to main.

**Summary of response:** Created `README.md` with project overview, tech stack, getting started, Docker, and persistence sections. Initialized git repo, set branch to `main`, added remote origin, committed all files, and pushed to remote.

**Questions asked:** None.

### 2026-03-06 — Express Hello World Scaffold

**Summary of prompt:** Scaffold a basic Express hello world app using Yarn.

**Summary of response:** Initialized Yarn project, installed Express + TypeScript + ts-node + nodemon. Created `tsconfig.json`, `src/app.ts` (Express app factory with `/health` endpoint), and `src/server.ts` (entry point). Added build/start/dev scripts to `package.json`. Updated `.gitignore` with dist exclusion. Verified build and health endpoint work.

**Questions asked:** None.

### 2026-03-06 — Test Scaffolding

**Summary of prompt:** Scaffold testing with `yarn run test:unit` and `yarn run test:e2e` commands. Use modern testing (Vitest preferred). Create an e2e test for the `/health` endpoint.

**Summary of response:** Installed Vitest, @vitest/coverage-v8, and supertest. Created `vitest.config.ts` with HTML coverage and JUnit XML output. Set up `tests/unit/` and `tests/e2e/` directories. Created e2e test for `GET /health` verifying 200 status and `{ status: 'ok' }` body. Added `test`, `test:unit`, and `test:e2e` scripts to package.json.

**Questions asked:** None.

### 2026-03-06 — POST /events/package-scan Endpoint

**Summary of prompt:** Implement `POST /events/package-scan` that accepts a package scan event payload (eventId, source, timestamp, package with trackingId/dimensions/weight) and echoes it back. Provide a shell script `scripts/test_success.sh` that curls the endpoint with a randomly generated eventId. Add a Makefile with a `test_success` target.

**Summary of response:** Created `PackageScanEvent` model types, route handler that echoes the request body, wired route into app. Followed TDD: wrote failing e2e test first (404), then implemented to green. Created `scripts/test_success.sh` with random eventId generation and `Makefile` with `test_success` target. Verified all tests and the manual script pass.

**Questions asked:** None.

### 2026-03-06 — CLAUDE.md Update & ESLint Setup

**Summary of prompt:** Update CLAUDE.md with session learnings (Yarn PnP gotcha, coverage commit policy, test commands). Add JSDoc requirement for all functions, interfaces, and classes. Implement a linter with sensible rules that validates code compliance.

**Summary of response:** Updated CLAUDE.md with gotchas and JSDoc rule. Set up ESLint with typescript-eslint and eslint-plugin-jsdoc. Rules include: explicit return types, no-any, JSDoc on all functions/interfaces/classes/types, no console.log (warn/error allowed), eqeqeq, prefer-const. Tests are relaxed (no JSDoc, no explicit returns). Fixed all existing code to pass lint: added JSDoc to all models and `createApp`, changed `console.log` to `console.warn` in server.ts.

**Questions asked:** None.

---

## ADR (Architectural Decision Records)

### ADR-001: ESLint Configuration

**Status:** Accepted

**Context:** Need a linter to enforce code quality, TypeScript strictness, and JSDoc compliance.

**Decision:** ESLint with `typescript-eslint` and `eslint-plugin-jsdoc`. Key rules:
- `@typescript-eslint/explicit-function-return-type: error`
- `@typescript-eslint/no-explicit-any: error`
- `jsdoc/require-jsdoc` on functions, methods, classes, interfaces, type aliases
- `jsdoc/require-description` and `jsdoc/require-returns-description`
- `no-console` (only `warn` and `error` allowed)
- Tests exempt from JSDoc and explicit return types

**Consequences:** All source code must have JSDoc. Tests remain lightweight.
