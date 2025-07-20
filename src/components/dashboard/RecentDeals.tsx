import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { MoreHorizontal, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { useSalesforceOpportunities } from '@/hooks/useSalesforceData'
import { Skeleton } from '@/components/ui/skeleton'

const stageColors = {
  prospecting: 'bg-gray-100 text-gray-800',
  qualification: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  'closed-won': 'bg-green-100 text-green-800',
  'closed-lost': 'bg-red-100 text-red-800'
}

export function RecentDeals() {
  const { opportunities, loading, error } = useSalesforceOpportunities()
  
  // Get the most recent 6 deals
  const recentDeals = opportunities.slice(0, 6)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getTrend = (probability: number) => {
    // Simple trend logic based on probability
    return probability >= 50 ? 'up' : 'down'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <span>Recent Deal Activity</span>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            <p>Failed to load deals from Salesforce</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : recentDeals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent deals found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {deal.owner.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {deal.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {deal.company} • {deal.owner}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${deal.value.toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant="secondary" 
                        className={stageColors[deal.stage as keyof typeof stageColors]}
                      >
                        {deal.probability}%
                      </Badge>
                      {getTrend(deal.probability) === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(deal.closeDate)}
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}