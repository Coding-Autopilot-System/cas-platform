targetScope = 'resourceGroup'

@description('Short workload name.')
param workloadName string

@description('Deployment environment.')
param environment string

@description('Azure region.')
param location string

@description('Deterministic uniqueness suffix.')
param suffix string

@description('Container image.')
param containerImage string

@description('Whether public ingress is enabled.')
param enableExternalIngress bool

@description('Log Analytics workspace identifier for diagnostic settings.')
param logAnalyticsWorkspaceId string

@description('Common Azure resource tags.')
param tags object

resource managedEnvironment 'Microsoft.App/managedEnvironments@2025-01-01' = {
  name: 'cae-${workloadName}-${environment}-${suffix}'
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'azure-monitor'
    }
    zoneRedundant: environment == 'prod'
  }
}

resource containerApp 'Microsoft.App/containerApps@2025-01-01' = {
  name: 'ca-${workloadName}-${environment}-${suffix}'
  location: location
  tags: tags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    managedEnvironmentId: managedEnvironment.id
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: {
        external: enableExternalIngress
        allowInsecure: false
        targetPort: 8080
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: 'platform'
          image: containerImage
          resources: {
            cpu: json('0.25')
            memory: '0.5Gi'
          }
        }
      ]
      scale: {
        minReplicas: environment == 'prod' ? 1 : 0
        maxReplicas: environment == 'prod' ? 5 : 2
      }
    }
  }
}

#disable-next-line use-recent-api-versions
resource appDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'send-to-log-analytics'
  scope: containerApp
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

@description('Container App identifier.')
output containerAppId string = containerApp.id

@description('System-assigned managed identity principal identifier.')
output workloadPrincipalId string = containerApp.identity.principalId

