import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Brain, AlertTriangle, TrendingUp, Target, Clock, DollarSign } from 'lucide-react'
import { useSalesforceOpportunities } from '@/hooks/useSalesforceData'
import { useMemo } from 'react'

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200'
}

const typeColors = {
  risk: 'text-red-600',
  opportunity: 'text-green-600',
  forecast: 'text-blue-600',
  timing: 'text-orange-600'
}

export function AIInsights() {
  const { opportunities, loading } = useSalesforceOpportunities()

  const insights = useMemo(() => {
    if (!opportunities.length) return []

    const generatedInsights = []

    // Find deals at risk (in negotiation for too long)
    const riskDeals = opportunities.filter(deal => 
      deal.stage === 'negotiation' && 
      new Date().getTime() - new Date(deal.lastActivity || deal.createdDate).getTime() > 30 * 24 * 60 * 60 * 1000 // 30 days
    )

    if (riskDeals.length > 0) {
      const topRiskDeal = riskDeals.sort((a, b) => b.value - a.value)[0]
      generatedInsights.push({
        id: 'risk-1',
        type: 'risk',
        title: 'Deal at Risk',
        description: `${topRiskDeal.title} (${topRiskDeal.company}) worth $${(topRiskDeal.value / 1000).toFixed(0)}K has been stalled. Consider escalating to close.`,
        priority: 'high',
        icon: AlertTriangle,
        action: 'Review Deal'
      })
    }

    // Find upsell opportunities (high-value closed deals)
    const recentWins = opportunities.filter(deal => 
      deal.stage === 'closed-won' && 
      new Date().getTime() - new Date(deal.closeDate).getTime() < 90 * 24 * 60 * 60 * 1000 // 90 days
    )

    if (recentWins.length > 0) {
      const topWin = recentWins.sort((a, b) => b.value - a.value)[0]
      generatedInsights.push({
        id: 'opportunity-1',
        type: 'opportunity',
        title: 'Upsell Opportunity',
        description: `${topWin.company} recently closed for $${(topWin.value / 1000).toFixed(0)}K. High potential for additional services.`,
        priority: 'medium',
        icon: TrendingUp,
        action: 'Create Proposal'
      })
    }

    // Calculate quota achievement
    const closedWonValue = opportunities
      .filter(deal => deal.stage === 'closed-won')
      .reduce((sum, deal) => sum + deal.value, 0)
    
    const quarterlyQuota = 1000000 // $1M quarterly quota
    const quotaAchievement = (closedWonValue / quarterlyQuota) * 100

    generatedInsights.push({
      id: 'forecast-1',
      type: 'forecast',
      title: 'Quota Achievement',
      description: `You're ${quotaAchievement.toFixed(0)}% to quota. ${quotaAchievement < 80 ? 'Focus on high-probability deals to hit target.' : 'On track to exceed quota this quarter!'}`,
      priority: quotaAchievement < 60 ? 'high' : quotaAchievement < 80 ? 'medium' : 'low',
      icon: Target,
      action: 'View Deals'
    })

    // Find stale opportunities (no recent activity)
    const staleDeals = opportunities.filter(deal => 
      deal.stage !== 'closed-won' && 
      deal.stage !== 'closed-lost' &&
      new Date().getTime() - new Date(deal.lastActivity || deal.createdDate).getTime() > 7 * 24 * 60 * 60 * 1000 // 7 days
    )

    if (staleDeals.length > 0) {
      generatedInsights.push({
        id: 'timing-1',
        type: 'timing',
        title: 'Follow-up Reminder',
        description: `${staleDeals.length} prospects haven't been contacted in 7+ days. Schedule follow-ups to maintain momentum.`,
        priority: 'low',
        icon: Clock,
        action: 'Schedule Calls'
      })
    }

    // High-value pipeline insight
    const highValueDeals = opportunities.filter(deal => 
      deal.value > 50000 && 
      deal.stage !== 'closed-won' && 
      deal.stage !== 'closed-lost'
    )

    if (highValueDeals.length > 0) {
      const totalValue = highValueDeals.reduce((sum, deal) => sum + deal.value, 0)
      generatedInsights.push({
        id: 'value-1',
        type: 'opportunity',
        title: 'High-Value Pipeline',
        description: `${highValueDeals.length} deals worth $${(totalValue / 1000000).toFixed(1)}M in pipeline. Focus on these for maximum impact.`,
        priority: 'medium',
        icon: DollarSign,
        action: 'Prioritize'
      })
    }

    return generatedInsights.slice(0, 4) // Show top 4 insights
  }, [opportunities])

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle>AI Insights</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            98% Accuracy
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-12 w-full mb-3" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary" />
          <CardTitle>AI Insights</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          98% Accuracy
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight) => {
              const Icon = insight.icon
              return (
                <div 
                  key={insight.id} 
                  className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${typeColors[insight.type as keyof typeof typeColors]}`} />
                      <h4 className="text-sm font-medium text-gray-900">
                        {insight.title}
                      </h4>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${priorityColors[insight.priority as keyof typeof priorityColors]}`}
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {insight.description}
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    {insight.action}
                  </Button>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Brain className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No insights available yet</p>
              <p className="text-xs text-gray-500">AI insights will appear as data is analyzed</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button variant="outline" className="w-full">
            View All Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}