import { useState, useEffect } from 'react'
import { salesforceService, SalesforceOpportunity } from '@/services/salesforce'
import { Deal } from '@/types'

export function useSalesforceOpportunities() {
  const [opportunities, setOpportunities] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        setLoading(true)
        setError(null)
        const sfOpportunities = await salesforceService.getOpportunities(50)
        const transformedDeals = sfOpportunities.map(opp => 
          salesforceService.transformOpportunityToDeal(opp)
        )
        setOpportunities(transformedDeals)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch opportunities')
        console.error('Error fetching Salesforce opportunities:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  return { opportunities, loading, error, refetch: () => fetchOpportunities() }
}

export function useSalesforceMetrics() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    dealsWon: 0,
    pipelineValue: 0,
    averageDealSize: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setLoading(true)
        setError(null)
        const revenueMetrics = await salesforceService.getRevenueMetrics()
        setMetrics(revenueMetrics)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
        console.error('Error fetching Salesforce metrics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  return { metrics, loading, error, refetch: () => fetchMetrics() }
}

export function useSalesforceUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        setError(null)
        const sfUsers = await salesforceService.getUsers()
        setUsers(sfUsers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users')
        console.error('Error fetching Salesforce users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return { users, loading, error, refetch: () => fetchUsers() }
}