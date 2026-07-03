# CAS Platform Documentation

Welcome to the **CAS Platform** developer documentation. This repository provides the production-oriented Azure infrastructure foundation for the Coding Autopilot System (CAS).

## Overview

The `cas-platform` repository manages the deployment of environment-isolated infrastructure components using Azure Bicep. It ensures a consistent, secure, and observable foundation for hosting the `cas-reference-product` and related workloads.

### Key Features
* **Environment Isolation:** Separate resource groups, telemetry, and compute environments for `dev`, `test`, and `prod`.
* **Zero Secrets & Least Privilege:** Utilizes system-assigned managed identities and restricts access using narrow role-based access control (RBAC). No connection strings or secrets are stored or exposed.
* **Observability by Default:** Integrated Log Analytics and workspace-based Application Insights with automatic diagnostic settings.
* **Cost Management:** Built-in resource group level budgets and notifications.

## Quick Links

* 🏗️ **[Architecture](architecture.md)**: Explore the resource hierarchy, component interactions, and the system diagram.
* 🛡️ **[Threat Model](threat-model.md)**: Understand the security posture, trust boundaries, and mitigations.
* ⚙️ **[Operations](operations.md)**: Guide on deployments, incident response, scaling, and managing environments.

## Repository Structure

* `infra/` - Azure Bicep modules and the main subscription-scoped orchestrator.
* `docs/` - System documentation and architectural decision records (ADRs).
* `scripts/` - Automation scripts for validation, linting, and deployment previews (`what-if`).
* `.planning/` - GSD planning artifacts and requirement traceability.
