import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Filter, MoreHorizontal, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react'
import { useSalesforceOpportunities } from '@/hooks/useSalesforceData'
import { Deal } from '@/types'

const stageConfig = [
  { id: 'prospecting', name: 'Prospecting', color: 'bg-gray-100 text-gray-800' },
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-100 text-blue-800' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100 text-green-800' },
  { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100 text-red-800' }
]

export function Pipeline() {
  const { opportunities, loading, error, refetch } = useSalesforceOpportunities()
  const [pipelineStages, setPipelineStages] = useState<Array<{
    id: string
    name: string
    color: string
    deals: Deal[]
    totalValue: number
  }>>([])

  useEffect(() => {
    if (opportunities.length > 0) {
      const stages = stageConfig.map(stage => {
        const stageDeals = opportunities.filter(deal => deal.stage === stage.id)
        const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
        
        return {
          ...stage,
          deals: stageDeals,
          totalValue
        }
      })
      setPipelineStages(stages)
    }
  }, [opportunities])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'text-green-600'
    if (probability >= 50) return 'text-yellow-600'
    if (probability >= 25) return 'text-orange-600'
    return 'text-red-600'
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load pipeline data from Salesforce: {error}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${opportunities.length} opportunities from Salesforce`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Summary */}
      {!loading && pipelineStages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {pipelineStages.map((stage) => (
            <Card key={stage.id} className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-gray-900">
                  {stage.deals.length}
                </div>
                <div className="text-xs text-gray-500 mb-1">{stage.name}</div>
                <div className="text-sm font-medium text-gray-700">
                  {formatCurrency(stage.totalValue)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pipeline Board */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {loading ? (
          // Loading skeletons
          stageConfig.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <Card>
                <CardHeader className="pb-3">
                  <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          pipelineStages.map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {stage.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {stage.deals.length}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(stage.totalValue)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {stage.deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
                          {deal.title}
                        </h4>
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-2 truncate">{deal.company}</p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(deal.value)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs font-medium ${getProbabilityColor(deal.probability)}`}>
                            {deal.probability}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate pr-2">{deal.owner}</span>
                        <span>{formatDate(deal.closeDate)}</span>
                      </div>
                      
                      {/* Progress bar based on probability */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all ${
                              deal.probability >= 75 ? 'bg-green-500' :
                              deal.probability >= 50 ? 'bg-yellow-500' :
                              deal.probability >= 25 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stage.deals.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No deals in this stage</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Salesforce Connection Status */}
      {!loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-900">
              Live data from Salesforce - {opportunities.length} opportunities loaded
            </span>
          </div>
        </div>
      )}
    </div>
  )
}