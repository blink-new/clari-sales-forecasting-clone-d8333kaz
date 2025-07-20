import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, RefreshCw } from 'lucide-react'
import { useSalesforceOpportunities } from '@/hooks/useSalesforceData'
import { useMemo } from 'react'

interface Insight {
  id: string
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
}

export function AIInsightsEnhanced() {
  const { opportunities, loading, refetch } = useSalesforceOpportunities()

  const insights = useMemo((): Insight[] => {
    if (!opportunities.length) return []

    const insights: Insight[] = []

    // Analyze deal velocity
    const avgDealSize = opportunities.reduce((sum, opp) => sum + opp.value, 0) / opportunities.length
    const highValueDeals = opportunities.filter(opp => opp.value > avgDealSize * 1.5)
    
    if (highValueDeals.length > 0) {
      insights.push({
        id: 'high-value-deals',
        type: 'opportunity',
        title: 'High-Value Opportunities Identified',
        description: `${highValueDeals.length} deals worth $${(highValueDeals.reduce((sum, opp) => sum + opp.value, 0) / 1000000).toFixed(1)}M are above average deal size. Focus sales efforts here.`,
        impact: 'high',
        confidence: 92
      })
    }

    // Analyze at-risk deals
    const atRiskDeals = opportunities.filter(opp => {
      const daysToClose = Math.ceil((new Date(opp.closeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return daysToClose < 30 && opp.probability < 75 && opp.stage !== 'closed-won' && opp.stage !== 'closed-lost'
    })

    if (atRiskDeals.length > 0) {
      insights.push({
        id: 'at-risk-deals',
        type: 'risk',
        title: 'Deals at Risk of Slipping',
        description: `${atRiskDeals.length} deals worth $${(atRiskDeals.reduce((sum, opp) => sum + opp.value, 0) / 1000000).toFixed(1)}M are closing within 30 days but have low probability. Immediate action needed.`,
        impact: 'high',
        confidence: 88
      })
    }

    // Analyze pipeline health
    const pipelineByStage = opportunities.reduce((acc, opp) => {
      acc[opp.stage] = (acc[opp.stage] || 0) + opp.value
      return acc
    }, {} as Record<string, number>)

    const prospectingValue = pipelineByStage['prospecting'] || 0
    const totalPipeline = Object.values(pipelineByStage).reduce((sum, value) => sum + value, 0)
    
    if (prospectingValue / totalPipeline < 0.3) {
      insights.push({
        id: 'pipeline-health',
        type: 'recommendation',
        title: 'Pipeline Generation Needed',
        description: `Only ${Math.round((prospectingValue / totalPipeline) * 100)}% of pipeline is in prospecting stage. Increase lead generation activities to maintain healthy pipeline.`,
        impact: 'medium',
        confidence: 85
      })
    }

    // Analyze win rate trends
    const closedDeals = opportunities.filter(opp => opp.stage === 'closed-won' || opp.stage === 'closed-lost')
    const winRate = closedDeals.length > 0 ? (opportunities.filter(opp => opp.stage === 'closed-won').length / closedDeals.length) * 100 : 0

    if (winRate > 0) {
      insights.push({
        id: 'win-rate',
        type: 'trend',
        title: `Win Rate Analysis: ${Math.round(winRate)}%`,
        description: winRate >= 25 
          ? `Strong win rate of ${Math.round(winRate)}% indicates effective sales process. Continue current strategies.`
          : `Win rate of ${Math.round(winRate)}% is below industry average. Review qualification and closing processes.`,
        impact: winRate >= 25 ? 'low' : 'medium',
        confidence: 90
      })
    }

    // Analyze deal concentration
    const topOwners = opportunities.reduce((acc, opp) => {
      acc[opp.owner] = (acc[opp.owner] || 0) + opp.value
      return acc
    }, {} as Record<string, number>)

    const sortedOwners = Object.entries(topOwners).sort(([,a], [,b]) => b - a)
    const topOwnerValue = sortedOwners[0]?.[1] || 0
    const topOwnerPercentage = (topOwnerValue / totalPipeline) * 100

    if (topOwnerPercentage > 40) {
      insights.push({
        id: 'deal-concentration',
        type: 'risk',
        title: 'High Deal Concentration Risk',
        description: `${sortedOwners[0]?.[0]} owns ${Math.round(topOwnerPercentage)}% of total pipeline value. Consider redistributing deals to reduce risk.`,
        impact: 'medium',
        confidence: 87
      })
    }

    return insights.slice(0, 4) // Limit to top 4 insights
  }, [opportunities])

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'risk': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'trend': return <Target className="w-4 h-4 text-blue-600" />
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-yellow-600" />
    }
  }

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'opportunity': return 'bg-green-100 text-green-800'
      case 'risk': return 'bg-red-100 text-red-800'
      case 'trend': return 'bg-blue-100 text-blue-800'
      case 'recommendation': return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getImpactColor = (impact: Insight['impact']) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <CardTitle>AI-Powered Insights</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          {loading ? 'Analyzing...' : `Real-time analysis of ${opportunities.length} Salesforce opportunities`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            ))
          ) : insights.length > 0 ? (
            insights.map((insight) => (
              <div key={insight.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getImpactColor(insight.impact)} variant="secondary">
                      {insight.impact} impact
                    </Badge>
                    <Badge className={getInsightColor(insight.type)} variant="secondary">
                      {insight.type}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <span className="text-xs font-medium text-gray-700">{insight.confidence}%</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No insights available yet</p>
              <p className="text-xs">Connect Salesforce data to see AI-powered recommendations</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}