using '../main.bicep'

param environment = 'dev'
param location = 'northeurope'
param owner = 'Coding-Autopilot-System'
param costCenter = 'portfolio'
param dataClassification = 'internal'
param containerImage = 'ghcr.io/coding-autopilot-system/cas-reference-product:0.1.0'
param workflowBackend = 'local'
param foundryProjectEndpoint = ''
param foundryAgentName = ''
param foundryProjectResourceId = ''
param foundryRoleDefinitionResourceId = ''
param enableExternalIngress = false
param logRetentionDays = 30
param monthlyBudget = 0
param budgetContactEmails = []
