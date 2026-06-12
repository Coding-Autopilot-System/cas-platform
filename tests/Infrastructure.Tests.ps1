BeforeAll {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    $main = Get-Content -Raw (Join-Path $repoRoot 'infra/main.bicep')
    $compute = Get-Content -Raw (Join-Path $repoRoot 'infra/modules/container-apps.bicep')
    $observability = Get-Content -Raw (Join-Path $repoRoot 'infra/modules/observability.bicep')
    $foundryRbac = Get-Content -Raw (Join-Path $repoRoot 'infra/modules/foundry-rbac.bicep')
    $whatIf = Get-Content -Raw (Join-Path $repoRoot 'scripts/what-if.ps1')
}

Describe 'CAS platform infrastructure contracts' {
    It 'uses subscription scope orchestration' {
        $main | Should -Match "targetScope = 'subscription'"
    }

    It 'creates a system-assigned workload identity' {
        $compute | Should -Match "type: 'SystemAssigned'"
    }

    It 'disables external ingress by default' {
        $main | Should -Match 'param enableExternalIngress bool = false'
        $compute | Should -Match 'allowInsecure: false'
        $compute | Should -Match 'targetPort: 8080'
    }

    It 'injects the complete reference product configuration contract' {
        @(
            'ENVIRONMENT',
            'WORKFLOW_BACKEND',
            'FOUNDRY_PROJECT_ENDPOINT',
            'FOUNDRY_AGENT_NAME',
            'APPLICATIONINSIGHTS_CONNECTION_STRING'
        ) | ForEach-Object {
            $compute | Should -Match "name: '$_'"
        }
        $observability | Should -Match 'output applicationInsightsConnectionString string'
    }

    It 'configures the reference product health probes' {
        $compute | Should -Match "type: 'Liveness'"
        $compute | Should -Match "path: '/health/live'"
        $compute | Should -Match "type: 'Readiness'"
        $compute | Should -Match "path: '/health/ready'"
    }

    It 'exposes the workload principal identifier' {
        $compute | Should -Match 'output workloadPrincipalId string'
        $main | Should -Match 'output workloadPrincipalId string'
    }

    It 'makes Foundry RBAC optional and requires explicit paired inputs' {
        $main | Should -Match "param foundryProjectResourceId string = ''"
        $main | Should -Match "param foundryRoleDefinitionResourceId string = ''"
        $main | Should -Match 'var enableFoundryRbac = !empty\(foundryProjectResourceId\) && !empty\(foundryRoleDefinitionResourceId\)'
        $main | Should -Match 'if \(enableFoundryRbac\)'
    }

    It 'scopes optional Foundry RBAC to the explicit project resource' {
        $foundryRbac | Should -Match "resource foundryProject 'Microsoft.CognitiveServices/accounts/projects@"
        $foundryRbac | Should -Match 'scope: foundryProject'
        $foundryRbac | Should -Match 'roleDefinitionId: foundryRoleDefinitionResourceId'
        $foundryRbac | Should -Not -Match "scope: subscription\(\)"
    }

    It 'keeps the what-if script non-deploying' {
        $whatIf | Should -Match 'az deployment sub what-if'
        $whatIf | Should -Not -Match 'az deployment sub create'
        $whatIf | Should -Not -Match 'az deployment group create'
    }

    It 'defines all supported environments' {
        @('dev', 'test', 'prod') | ForEach-Object {
            Join-Path $repoRoot "infra/parameters/$_.bicepparam" | Should -Exist
        }
    }
}
