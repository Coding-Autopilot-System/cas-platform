targetScope = 'resourceGroup'

@description('Container App system-assigned identity principal identifier.')
param workloadPrincipalId string

@description('Explicit Foundry project resource identifier used as the role assignment scope.')
param foundryProjectResourceId string

@description('Explicit role definition resource identifier approved for the workload.')
param foundryRoleDefinitionResourceId string

var projectResourceIdParts = split(foundryProjectResourceId, '/')
var foundryAccountName = projectResourceIdParts[8]
var foundryProjectName = projectResourceIdParts[10]

resource foundryAccount 'Microsoft.CognitiveServices/accounts@2025-06-01' existing = {
  name: foundryAccountName
}

resource foundryProject 'Microsoft.CognitiveServices/accounts/projects@2025-06-01' existing = {
  parent: foundryAccount
  name: foundryProjectName
}

resource foundryProjectRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(foundryProject.id, workloadPrincipalId, foundryRoleDefinitionResourceId)
  scope: foundryProject
  properties: {
    principalId: workloadPrincipalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: foundryRoleDefinitionResourceId
  }
}

@description('Foundry project role assignment identifier.')
output roleAssignmentId string = foundryProjectRoleAssignment.id
