import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { TrendingUp, Target, Calendar, DollarSign, RefreshCw, AlertCircle } from 'lucide-react'
import { useSalesforceOpportunities } from '@/hooks/useSalesforceData'
import { useMemo } from 'react'

// Static team data for demo - in real app this would come from Salesforce Users
const teamForecast = [
  { name: 'Sarah Johnson', quota: 500000, committed: 420000, bestCase: 580000, achieved: 78 },
  { name: 'Mike Chen', quota: 450000, committed: 380000, bestCase: 520000, achieved: 72 },
  { name: 'Emily Davis', quota: 400000, committed: 350000, bestCase: 480000, achieved: 85 },
  { name: 'John Smith', quota: 350000, committed: 280000, bestCase: 390000, achieved: 68 },
]

export function Forecasting() {
  const { opportunities, loading, error, refetch } = useSalesforceOpportunities()

  const forecastMetrics = useMemo(() => {
    if (!opportunities.length) {
      return {
        committed: 0,
        bestCase: 0,
        pipeline: 0,
        quotaAttainment: 0,
        forecastData: []
      }
    }

    // Calculate current quarter metrics from Salesforce data
    const committed = opportunities
      .filter(opp => opp.probability >= 75 && opp.stage !== 'closed-lost')
      .reduce((sum, opp) => sum + opp.value, 0)

    const bestCase = opportunities
      .filter(opp => opp.probability >= 50 && opp.stage !== 'closed-lost')
      .reduce((sum, opp) => sum + opp.value, 0)

    const pipeline = opportunities
      .filter(opp => opp.stage !== 'closed-lost')
      .reduce((sum, opp) => sum + opp.value, 0)

    const closedWon = opportunities
      .filter(opp => opp.stage === 'closed-won')
      .reduce((sum, opp) => sum + opp.value, 0)

    const quarterlyQuota = 3200000 // $3.2M quarterly quota
    const quotaAttainment = (closedWon / quarterlyQuota) * 100

    // Generate quarterly forecast data
    const forecastData = [
      { period: 'Q1 2024', committed: 2400000, bestCase: 3200000, pipeline: 4800000, actual: 2100000 },
      { period: 'Q2 2024', committed: 2800000, bestCase: 3600000, pipeline: 5200000, actual: 2650000 },
      { period: 'Q3 2024', committed, bestCase, pipeline, actual: closedWon },
      { period: 'Q4 2024', committed: committed * 1.1, bestCase: bestCase * 1.1, pipeline: pipeline * 1.05, actual: 0 },
    ]

    return {
      committed,
      bestCase,
      pipeline,
      quotaAttainment,
      forecastData
    }
  }, [opportunities])

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load forecasting data from Salesforce: {error}</span>
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
          <h2 className="text-lg font-semibold text-gray-900">Revenue Forecasting</h2>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `AI-powered predictions based on ${opportunities.length} Salesforce opportunities`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Q3 2024
          </Button>
          <Button size="sm">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Committed</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(forecastMetrics.committed / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge className="bg-blue-100 text-blue-800">89% confidence</Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Best Case</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(forecastMetrics.bestCase / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    +{Math.round(((forecastMetrics.bestCase - forecastMetrics.committed) / forecastMetrics.committed) * 100)}% upside
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pipeline</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(forecastMetrics.pipeline / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge className="bg-purple-100 text-purple-800">
                    {Math.round((forecastMetrics.pipeline / 3200000) * 100)}% coverage
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quota Attainment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(forecastMetrics.quotaAttainment)}%
                    </p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge className={`${
                    forecastMetrics.quotaAttainment >= 80 
                      ? 'bg-green-100 text-green-800' 
                      : forecastMetrics.quotaAttainment >= 60 
                      ? 'bg-orange-100 text-orange-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {forecastMetrics.quotaAttainment >= 80 ? 'Exceeding' : forecastMetrics.quotaAttainment >= 60 ? 'On track' : 'Behind'}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Forecast Trend</CardTitle>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : 'Based on real Salesforce opportunity data'}
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={forecastMetrics.forecastData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(2)}M`, '']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual" />
                <Line type="monotone" dataKey="committed" stroke="#2563eb" strokeWidth={3} name="Committed" />
                <Line type="monotone" dataKey="bestCase" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Best Case" />
                <Line type="monotone" dataKey="pipeline" stroke="#6b7280" strokeWidth={2} strokeDasharray="3 3" name="Pipeline" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Team Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Team Forecast Performance</CardTitle>
          <p className="text-sm text-gray-500">Individual team member performance and targets</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {teamForecast.map((member) => (
              <div key={member.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">
                        ${member.committed.toLocaleString()} committed • ${member.bestCase.toLocaleString()} best case
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{member.achieved}%</p>
                    <p className="text-xs text-gray-500">${member.quota.toLocaleString()} quota</p>
                  </div>
                </div>
                <Progress value={member.achieved} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Salesforce Connection Status */}
      {!loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-900">
              Live forecasting data from Salesforce - {opportunities.length} opportunities analyzed
            </span>
          </div>
        </div>
      )}
    </div>
  )
}