using '../main.bicep'

param environment = 'test'
param location = 'northeurope'
param owner = 'Coding-Autopilot-System'
param costCenter = 'portfolio'
param dataClassification = 'internal'
param containerImage = 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
param enableExternalIngress = false
param logRetentionDays = 30
param monthlyBudget = 0
param budgetContactEmails = []

