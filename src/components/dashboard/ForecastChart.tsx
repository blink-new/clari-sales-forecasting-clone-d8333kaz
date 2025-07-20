import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { useSalesforceOpportunities } from '@/hooks/useSalesforceData'
import { useMemo } from 'react'

interface ForecastData {
  month: string
  committed: number
  bestCase: number
  pipeline: number
  closed: number
}

export function ForecastChart() {
  const { opportunities, loading } = useSalesforceOpportunities()

  const forecastData = useMemo(() => {
    if (!opportunities.length) return []

    // Generate last 6 months of data based on Salesforce opportunities
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    const currentMonth = new Date().getMonth()
    
    return months.map((month, index) => {
      const monthIndex = (currentMonth - 5 + index + 12) % 12
      const monthOpportunities = opportunities.filter(opp => {
        const closeDate = new Date(opp.closeDate)
        return closeDate.getMonth() === monthIndex
      })

      const closed = monthOpportunities
        .filter(opp => opp.stage === 'closed-won')
        .reduce((sum, opp) => sum + opp.value, 0)

      const committed = monthOpportunities
        .filter(opp => opp.probability >= 75)
        .reduce((sum, opp) => sum + opp.value, 0)

      const bestCase = monthOpportunities
        .filter(opp => opp.probability >= 50)
        .reduce((sum, opp) => sum + opp.value, 0)

      const pipeline = monthOpportunities
        .reduce((sum, opp) => sum + opp.value, 0)

      return {
        month,
        committed,
        bestCase,
        pipeline,
        closed
      }
    })
  }, [opportunities])

  if (loading) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Revenue Forecast Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Revenue Forecast Trend</CardTitle>
        <p className="text-sm text-gray-500">Based on {opportunities.length} Salesforce opportunities</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              className="text-xs"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              className="text-xs"
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M`, '']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="closed" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Closed Won"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="committed" 
              stroke="#2563eb" 
              strokeWidth={3}
              name="Committed"
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="bestCase" 
              stroke="#f59e0b" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Best Case"
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="pipeline" 
              stroke="#6b7280" 
              strokeWidth={2}
              strokeDasharray="3 3"
              name="Pipeline"
              dot={{ fill: '#6b7280', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}