# CAS Platform Agent Guide

## Scope

This repository owns Azure infrastructure and operational evidence for CAS.
Do not add application business logic or workstation configuration.

## Mandatory workflow

1. Read `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, and the nearest
   architecture or context document.
2. Research Azure resource behavior before changing module contracts.
3. Keep `infra/main.bicep` orchestration-only and modules concern-focused.
4. Use system-assigned managed identity, least privilege, and no secrets.
5. Run `./scripts/validate.ps1` and review Azure what-if before deployment.
6. Never deploy Azure resources without explicit authorization.

## GSD

Use GSD planning artifacts under `.planning/`. Plan and verify each roadmap
phase before marking requirements complete.

