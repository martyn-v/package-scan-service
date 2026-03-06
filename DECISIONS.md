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

### 2026-03-06 — Service & Repository Layers for Package Scan

**Summary of prompt:** Implement persistence simulation with a service layer and repository layer (simulating a database). After a successful save, return `{"status": "accepted"}`.

**Summary of response:** Created `PackageScanRepository` interface and `InMemoryPackageScanRepository` (Map-based). Created `PackageScanService` that delegates to the repository. Refactored route to use injected service via `createPackageScanRouter()`. Wired DI in `app.ts`. Unit tests with vitest-mock-extended for service (mocked repo) and repository. Updated e2e test for new response. All lint/tests/build pass.

**Questions asked:** None.

### 2026-03-06 — Idempotency for Package Scan Events

**Summary of prompt:** A given eventId must only be processed once. Duplicates must be rejected with `{"status": "rejected", "reasons": ["duplicate_event"]}`.

**Summary of response:** Added `ProcessResult` type. Service now checks `repository.findById()` before saving — returns accepted or rejected. Route maps rejected to HTTP 409. Added unit tests (mocked repo returning existing event) and e2e test (send same event twice, second gets 409). TDD red-green followed.

**Questions asked:** None.

### 2026-03-06 — Joi Validation Layer

**Summary of prompt:** Find and propose a validation library supporting errors and warnings. Errors reject, warnings return `accepted_with_warnings`. Use Joi (chosen for native warning support). Implement and commit without pushing — user will provide specific validations next.

**Summary of response:** Installed Joi. Created `ProcessResult` type with three statuses (accepted/accepted_with_warnings/rejected). Built `validate()` (async, using `validateAsync` with `warnings: true`) and `toProcessResult()` converter. Created Joi schema for package scan payloads. Wired validation into service (runs before idempotency check). Route maps status to HTTP codes. Unit tests for validator, service, and e2e for invalid payloads. All 16 tests pass.

**Questions asked:** None.

### 2026-03-06 — Validation Rules: Dimensions, Future Timestamp, TrackingId

**Summary of prompt:** Three validations: (1) reject negative or missing dimensions, (2) reject future timestamps, (3) reject missing trackingId.

**Summary of response:** Dimensions and trackingId were already enforced by schema (`positive().required()`, `string().required()`). Added `Joi.date().iso().max('now')` for future timestamp rejection. Added 4 unit tests: negative dimensions, missing dimensions, future timestamp, missing trackingId. TDD red-green: only future timestamp failed initially, fixed with schema change. Updated ESLint config for `ignoreRestSiblings` in test files. All 20 tests pass.

**Questions asked:** Clarified #1 ("a payload with dimensions should be rejected") — user confirmed negative dimensions or missing field.

### 2026-03-06 — Dimension Warnings (Small and Absurd Height)

**Summary of prompt:** Add warnings for absurd dimensions: 0 rejected as error, anything below 5 as warning, height > 500 as warning.

**Summary of response:** 0 and negative already rejected by `positive()`. Created `checkDimensionWarnings()` in `src/validation/package-scan-warnings.ts` — warns for any dimension < 5 or height > 500. Integrated into validator (runs after Joi passes). Removed Joi `helpers.warning()` approach (not available in `.custom()` in Joi 18). Added unit tests for warnings function, validator warning tests, and e2e test for `accepted_with_warnings`. Added `test_warn_small_dimensions.sh` and `test_warn_absurd_height.sh` scripts + make targets. All 28 tests pass.

**Questions asked:** None — user clarified mid-implementation that 0 should be rejected and < 5 should warn.

### 2026-03-06 — Bugfix: Strip Unknown Fields Instead of Rejecting

**Summary of prompt:** Extra values in the payload cause rejection. Should strip them instead. Can Joi do this?

**Summary of response:** Yes — added `stripUnknown: true` to `validateAsync` options. Unknown fields are silently removed. Added unit test for payloads with unknown top-level and nested fields. TDD red-green. 29 tests pass.

**Questions asked:** None.

### 2026-03-06 — Return Normalized Payload in Response

**Summary of prompt:** Return the normalized (stripped) payload in the `accepted` and `accepted_with_warnings` responses.

**Summary of response:** Added `data` field to `ProcessResult`. Validator now returns normalized payload from `validateAsync`. Service includes `data` in accepted/accepted_with_warnings results. Added e2e test confirming stripped payload returned without extra fields. 30 tests pass.

**Questions asked:** None.

### 2026-03-06 — Code Review Against Functional Specification

**Summary of prompt:** Perform a full code review of the repository against the functional specification (sections 3–4), validating consistency with project rules, architecture, style, test coverage, and requirements compliance. Write findings to `REVIEW.md`.

**Summary of response:** Read all source files, test files, config files, scripts, and documentation. Wrote `REVIEW.md` with 21 findings across 8 categories. Two high-severity findings identified: (1) response field `data` should be `normalizedEvent` per spec section 4, and (2) warnings use a separate `warnings` field instead of the spec's single `reasons` array. Other findings include missing Dockerfile (optional per spec), shared e2e test state, CLAUDE.md architecture diagram missing `validation/`, and ADR-002 inaccuracy about Joi warning implementation. 30 tests pass with good coverage.

**Questions asked:** None.

---

## ADR (Architectural Decision Records)

### ADR-002: Joi for Validation with Warnings

**Status:** Accepted

**Context:** Need a validation library that distinguishes errors from warnings.

**Decision:** Joi — native `warning` support via `validateAsync()` with `{ warnings: true }`. Zod, Yup, and class-validator lack native warning concepts.

**Consequences:** Validation is async (`validateAsync` required for warnings in Joi 18). Schema defined in `src/validation/package-scan-schema.ts`, validator logic in `src/validation/validator.ts`.

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
