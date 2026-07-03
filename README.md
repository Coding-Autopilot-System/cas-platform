# CAS Platform

[![CI](https://github.com/Coding-Autopilot-System/cas-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/Coding-Autopilot-System/cas-platform/actions/workflows/ci.yml) [![CodeQL](https://github.com/Coding-Autopilot-System/cas-platform/actions/workflows/codeql.yml/badge.svg)](https://github.com/Coding-Autopilot-System/cas-platform/actions/workflows/codeql.yml)


Production-oriented Azure infrastructure foundation for the Coding Autopilot
System (CAS). It provides environment-isolated Container Apps hosting,
workspace-based observability, system-assigned managed identity, budgets, and
safe validation tooling without storing secrets. The workload module implements
the public `cas-reference-product` deployment interface.

## v0.1 foundation

- Subscription-scope orchestration with one resource group per environment.
- Reusable Bicep modules for observability, Container Apps, and budgets.
- System-assigned managed identity and least-privilege-by-default design.
- Log Analytics, Application Insights, diagnostic settings, tags, and budgets.
- Dev, test, and production parameter sets.
- Local and CI validation plus a non-deploying Azure `what-if` script.
- Reference-product configuration injection and liveness/readiness probes.
- Optional Foundry project RBAC requiring an explicit project scope and role.

## Validate locally

Prerequisites: PowerShell 5.1+ (PowerShell 7 recommended), Azure CLI, Bicep
CLI, and optionally Pester 5+.

```powershell
./scripts/validate.ps1
```

If the machine blocks scripts through its execution policy, use a process-only
override without changing machine policy:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate.ps1
```

To run an Azure subscription-scope what-if without deploying:

```powershell
az login
./scripts/what-if.ps1 -Environment dev -Location northeurope
```

The script only invokes `az deployment sub what-if`. It never invokes a create
or deploy command.

## Reference product configuration

The Container App injects `ENVIRONMENT`, `WORKFLOW_BACKEND`,
`FOUNDRY_PROJECT_ENDPOINT`, `FOUNDRY_AGENT_NAME`, and
`APPLICATIONINSIGHTS_CONNECTION_STRING`. Local mode is the safe default.
Foundry mode requires a project endpoint and Next Gen agent name.

Foundry RBAC is disabled unless both `foundryProjectResourceId` and
`foundryRoleDefinitionResourceId` are explicitly supplied. The assignment is
created only at that Foundry project resource. Select and approve the minimum
role externally; the template does not assume a broad built-in role.

## Architecture

See [architecture](docs/architecture.md), [threat model](docs/threat-model.md),
and [operations](docs/operations.md). Planning and requirement traceability are
kept under `.planning/`.

## Security

Public ingress is disabled by default. No secrets, credentials, or access keys
are accepted by the templates. Runtime access to dependencies uses managed
identity with narrowly scoped RBAC. Private networking and Azure Policy remain
deferred until a target landing-zone contract defines topology and ownership.
