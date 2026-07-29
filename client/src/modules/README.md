# Modules

One folder per product feature, each self-contained:

- `auth/` — login screen, auth state and hooks
- `connections/` — the sources the story is read from, and their connection state
- `dashboard/` — the authenticated landing view
- `history/` — the chapters already generated
- `reports/` — time-range picker, report generation trigger
- `timeline/` — the narrative timeline / story view

Each module owns its `components/`, `hooks/`, `services/`, `types/` and exposes
its public surface through `index.ts` — other modules import from that index,
never from a module's internals.

Cross-cutting, feature-agnostic pieces (UI primitives, the API client, design
tokens) live in `src/shared/` instead. If two modules need it, it probably
belongs in `shared/`.
