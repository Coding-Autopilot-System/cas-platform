targetScope = 'resourceGroup'

@description('Short workload name.')
param workloadName string

@description('Deployment environment.')
param environment string

@description('Azure region.')
param location string

@description('Deterministic uniqueness suffix.')
param suffix string

@description('Non-secret Application Insights connection string injected by the platform.')
param applicationInsightsConnectionString string

@description('Log Analytics workspace identifier for diagnostic settings.')
param logAnalyticsWorkspaceId string

@description('Common Azure resource tags.')
param tags object

resource storageAccount 'Microsoft.Storage/storageAccounts@2025-01-01' = {
  name: 'st${workloadName}${environment}${suffix}'
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
  }
}

resource hostingPlan 'Microsoft.Web/serverfarms@2025-03-01' = {
  name: 'plan-${workloadName}-${environment}-${suffix}'
  location: location
  tags: tags
  sku: {
    name: 'FC1'
    tier: 'FlexConsumption'
  }
  properties: {
    reserved: true
  }
}

resource functionApp 'Microsoft.Web/sites@2025-03-01' = {
  name: 'func-${workloadName}-${environment}-${suffix}'
  location: location
  tags: tags
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: hostingPlan.id
    siteConfig: {
      linuxFxVersion: 'PYTHON|3.12'
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsightsConnectionString
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'python'
        }
      ]
    }
    httpsOnly: true
  }
}

#disable-next-line use-recent-api-versions
resource appDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'send-to-log-analytics'
  scope: functionApp
  properties: {
    workspaceId: logAnalyticsWorkspaceId
    logs: [
      {
        categoryGroup: 'allLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

@description('Function App identifier.')
output functionAppId string = functionApp.id

@description('System-assigned managed identity principal identifier.')
output workloadPrincipalId string = functionApp.identity.principalId
