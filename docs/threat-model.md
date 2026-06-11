# Threat Model

## Assets

- Azure subscription and environment resource groups
- Runtime managed identities and their future role assignments
- Application artifacts and Container Apps configuration
- Operational telemetry and budget notifications
- Infrastructure definitions and reviewed what-if evidence

## Trust boundaries

- GitHub contributor to reviewed source
- CI runner to static validation
- Human operator to Azure subscription what-if and deployment
- Container App runtime to future Azure dependencies
- Public network to ingress when explicitly enabled

## Primary threats and controls

| Threat | v0.1 control | Residual risk |
|---|---|---|
| Credential disclosure | Templates accept no secrets; managed identity only | Operator and CI Azure identities remain external controls |
| Excessive runtime privilege | No role assignments until a dependency requires one | Future modules could grant overly broad roles |
| Accidental production change | Environment isolation and what-if-only validation script | A separate deployment workflow could bypass review |
| Unreviewed public exposure | External ingress disabled by default | Enabling ingress does not yet add WAF/private networking |
| Telemetry loss | Diagnostic settings route logs and metrics to Log Analytics | Alert rules and SLOs are deferred |
| Cost abuse | Tags and optional resource-group budgets | Budgets notify but do not stop spending |
| Supply-chain compromise | CI uses least-privilege token and no persisted checkout credentials | Action references should be SHA-pinned after trusted pin review |

## Security decisions required before production

- Adopt private networking and controlled egress where workload needs justify it.
- Define a federated, least-privilege deployment identity and approval workflow.
- Add Azure Policy assignments for allowed regions, required tags, and exposure.
- Add workload-specific RBAC only after data-plane dependencies are known.
- Define alerts, incident routing, retention, and evidence access controls.

