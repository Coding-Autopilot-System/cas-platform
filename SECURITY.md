# Security Policy

## Reporting

Report suspected vulnerabilities through GitHub private vulnerability
reporting. Do not open a public issue containing exploit details, credentials,
tenant identifiers, or production evidence.

## Supported versions

Only the latest release and the default branch receive security fixes.

## Security baseline

- Never commit secrets, credentials, tenant-specific identifiers, or state.
- Use managed identity and least-privilege RBAC.
- Keep public ingress disabled unless an explicit threat review approves it.
- Run Bicep build, lint, contract tests, and Azure what-if before deployment.
- Review replacement and deletion effects before approving any what-if.

