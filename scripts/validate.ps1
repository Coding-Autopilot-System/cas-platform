[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$infraRoot = Join-Path $repoRoot 'infra'

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    throw 'Azure CLI is required.'
}

Push-Location $repoRoot
try {
    az bicep build --file (Join-Path $infraRoot 'main.bicep') --stdout | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Bicep build failed.'
    }

    Get-ChildItem (Join-Path $infraRoot 'parameters') -Filter '*.bicepparam' |
        ForEach-Object {
            az bicep build-params --file $_.FullName --stdout | Out-Null
            if ($LASTEXITCODE -ne 0) {
                throw "Bicep parameter build failed: $($_.Name)"
            }
        }

    $forbidden = Get-ChildItem -Recurse -File |
        Where-Object { $_.FullName -notmatch '[\\/]\.git[\\/]' -and $_.FullName -ne $PSCommandPath } |
        Select-String -Pattern 'password\s*=|clientSecret|accessKey|sharedKey' -CaseSensitive:$false
    if ($forbidden) {
        throw "Potential secret material found:`n$($forbidden | Out-String)"
    }

    $workflow = Get-Content -Raw '.github/workflows/validate.yml'
    if ($workflow -notmatch 'permissions:\s*\r?\n\s+contents: read') {
        throw 'Workflow must retain least-privilege contents: read permissions.'
    }

    if (Get-Command Invoke-Pester -ErrorAction SilentlyContinue) {
        $result = Invoke-Pester -Path 'tests' -PassThru
        if ($result.FailedCount -gt 0) {
            throw "$($result.FailedCount) Pester tests failed."
        }
    }
    else {
        Write-Warning 'Pester 5+ is not installed; contract tests were skipped.'
    }
}
finally {
    Pop-Location
}

Write-Host 'CAS platform validation passed.'

