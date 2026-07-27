# Tracely

Tracely connects to your GitHub account and turns your coding activity into a
**narrative timeline** — a personal, readable story of your coding journey,
told day by day or summarized by week, month, or year.

It is not a stats dashboard, and it is not a "brag document" generator for
managers. Tracely is built for developers who want to reflect on, remember,
and make sense of their own growth: what you were building, what you struggled
with, what you shipped — as a journal, not a chart.

GitHub is the first data source. The architecture is designed so more sources
(GitLab, Linear, Notion, …) can be added later without a rewrite.

## Status

**Backend foundation in place.** GraphQL BFF (Yoga + Pothos), email/password
auth with cookie sessions, GitHub OAuth connection with encrypted token
storage, and incremental activity sync (commits, pull requests, issues,
releases) into Postgres via Drizzle. See `server/README.md` for setup.
The client is still UI-only (no API integration yet).

## Tech stack

- **Monorepo:** Yarn workspaces (Yarn 4 via Corepack)
- **Client:** Vite + React + TypeScript, feature-module folder structure
- **Server:** Node + TypeScript with Express as a thin adapter, following
  Clean Architecture (framework-free domain layer)

## Running locally

Requires Node ≥ 22. Yarn is provisioned automatically through Corepack:

```bash
corepack enable   # once per machine, if you haven't already
yarn install
yarn dev          # runs client (Vite) and server concurrently
```

Other scripts:

```bash
yarn dev:client   # client only
yarn dev:server   # server only
yarn build        # build both workspaces
```

## Repository structure

```
tracely/
  client/                 # Vite + React + TS frontend
    src/
      app/                # app shell, providers, router setup
      modules/            # one folder per product feature
        auth/             #   login, auth state
        github-connection/#   "connect GitHub" flow
        reports/          #   time-range picker, report trigger
        timeline/         #   the narrative timeline view
      shared/             # reusable UI primitives, hooks, lib, design tokens
  server/                 # Node + TS backend, Clean Architecture
    src/
      domain/             # entities, repository interfaces, use cases (pure)
      infra/              # http, concrete repositories, database, providers
      main/               # composition root: config, DI wiring, server.ts
      shared/
    tests/
  package.json            # workspaces root + orchestration scripts
```
