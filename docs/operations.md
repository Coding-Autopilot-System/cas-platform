# Operations

## Validation flow

1. Run `./scripts/validate.ps1` for deterministic local checks.
2. Authenticate to a non-production Azure subscription.
3. Run `./scripts/what-if.ps1 -Environment dev`.
4. Review every create, modify, replace, and delete result.
5. Store the approved summary with the change request.

## Rollout

Promote the identical Bicep graph through dev, test, and production parameter
sets. Production deployment is intentionally not implemented in v0.1. Add it
only after workload identity, approvals, policy, and rollback ownership are
defined.

## Reference product modes

Parameter files default to `WORKFLOW_BACKEND=local`. To validate Foundry mode,
provide the non-secret project endpoint and Next Gen agent name. RBAC remains
disabled unless the operator also supplies both the exact Foundry project
resource ID and an approved role definition resource ID. Review the resulting
project-scoped role assignment in what-if before any deployment authorization.

Health probes call `/health/live` and `/health/ready` on port 8080. Readiness
checks configuration only; it does not invoke Foundry.

## Rollback

Bicep redeployment can restore configuration but does not restore deleted data
or telemetry. For high-risk changes, prefer additive resources and migration.
Never rely on changing a resource name as a rollback mechanism.

## Diagnostics

Query the environment Log Analytics workspace for platform and application
logs. Application Insights is available for workload instrumentation when the
application is configured without exposing credentials.
