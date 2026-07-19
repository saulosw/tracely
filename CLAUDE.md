# Tracely — project context

## Product vision

Tracely turns a developer's GitHub activity into a **narrative timeline**: a
readable, journal-like story of what they built over a day, week, month, or
year. The differentiator versus GitHub-wrapped-style tools and AI
brag-document generators is **narrative depth over stats** and **personal
reflection over performance-review ammo**. No contribution graphs as the main
event, no "impact bullet points for your manager" — a story you read to
remember your own journey.

**Target user:** an individual developer tracking their own growth. Not
managers tracking reports, not teams.

## Architecture decisions

- **Yarn workspaces monorepo** (Yarn 4 via Corepack, `nodeLinker: node-modules`).
  Yarn only — never npm; no `package-lock.json` should ever appear.
- **Client:** Vite + React + TypeScript with a feature/module-based structure —
  `src/modules/<feature>` (auth, github-connection, reports, timeline), each
  self-contained with `components/ hooks/ services/ types/ index.ts`;
  cross-cutting pieces in `src/shared/`; app shell/providers in `src/app/`.
- **Server:** Node + TypeScript following Clean Architecture. `domain/` holds
  entities, repository interfaces (ports), use cases, and errors — it never
  imports from `infra/` or `main/`. `infra/` implements the ports (HTTP via
  Express as a thin swappable adapter, repositories, database, external
  providers). `main/` is the composition root (config, factories, server
  bootstrap).
- **GitHub access (planned, not implemented):** via a **GitHub App** —
  installation-based, fine-grained read-only permissions — rather than a
  classic OAuth App with broad scopes.
- **Extensibility:** GitHub is only the first data source. New sources
  (GitLab, Linear, Notion, …) plug in as new providers/adapters in `infra/`
  behind domain interfaces — no rewrite.

## Design direction

Dark-mode-first, black/white minimal, **editorial/journal feel** rather than
SaaS-dashboard feel. Design tokens live in
`client/src/shared/styles/tokens.css`: near-black background (`#0a0a0a`),
off-white ink (`#f5f5f0`), a single restrained accent. Prefer typography and
whitespace over chrome, cards, and widgets.

## Near-term roadmap

1. **MVP:** connect GitHub only; generate a narrative report for a chosen
   time range; render it as the timeline story view.
2. Later: more data sources, possibly an MCP-based integration layer.

## Conventions

- `server/src/domain/` stays free of framework or infra imports — the
  dependency rule is the architecture; protect it.
- One module per frontend feature; modules expose their public surface via
  `index.ts` and don't reach into each other's internals.
- Prefer **clarity over cleverness** — this project is also a learning
  exercise for its author. Small, well-chosen dependencies over heavy
  toolchains.
