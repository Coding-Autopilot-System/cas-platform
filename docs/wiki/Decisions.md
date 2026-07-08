# Decisions

## Phase summaries (`.planning/phases/`)

| Phase | Topic |
|---|---|
| [01-safe-azure-foundation](../../.planning/phases/01-safe-azure-foundation/01-01-SUMMARY.md) | v0.1 foundation: subscription-scope orchestration, observability, managed identity, budgets |
| [02-reference-product-integration](../../.planning/phases/02-reference-product-integration/02-01-SUMMARY.md) | Reference-product deployment interface, health probes, workload configuration injection |

## Research (`.planning/research/`)

- [Research summary](../../.planning/research/SUMMARY.md)

## Open PRs affecting this repo's documented posture

- **PR #11** — `fix: enable use-recent-api-versions bicep lint rule` (Phase 33 P2). Currently
  open; `bicepconfig.json`'s `use-recent-api-versions` rule is `off` on `main` until this merges.

## Architecture Decision Records (`docs/adr/`)

[`docs/adr/`](../adr/README.md) is the formal ADR home for this repo. No sequentially-numbered
ADR files have been recorded yet as of this writing — the directory holds only the governance
README.

<!-- docs-verified: c1585ee195b72c5282f278c98da28c60da75667c 2026-07-08 -->
