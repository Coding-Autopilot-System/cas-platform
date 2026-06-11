BeforeAll {
    $repoRoot = Split-Path -Parent $PSScriptRoot
    $main = Get-Content -Raw (Join-Path $repoRoot 'infra/main.bicep')
    $compute = Get-Content -Raw (Join-Path $repoRoot 'infra/modules/container-apps.bicep')
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
    }

    It 'does not grant RBAC before dependencies exist' {
        $allBicep = Get-ChildItem (Join-Path $repoRoot 'infra') -Recurse -Filter '*.bicep' |
            Get-Content -Raw
        ($allBicep -join "`n") | Should -Not -Match 'roleAssignments'
    }

    It 'keeps the what-if script non-deploying' {
        $whatIf | Should -Match 'az deployment sub what-if'
        $whatIf | Should -Not -Match 'az deployment sub create'
    }

    It 'defines all supported environments' {
        @('dev', 'test', 'prod') | ForEach-Object {
            Join-Path $repoRoot "infra/parameters/$_.bicepparam" | Should -Exist
        }
    }
}

