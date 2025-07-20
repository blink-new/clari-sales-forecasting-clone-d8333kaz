import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useSalesforceOpportunities } from '@/hooks/useSalesforceData'
import { useMemo } from 'react'

const stageConfig = [
  { id: 'prospecting', name: 'Prospecting', probability: 10 },
  { id: 'qualification', name: 'Qualification', probability: 25 },
  { id: 'proposal', name: 'Proposal', probability: 50 },
  { id: 'negotiation', name: 'Negotiation', probability: 75 },
  { id: 'closed-won', name: 'Closed Won', probability: 100 },
]

export function PipelineOverview() {
  const { opportunities, loading } = useSalesforceOpportunities()

  const pipelineData = useMemo(() => {
    if (!opportunities.length) return []

    return stageConfig.map(stage => {
      const stageOpportunities = opportunities.filter(opp => opp.stage === stage.id)
      const totalValue = stageOpportunities.reduce((sum, opp) => sum + opp.value, 0)
      
      return {
        stage: stage.name,
        deals: stageOpportunities.length,
        value: totalValue,
        probability: stage.probability
      }
    })
  }, [opportunities])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pipeline by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline by Stage</CardTitle>
        <p className="text-sm text-gray-500">Based on {opportunities.length} Salesforce opportunities</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {pipelineData.map((stage) => (
            <div key={stage.stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stage.deals} deals
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ${(stage.value / 1000000).toFixed(1)}M
                </span>
              </div>
              <Progress 
                value={stage.probability} 
                className="h-2"
              />
            </div>
          ))}
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData}>
              <XAxis 
                dataKey="stage" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, 'Value']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}