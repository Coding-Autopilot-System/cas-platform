# Architecture

## Scope and ownership

`infra/main.bicep` is a subscription-scope orchestrator. It creates one resource
group for a selected environment and delegates coherent concerns to
resource-group-scoped modules.

```text
Subscription deployment
  -> environment resource group
     -> observability module
        -> Log Analytics workspace
        -> workspace-based Application Insights
     -> compute module
        -> Container Apps managed environment
        -> Container App with system-assigned identity
        -> Azure Monitor diagnostic settings
     -> budget module (optional)
        -> resource-group budget and notifications
```

## Environment model

Dev, test, and production use the same module graph. Parameter files vary only
approved values such as retention, workload sizing, ingress, and budget. Each
environment receives a separate resource group, telemetry workspace, compute
environment, identity boundary, and budget.

## Identity and networking

The Container App receives a system-assigned managed identity. v0.1 has no
dependent data plane resources, so it deliberately creates no role
assignments. Future modules must grant the identity only the minimum data-plane
roles at the narrowest resource scope.

External ingress defaults to disabled. Enabling it is an explicit parameter
decision and requires a threat-model review. The v0.1 baseline does not claim
private networking; that is planned as a later hardened topology.

## Observability

Platform and application diagnostic settings send all supported logs and
metrics to the environment Log Analytics workspace. Application Insights is
workspace-based. No workspace shared keys or instrumentation connection strings
are output.

## Change safety

Normal changes flow through build, lint, contract tests, and subscription
`what-if`. Resource naming is deterministic. Renaming workload, environment, or
location can replace resource boundaries and must be treated as a migration.

