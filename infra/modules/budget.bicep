targetScope = 'resourceGroup'

@description('Budget resource name.')
param budgetName string

@description('Monthly budget amount.')
@minValue(0)
param monthlyBudget int

@description('Non-secret budget notification email addresses.')
@minLength(1)
param contactEmails array

@description('Budget start date. Defaults to the first day of the deployment month.')
param budgetStartDate string = utcNow('yyyy-MM-01')

resource budget 'Microsoft.Consumption/budgets@2024-08-01' = {
  name: budgetName
  properties: {
    amount: monthlyBudget
    category: 'Cost'
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: budgetStartDate
      endDate: '2035-12-31'
    }
    notifications: {
      forecasted100: {
        enabled: true
        operator: 'GreaterThanOrEqualTo'
        threshold: 100
        thresholdType: 'Forecasted'
        contactEmails: contactEmails
      }
      actual80: {
        enabled: true
        operator: 'GreaterThanOrEqualTo'
        threshold: 80
        thresholdType: 'Actual'
        contactEmails: contactEmails
      }
    }
  }
}

