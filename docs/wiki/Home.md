# cas-platform Wiki

`cas-platform` is the production-oriented Azure infrastructure foundation for the
Coding-Autopilot-System (CAS). It provides environment-isolated Container Apps hosting,
workspace-based observability, system-assigned managed identity, budgets, and safe validation
tooling — without storing secrets. The workload module implements the public
`cas-reference-product` deployment interface.

## Deployment status: bicep-ready, not deployed

This repo is **bicep-ready** (linted, parameterized, subscription-scope `what-if` validated) but
Azure deployment is **locked workspace-wide** until a future milestone. See
[Architecture](Architecture.md) for the full statement.

## Quickstart

```powershell
./scripts/validate.ps1
```

To run a non-deploying subscription-scope what-if:

```powershell
az login
./scripts/what-if.ps1 -Environment dev -Location northeurope
```

`what-if.ps1` only invokes `az deployment sub what-if` — it never creates or deploys resources.

## Where to go next

- [Architecture](Architecture.md) — module graph, identity boundary, and the NO-AZURE deploy lock
- [Operations](Operations.md) — verified validation/lint/what-if commands
- [Decisions](Decisions.md) — index of recorded architectural decisions

<!-- docs-verified: c1585ee195b72c5282f278c98da28c60da75667c 2026-07-08 -->
