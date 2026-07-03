targetScope = 'resourceGroup'

@description('Short workload name.')
param workloadName string

@description('Deployment environment.')
param environment string

@description('Azure region.')
param location string

@description('Deterministic uniqueness suffix.')
param suffix string

@description('Log Analytics retention in days.')
param retentionDays int

@description('Common Azure resource tags.')
param tags object

@description('Allow public network access for observability ingestion and query. Secure default is false; individual environments (for example dev) may override to true.')
param allowPublicNetworkAccess bool = false

var publicNetworkAccess = allowPublicNetworkAccess ? 'Enabled' : 'Disabled'

resource workspace 'Microsoft.OperationalInsights/workspaces@2025-02-01' = {
  name: 'log-${workloadName}-${environment}-${suffix}'
  location: location
  tags: tags
  properties: {
    retentionInDays: retentionDays
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    publicNetworkAccessForIngestion: publicNetworkAccess
    publicNetworkAccessForQuery: publicNetworkAccess
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-${workloadName}-${environment}-${suffix}'
  location: location
  kind: 'web'
  tags: tags
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspace.id
    DisableLocalAuth: true
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: publicNetworkAccess
    publicNetworkAccessForQuery: publicNetworkAccess
  }
}

@description('Log Analytics workspace identifier.')
output logAnalyticsWorkspaceId string = workspace.id

@description('Application Insights resource identifier.')
output applicationInsightsId string = applicationInsights.id

@description('Non-secret Application Insights connection string injected into the workload.')
output applicationInsightsConnectionString string = applicationInsights.properties.ConnectionString
