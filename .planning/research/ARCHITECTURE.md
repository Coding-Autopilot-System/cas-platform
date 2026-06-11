# Architecture Research

The smallest useful boundary is a subscription-scope orchestrator that creates
one resource group per environment. Coherent resource-group modules own
observability, compute, and budget concerns. The top-level entrypoint only
coordinates parameters, scopes, dependencies, and non-secret outputs.

Build order: governance and contracts, observability, compute identity, cost
controls, static validation, then separately governed delivery automation.

