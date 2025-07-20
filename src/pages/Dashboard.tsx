import { DollarSign, Target, TrendingUp, Users, AlertCircle, RefreshCw } from 'lucide-react'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ForecastChart } from '@/components/dashboard/ForecastChart'
import { PipelineOverview } from '@/components/dashboard/PipelineOverview'
import { RecentDeals } from '@/components/dashboard/RecentDeals'
import { AIInsightsEnhanced } from '@/components/dashboard/AIInsightsEnhanced'
import { SalesforceSync } from '@/components/dashboard/SalesforceSync'
import { ConnectionTest } from '@/components/salesforce/ConnectionTest'
import { useSalesforceMetrics } from '@/hooks/useSalesforceData'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SalesforceSetupGuide } from '@/components/salesforce/SetupGuide'

export function Dashboard() {
  const { metrics, loading, error, refetch } = useSalesforceMetrics()

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return `${value.toLocaleString()}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load Salesforce data: {error}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
        <SalesforceSetupGuide />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Salesforce Connection Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-900">
            Demo Mode - Using sample sales data for demonstration
          </span>
          <Button variant="ghost" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <MetricCard
              title="Total Revenue (30d)"
              value={formatCurrency(metrics.totalRevenue)}
              change={12.5}
              changeLabel="vs last month"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <MetricCard
              title="Deals Closed (30d)"
              value={metrics.dealsWon.toString()}
              change={8.2}
              changeLabel="vs last month"
              icon={<Target className="w-5 h-5" />}
            />
            <MetricCard
              title="Pipeline Value"
              value={formatCurrency(metrics.pipelineValue)}
              change={15.3}
              changeLabel="vs last month"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <MetricCard
              title="Avg Deal Size"
              value={formatCurrency(metrics.averageDealSize)}
              change={-2.1}
              changeLabel="vs last month"
              icon={<Users className="w-5 h-5" />}
              trend="down"
            />
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ForecastChart />
        <PipelineOverview />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentDeals />
        <AIInsightsEnhanced />
        <div className="space-y-6">
          <SalesforceSync />
          <ConnectionTest />
        </div>
      </div>
    </div>
  )
}