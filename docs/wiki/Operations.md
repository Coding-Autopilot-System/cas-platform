# Operations

## Validate locally

Prerequisites: PowerShell 5.1+ (7 recommended), Azure CLI, Bicep CLI, optionally Pester 5+.

```powershell
./scripts/validate.ps1
```

If the machine blocks scripts through its execution policy, use a process-only override:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate.ps1
```

## What-if (non-deploying)

```powershell
az login
./scripts/what-if.ps1 -Environment dev -Location northeurope
```

This only invokes `az deployment sub what-if`. It never invokes a create or deploy command —
consistent with the workspace-wide NO-AZURE-deploy lock (see
[Architecture](Architecture.md#deployment-lock-no-azure-posture)).

## CI workflows

| Workflow | Purpose |
|---|---|
| `validate.yml` | Bicep/lint/contract validation |
| `codeql.yml` | CodeQL static analysis |
| `pr-lint.yml` | PR metadata/title linting |
| `stale.yml` | Stale issue/PR sweep |
| `pages.yml` | Publishes docs to GitHub Pages |

There is no coverage-percentage gate in this repo — CI validates Bicep syntax, lint rules, and
contract tests, not code coverage (this is infrastructure-as-code, not an application).

## Validation flow (full)

1. Run `./scripts/validate.ps1` for deterministic local checks.
2. Authenticate to a non-production Azure subscription.
3. Run `./scripts/what-if.ps1 -Environment dev`.
4. Review every create, modify, replace, and delete result.
5. Store the approved summary with the change request.

Production deployment is intentionally not implemented in v0.1, independent of and in addition
to the workspace-wide deploy lock — it will be added only after workload identity, approvals,
policy, and rollback ownership are defined.

<!-- docs-verified: c1585ee195b72c5282f278c98da28c60da75667c 2026-07-08 -->
