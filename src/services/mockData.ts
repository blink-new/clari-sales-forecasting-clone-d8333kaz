// Mock data service for when Salesforce is not available
export const mockSalesforceData = {
  opportunities: [
    {
      Id: 'mock_001',
      Name: 'Enterprise Software License - Acme Corp',
      Account: { Name: 'Acme Corporation' },
      Amount: 125000,
      StageName: 'Proposal/Price Quote',
      Probability: 75,
      CloseDate: '2024-08-15',
      Owner: { Name: 'Sarah Johnson', Email: 'sarah.johnson@company.com' },
      CreatedDate: '2024-07-01T10:00:00.000Z',
      LastModifiedDate: '2024-07-20T14:30:00.000Z'
    },
    {
      Id: 'mock_002',
      Name: 'Cloud Migration Services - TechStart Inc',
      Account: { Name: 'TechStart Inc' },
      Amount: 85000,
      StageName: 'Negotiation/Review',
      Probability: 90,
      CloseDate: '2024-08-10',
      Owner: { Name: 'Mike Chen', Email: 'mike.chen@company.com' },
      CreatedDate: '2024-06-15T09:00:00.000Z',
      LastModifiedDate: '2024-07-18T16:45:00.000Z'
    },
    {
      Id: 'mock_003',
      Name: 'Annual Support Contract - Global Industries',
      Account: { Name: 'Global Industries' },
      Amount: 45000,
      StageName: 'Qualification',
      Probability: 60,
      CloseDate: '2024-09-01',
      Owner: { Name: 'Emily Rodriguez', Email: 'emily.rodriguez@company.com' },
      CreatedDate: '2024-07-10T11:30:00.000Z',
      LastModifiedDate: '2024-07-19T13:20:00.000Z'
    },
    {
      Id: 'mock_004',
      Name: 'Custom Development Project - StartupXYZ',
      Account: { Name: 'StartupXYZ' },
      Amount: 65000,
      StageName: 'Prospecting',
      Probability: 25,
      CloseDate: '2024-09-15',
      Owner: { Name: 'David Kim', Email: 'david.kim@company.com' },
      CreatedDate: '2024-07-05T08:15:00.000Z',
      LastModifiedDate: '2024-07-17T10:10:00.000Z'
    },
    {
      Id: 'mock_005',
      Name: 'Training and Consulting - MegaCorp',
      Account: { Name: 'MegaCorp' },
      Amount: 95000,
      StageName: 'Closed Won',
      Probability: 100,
      CloseDate: '2024-07-25',
      Owner: { Name: 'Lisa Wang', Email: 'lisa.wang@company.com' },
      CreatedDate: '2024-06-01T14:00:00.000Z',
      LastModifiedDate: '2024-07-25T17:30:00.000Z'
    }
  ],

  closedOpportunities: [
    {
      Id: 'mock_closed_001',
      Name: 'Q2 Software Upgrade - RetailChain',
      Account: { Name: 'RetailChain' },
      Amount: 75000,
      StageName: 'Closed Won',
      Probability: 100,
      CloseDate: '2024-07-15',
      Owner: { Name: 'Sarah Johnson', Email: 'sarah.johnson@company.com' },
      CreatedDate: '2024-05-01T10:00:00.000Z',
      LastModifiedDate: '2024-07-15T16:00:00.000Z'
    },
    {
      Id: 'mock_closed_002',
      Name: 'Security Audit Services - FinanceFirst',
      Account: { Name: 'FinanceFirst' },
      Amount: 55000,
      StageName: 'Closed Won',
      Probability: 100,
      CloseDate: '2024-07-08',
      Owner: { Name: 'Mike Chen', Email: 'mike.chen@company.com' },
      CreatedDate: '2024-05-15T09:30:00.000Z',
      LastModifiedDate: '2024-07-08T14:20:00.000Z'
    }
  ],

  accounts: [
    {
      Id: 'mock_acc_001',
      Name: 'Acme Corporation',
      Type: 'Customer',
      Industry: 'Technology',
      AnnualRevenue: 50000000,
      NumberOfEmployees: 500
    },
    {
      Id: 'mock_acc_002',
      Name: 'TechStart Inc',
      Type: 'Prospect',
      Industry: 'Software',
      AnnualRevenue: 10000000,
      NumberOfEmployees: 150
    },
    {
      Id: 'mock_acc_003',
      Name: 'Global Industries',
      Type: 'Customer',
      Industry: 'Manufacturing',
      AnnualRevenue: 100000000,
      NumberOfEmployees: 1200
    }
  ],

  users: [
    {
      Id: 'mock_user_001',
      Name: 'Sarah Johnson',
      Email: 'sarah.johnson@company.com',
      Title: 'Senior Sales Manager',
      IsActive: true
    },
    {
      Id: 'mock_user_002',
      Name: 'Mike Chen',
      Email: 'mike.chen@company.com',
      Title: 'Account Executive',
      IsActive: true
    },
    {
      Id: 'mock_user_003',
      Name: 'Emily Rodriguez',
      Email: 'emily.rodriguez@company.com',
      Title: 'Sales Representative',
      IsActive: true
    },
    {
      Id: 'mock_user_004',
      Name: 'David Kim',
      Email: 'david.kim@company.com',
      Title: 'Business Development Manager',
      IsActive: true
    },
    {
      Id: 'mock_user_005',
      Name: 'Lisa Wang',
      Email: 'lisa.wang@company.com',
      Title: 'Sales Director',
      IsActive: true
    }
  ]
}

export function getMockRevenueMetrics() {
  const closedWonOpps = mockSalesforceData.closedOpportunities.filter(opp => opp.StageName === 'Closed Won')
  const openOpps = mockSalesforceData.opportunities.filter(opp => opp.StageName !== 'Closed Won')
  
  const totalRevenue = closedWonOpps.reduce((sum, opp) => sum + (opp.Amount || 0), 0)
  const pipelineValue = openOpps.reduce((sum, opp) => sum + (opp.Amount || 0), 0)
  const averageDealSize = closedWonOpps.length > 0 ? totalRevenue / closedWonOpps.length : 0

  return {
    totalRevenue,
    dealsWon: closedWonOpps.length,
    pipelineValue,
    averageDealSize
  }
}