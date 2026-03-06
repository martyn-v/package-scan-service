# Package Scan Handler

A Node.js (TypeScript) microservice that receives and processes logistics events from external devices and systems.

## Overview

This service simulates a warehouse microservice that handles events such as `package-scan` — triggered by devices like camera + scale combinations. Each event contains a package ID, dimensions, and weight.

## Tech Stack

- **Runtime:** Node.js 24 (managed via [mise](https://mise.jdx.dev/))
- **Language:** TypeScript
- **HTTP Framework:** Express
- **Package Manager:** Yarn 4
- **Containerization:** Docker

## Getting Started

```bash
# Install dependencies
yarn install

# Run in development mode
yarn dev

# Run tests
yarn test

# Build for production
yarn build

# Start production server
yarn start
```

## Docker

```bash
docker build -t package-scan-handler .
docker run -p 3000:3000 package-scan-handler
```

## Persistence

This service uses in-memory storage — no external database is required. Data does not persist across restarts.
