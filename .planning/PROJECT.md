# CAS Platform

## What This Is

CAS Platform is the Azure deployment and observability foundation for the
Coding Autopilot System portfolio. It gives AI-native development workloads a
repeatable, environment-isolated, identity-first platform that can be reviewed
and validated safely before any Azure deployment.

## Core Value

An operator can confidently understand and validate a secure CAS Azure
environment before deploying it.

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] Provision environment-isolated Azure foundations from reusable Bicep.
- [ ] Use system-assigned managed identity and no embedded secrets.
- [ ] Provide centralized telemetry, cost controls, tags, and safe what-if.
- [ ] Publish architecture, threat model, operations, and contribution evidence.

### Out of Scope

- Automatic Azure deployment - v0.1 stops at safe validation and what-if.
- Workload business logic - owned by CAS workload repositories.
- Static credentials - managed identity is mandatory.
- Shared production networking - requires explicit landing-zone decisions.

## Context

The CAS portfolio needs a credible production platform connecting its
orchestration and reference-product repositories. This repository owns Azure
infrastructure definitions and operational proof, not application execution or
developer workstation setup.

## Constraints

- **Identity**: System-assigned managed identities and least privilege only.
- **Secrets**: No secrets, keys, or tokens in templates, parameters, or outputs.
- **Compute**: Container Apps for container workloads; Flex Consumption Linux
  for future event-driven Functions where appropriate.
- **Safety**: No Azure resources may be deployed during v0.1 implementation.
- **Portability**: One module graph must support dev, test, and production.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Subscription-scope orchestrator | Creates isolated resource groups consistently | Pending |
| Container Apps for v0.1 compute | Fits containerized CAS services and managed identity | Pending |
| Azure Monitor diagnostics without shared keys | Preserves no-secret requirement | Pending |
| Deployment workflow deferred | Identity and approvals must be designed first | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries. After each
phase, requirements and decisions are updated from verification evidence.

---
*Last updated: 2026-06-11 after initialization*

