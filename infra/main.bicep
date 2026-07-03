targetScope = 'subscription'

@description('Short workload name used in Azure resource names.')
@minLength(2)
@maxLength(20)
param workloadName string = 'cas'

@description('Deployment environment.')
@allowed([
  'dev'
  'test'
  'prod'
])
param environment string

@description('Azure region for the environment.')
param location string = 'northeurope'

@description('Owning team or person.')
param owner string

@description('Cost allocation identifier.')
param costCenter string

@description('Data classification tag.')
@allowed([
  'public'
  'internal'
  'confidential'
])
param dataClassification string = 'internal'

@description('Container image for the foundation workload.')
param containerImage string

@description('Workflow backend selected by the reference product.')
@allowed([
  'local'
  'foundry'
])
param workflowBackend string = 'local'

@description('Foundry project endpoint. Required by the application when workflowBackend is foundry.')
param foundryProjectEndpoint string = ''

@description('Foundry Next Gen agent name. Required by the application when workflowBackend is foundry.')
param foundryAgentName string = ''

@description('Optional explicit Foundry project resource identifier used as the narrow RBAC scope.')
param foundryProjectResourceId string = ''

@description('Optional explicit role definition resource identifier approved for the workload at the Foundry project scope.')
param foundryRoleDefinitionResourceId string = ''

@description('Whether the Container App accepts public network ingress.')
param enableExternalIngress bool = false

@description('Log Analytics retention in days.')
@minValue(30)
param logRetentionDays int = 30

@description('Allow public network access to Log Analytics and Application Insights ingestion/query. Secure default is false; lower environments (for example dev) may override to true.')
param allowObservabilityPublicNetworkAccess bool = false

@description('Optional monthly resource-group budget. Set to zero to disable.')
@minValue(0)
param monthlyBudget int = 0

@description('Non-secret email addresses notified by the optional budget.')
param budgetContactEmails array = []

var suffix = take(uniqueString(subscription().subscriptionId, workloadName, environment, location), 6)
var enableFoundryRbac = !empty(foundryProjectResourceId) && !empty(foundryRoleDefinitionResourceId)
var resourceGroupName = 'rg-${workloadName}-${environment}-${suffix}'
var tags = {
  application: workloadName
  environment: environment
  owner: owner
  costCenter: costCenter
  dataClassification: dataClassification
  managedBy: 'bicep'
  repository: 'Coding-Autopilot-System/cas-platform'
}

resource environmentResourceGroup 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: location
  tags: tags
}

module observability './modules/observability.bicep' = {
  name: 'observability-${environment}'
  scope: environmentResourceGroup
  params: {
    workloadName: workloadName
    environment: environment
    location: location
    suffix: suffix
    retentionDays: logRetentionDays
    allowPublicNetworkAccess: allowObservabilityPublicNetworkAccess
    tags: tags
  }
}

module compute './modules/container-apps.bicep' = {
  name: 'compute-${environment}'
  scope: environmentResourceGroup
  params: {
    workloadName: workloadName
    environment: environment
    location: location
    suffix: suffix
    containerImage: containerImage
    workflowBackend: workflowBackend
    foundryProjectEndpoint: foundryProjectEndpoint
    foundryAgentName: foundryAgentName
    applicationInsightsConnectionString: observability.outputs.applicationInsightsConnectionString
    enableExternalIngress: enableExternalIngress
    logAnalyticsWorkspaceId: observability.outputs.logAnalyticsWorkspaceId
    tags: tags
  }
}

module foundryRbac './modules/foundry-rbac.bicep' = if (enableFoundryRbac) {
  name: 'foundry-rbac-${environment}'
  scope: resourceGroup(split(foundryProjectResourceId, '/')[2], split(foundryProjectResourceId, '/')[4])
  params: {
    workloadPrincipalId: compute.outputs.workloadPrincipalId
    foundryProjectResourceId: foundryProjectResourceId
    foundryRoleDefinitionResourceId: foundryRoleDefinitionResourceId
  }
}

module budget './modules/budget.bicep' = if (monthlyBudget > 0 && length(budgetContactEmails) > 0) {
  name: 'budget-${environment}'
  scope: environmentResourceGroup
  params: {
    budgetName: '${workloadName}-${environment}-monthly'
    monthlyBudget: monthlyBudget
    contactEmails: budgetContactEmails
  }
}

@description('Environment resource group identifier.')
output resourceGroupId string = environmentResourceGroup.id

@description('Container App identifier.')
output containerAppId string = compute.outputs.containerAppId

@description('System-assigned managed identity principal identifier.')
output workloadPrincipalId string = compute.outputs.workloadPrincipalId

@description('Log Analytics workspace identifier.')
output logAnalyticsWorkspaceId string = observability.outputs.logAnalyticsWorkspaceId

@description('Application Insights resource identifier.')
output applicationInsightsId string = observability.outputs.applicationInsightsId
