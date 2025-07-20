import { blink } from '@/blink/client'
import { mockSalesforceData, getMockRevenueMetrics } from './mockData'

export interface SalesforceOpportunity {
  Id: string
  Name: string
  Account: {
    Name: string
  }
  Amount: number
  StageName: string
  Probability: number
  CloseDate: string
  Owner: {
    Name: string
    Email: string
  }
  CreatedDate: string
  LastModifiedDate: string
}

export interface SalesforceAccount {
  Id: string
  Name: string
  Type: string
  Industry: string
  AnnualRevenue: number
  NumberOfEmployees: number
}

export interface SalesforceForecast {
  Id: string
  PeriodId: string
  Quantity: number
  ForecastCategoryName: string
  CurrencyIsoCode: string
  SystemModstamp: string
}

export class SalesforceService {
  private static instance: SalesforceService
  private accessToken: string | null = null
  private instanceUrl: string | null = null
  private useMockData: boolean = false

  static getInstance(): SalesforceService {
    if (!SalesforceService.instance) {
      SalesforceService.instance = new SalesforceService()
    }
    return SalesforceService.instance
  }

  isUsingMockData(): boolean {
    return this.useMockData
  }

  isConnected(): boolean {
    return !this.useMockData && this.accessToken !== null
  }

  async authenticate(): Promise<void> {
    try {
      const response = await blink.data.fetch({
        url: 'https://login.salesforce.com/services/oauth2/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: '{{SALESFORCE_CLIENT_ID}}',
          client_secret: '{{SALESFORCE_CLIENT_SECRET}}',
          username: '{{SALESFORCE_USERNAME}}',
          password: '{{SALESFORCE_PASSWORD}}{{SALESFORCE_SECURITY_TOKEN}}'
        }).toString()
      })

      if (response.status === 200) {
        this.accessToken = response.body.access_token
        this.instanceUrl = response.body.instance_url
        console.log('✅ Salesforce authentication successful')
      } else {
        const errorMsg = response.body.error_description || response.body.error || 'Unknown authentication error'
        console.error('❌ Salesforce authentication failed:', errorMsg)
        throw new Error(`Authentication failed: ${errorMsg}`)
      }
    } catch (error) {
      console.error('❌ Salesforce authentication error:', error)
      console.log('🔄 Falling back to mock data for demo purposes')
      this.useMockData = true
      // Don't throw error, just use mock data
    }
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', body?: any): Promise<any> {
    if (!this.accessToken || !this.instanceUrl) {
      await this.authenticate()
    }

    const response = await blink.data.fetch({
      url: `${this.instanceUrl}${endpoint}`,
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (response.status === 401) {
      // Token expired, re-authenticate
      await this.authenticate()
      return this.makeRequest(endpoint, method, body)
    }

    if (response.status >= 400) {
      throw new Error(`Salesforce API error: ${response.status} ${response.body.message || response.body[0]?.message}`)
    }

    return response.body
  }

  async getOpportunities(limit: number = 50): Promise<SalesforceOpportunity[]> {
    if (this.useMockData) {
      console.log('📊 Using mock opportunities data')
      return mockSalesforceData.opportunities.slice(0, limit)
    }

    const query = `
      SELECT Id, Name, Account.Name, Amount, StageName, Probability, CloseDate, 
             Owner.Name, Owner.Email, CreatedDate, LastModifiedDate
      FROM Opportunity 
      WHERE IsClosed = false 
      ORDER BY LastModifiedDate DESC 
      LIMIT ${limit}
    `
    
    const response = await this.makeRequest(`/services/data/v58.0/query/?q=${encodeURIComponent(query)}`)
    return response.records
  }

  async getClosedOpportunities(days: number = 30): Promise<SalesforceOpportunity[]> {
    if (this.useMockData) {
      console.log('📊 Using mock closed opportunities data')
      return mockSalesforceData.closedOpportunities
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const query = `
      SELECT Id, Name, Account.Name, Amount, StageName, Probability, CloseDate, 
             Owner.Name, Owner.Email, CreatedDate, LastModifiedDate
      FROM Opportunity 
      WHERE IsClosed = true AND CloseDate >= ${startDate.toISOString().split('T')[0]}
      ORDER BY CloseDate DESC 
      LIMIT 100
    `
    
    const response = await this.makeRequest(`/services/data/v58.0/query/?q=${encodeURIComponent(query)}`)
    return response.records
  }

  async getAccounts(limit: number = 50): Promise<SalesforceAccount[]> {
    if (this.useMockData) {
      console.log('📊 Using mock accounts data')
      return mockSalesforceData.accounts.slice(0, limit)
    }

    const query = `
      SELECT Id, Name, Type, Industry, AnnualRevenue, NumberOfEmployees
      FROM Account 
      WHERE Type != null 
      ORDER BY LastModifiedDate DESC 
      LIMIT ${limit}
    `
    
    const response = await this.makeRequest(`/services/data/v58.0/query/?q=${encodeURIComponent(query)}`)
    return response.records
  }

  async getForecastData(): Promise<any> {
    const query = `
      SELECT Id, PeriodId, Quantity, ForecastCategoryName, CurrencyIsoCode, SystemModstamp
      FROM Forecast 
      ORDER BY SystemModstamp DESC 
      LIMIT 50
    `
    
    const response = await this.makeRequest(`/services/data/v58.0/query/?q=${encodeURIComponent(query)}`)
    return response.records
  }

  async getUsers(): Promise<any[]> {
    if (this.useMockData) {
      console.log('📊 Using mock users data')
      return mockSalesforceData.users
    }

    const query = `
      SELECT Id, Name, Email, Title, IsActive
      FROM User 
      WHERE IsActive = true AND UserType = 'Standard'
      ORDER BY Name 
      LIMIT 50
    `
    
    const response = await this.makeRequest(`/services/data/v58.0/query/?q=${encodeURIComponent(query)}`)
    return response.records
  }

  // Transform Salesforce data to our internal format
  transformOpportunityToDeal(opportunity: SalesforceOpportunity): any {
    const stageMapping: { [key: string]: string } = {
      'Prospecting': 'prospecting',
      'Qualification': 'qualification',
      'Needs Analysis': 'qualification',
      'Value Proposition': 'proposal',
      'Id. Decision Makers': 'proposal',
      'Perception Analysis': 'proposal',
      'Proposal/Price Quote': 'proposal',
      'Negotiation/Review': 'negotiation',
      'Closed Won': 'closed-won',
      'Closed Lost': 'closed-lost'
    }

    return {
      id: opportunity.Id,
      title: opportunity.Name,
      company: opportunity.Account?.Name || 'Unknown Company',
      value: opportunity.Amount || 0,
      stage: stageMapping[opportunity.StageName] || 'prospecting',
      probability: opportunity.Probability || 0,
      closeDate: opportunity.CloseDate,
      owner: opportunity.Owner?.Name || 'Unknown Owner',
      userId: opportunity.Owner?.Email || '',
      createdAt: opportunity.CreatedDate,
      updatedAt: opportunity.LastModifiedDate
    }
  }

  async getRevenueMetrics(): Promise<{
    totalRevenue: number
    dealsWon: number
    pipelineValue: number
    averageDealSize: number
  }> {
    if (this.useMockData) {
      console.log('📊 Using mock revenue metrics')
      return getMockRevenueMetrics()
    }

    const [closedOpps, openOpps] = await Promise.all([
      this.getClosedOpportunities(30),
      this.getOpportunities(1000)
    ])

    const wonOpps = closedOpps.filter(opp => opp.StageName === 'Closed Won')
    const totalRevenue = wonOpps.reduce((sum, opp) => sum + (opp.Amount || 0), 0)
    const pipelineValue = openOpps.reduce((sum, opp) => sum + (opp.Amount || 0), 0)
    const averageDealSize = wonOpps.length > 0 ? totalRevenue / wonOpps.length : 0

    return {
      totalRevenue,
      dealsWon: wonOpps.length,
      pipelineValue,
      averageDealSize
    }
  }
}

export const salesforceService = SalesforceService.getInstance()