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

resource workspace 'Microsoft.OperationalInsights/workspaces@2025-02-01' = {
  name: 'log-${workloadName}-${environment}-${suffix}'
  location: location
  tags: tags
  properties: {
    retentionInDays: retentionDays
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
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
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

@description('Log Analytics workspace identifier.')
output logAnalyticsWorkspaceId string = workspace.id

@description('Application Insights resource identifier.')
output applicationInsightsId string = applicationInsights.id

