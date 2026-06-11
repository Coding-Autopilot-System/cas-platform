# Requirements: CAS Platform

**Defined:** 2026-06-11
**Core Value:** An operator can confidently understand and validate a secure CAS Azure environment before deploying it.

## v1 Requirements

### Infrastructure

- [x] **INFRA-01**: Operator can build one subscription-scope Bicep entrypoint.
- [x] **INFRA-02**: Operator can select isolated dev, test, or prod parameters.
- [x] **INFRA-03**: Operator receives deterministic naming and mandatory tags.
- [x] **INFRA-04**: Operator can host a container workload in Container Apps.

### Security

- [x] **SEC-01**: Workload uses a system-assigned managed identity.
- [x] **SEC-02**: Templates and parameters contain no credentials or secrets.
- [x] **SEC-03**: Public workload ingress is disabled by default.
- [x] **SEC-04**: Repository publishes a threat model and security policy.

### Operations

- [x] **OPS-01**: Operator receives Log Analytics and Application Insights.
- [x] **OPS-02**: Workload diagnostics route to Log Analytics.
- [x] **OPS-03**: Operator can configure an optional environment budget.
- [x] **OPS-04**: Operator can run a non-deploying Azure what-if.

### Quality

- [x] **QUAL-01**: Contributor can run Bicep and parameter validation locally.
- [x] **QUAL-02**: Repository enforces infrastructure contract tests.
- [x] **QUAL-03**: Repository documents architecture, operations, and contribution flow.
- [x] **QUAL-04**: CI runs validation with least-privilege repository permissions.

## v2 Requirements

- **NET-01**: Operator can enable private networking and controlled egress.
- **GOV-01**: Operator can apply Azure Policy and compliance reporting.
- **DEL-01**: Authorized workload identity can promote reviewed infrastructure.
- **OBS-01**: Operator receives SLO alerts, dashboards, and incident routing.
- **SUP-01**: Releases include SBOM, signatures, and attestations.

## Out of Scope

| Feature | Reason |
|---|---|
| Azure deployment in v0.1 | User explicitly prohibited deployment |
| Workload business logic | Owned by reference product and service repos |
| Static credentials | Conflicts with identity-first architecture |

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| INFRA-01, INFRA-02, INFRA-03, INFRA-04 | Phase 1 | Complete |
| SEC-01, SEC-02, SEC-03, SEC-04 | Phase 1 | Complete |
| OPS-01, OPS-02, OPS-03, OPS-04 | Phase 1 | Complete |
| QUAL-01, QUAL-02, QUAL-03, QUAL-04 | Phase 1 | Complete |

**Coverage:** 16 v1 requirements, 16 mapped, 0 unmapped.

---
*Last updated: 2026-06-11 after v0.1 foundation*

