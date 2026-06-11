# Roadmap: CAS Platform

## Phase 1: Safe Azure Foundation

**Goal:** Deliver a useful, non-deploying v0.1 platform foundation.

**Requirements:** INFRA-01 through INFRA-04, SEC-01 through SEC-04, OPS-01
through OPS-04, QUAL-01 through QUAL-04.

**Success criteria:**
1. Bicep and all environment parameter files build successfully.
2. Contract tests prove identity, ingress, environment, and what-if safeguards.
3. Architecture and threat model accurately describe residual risk.
4. Repository can be created publicly and CI can validate the foundation.

## Phase 2: Network and Policy Guardrails

Add private networking, controlled egress, Azure Policy, and compliance
reporting after target subscription architecture is agreed.

## Phase 3: Federated Delivery

Add OIDC/managed-identity deployment workflows, approvals, evidence retention,
and safe promotion between environments.

## Phase 4: Production Operations

Add alerts, SLOs, dashboards, incident routing, release attestations, and
recovery exercises.

