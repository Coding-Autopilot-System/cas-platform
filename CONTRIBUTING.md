# Contributing

1. Create a focused branch and describe the operational outcome.
2. Update architecture, threat model, and parameter examples when behavior
   changes.
3. Run `./scripts/validate.ps1`. If local execution policy blocks scripts, use
   `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\validate.ps1`.
4. Run `./scripts/what-if.ps1` against a non-production subscription when the
   change affects Azure resources.
5. Include the reviewed what-if summary in the pull request.

Never introduce deployment commands into validation scripts. Production
promotion requires human approval and a separately governed delivery workflow.
