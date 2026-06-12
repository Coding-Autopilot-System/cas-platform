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

The Container App receives a system-assigned managed identity. Foundry access
is optional and creates no role assignment by default. When both an explicit
Foundry project resource ID and an approved role definition resource ID are
provided, the platform assigns that role only at the project resource scope.
Subscription-wide workload roles are not supported.

External ingress defaults to disabled. Enabling it is an explicit parameter
decision and requires a threat-model review. The v0.1 baseline does not claim
private networking. That topology remains deferred until a target landing-zone
contract identifies required subnets, DNS, firewall, and egress ownership.

## Reference product contract

The workload module follows the public `cas-reference-product` deployment
interface: Linux container image, port 8080, internal ingress by default,
system-assigned identity, `/health/live` and `/health/ready` probes, and
non-secret workload configuration. Application Insights configuration is
injected directly from the observability module.

## Observability

Platform and application diagnostic settings send all supported logs and
metrics to the environment Log Analytics workspace. Application Insights is
workspace-based. No workspace shared keys or instrumentation connection strings
are output.

## Change safety

Normal changes flow through build, lint, contract tests, and subscription
`what-if`. Resource naming is deterministic. Renaming workload, environment, or
location can replace resource boundaries and must be treated as a migration.
