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

@description('Workflow backend selected by the workload.')
@allowed([
  'local'
  'foundry'
])
param workflowBackend string

@description('Foundry project endpoint used by the workload. Required by the application when workflowBackend is foundry.')
param foundryProjectEndpoint string

@description('Foundry Next Gen agent name used by the workload. Required by the application when workflowBackend is foundry.')
param foundryAgentName string

@description('Non-secret Application Insights connection string injected by the platform.')
param applicationInsightsConnectionString string

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
          name: 'cas-reference-product'
          image: containerImage
          env: [
            {
              name: 'ENVIRONMENT'
              value: environment
            }
            {
              name: 'WORKFLOW_BACKEND'
              value: workflowBackend
            }
            {
              name: 'FOUNDRY_PROJECT_ENDPOINT'
              value: foundryProjectEndpoint
            }
            {
              name: 'FOUNDRY_AGENT_NAME'
              value: foundryAgentName
            }
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: applicationInsightsConnectionString
            }
          ]
          probes: [
            {
              type: 'Liveness'
              httpGet: {
                path: '/health/live'
                port: 8080
                scheme: 'HTTP'
              }
              initialDelaySeconds: 5
              periodSeconds: 10
              timeoutSeconds: 2
              failureThreshold: 3
            }
            {
              type: 'Readiness'
              httpGet: {
                path: '/health/ready'
                port: 8080
                scheme: 'HTTP'
              }
              initialDelaySeconds: 5
              periodSeconds: 10
              timeoutSeconds: 2
              failureThreshold: 3
            }
          ]
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
