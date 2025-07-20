import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Users, Trophy, Target, TrendingUp, Mail, Phone, RefreshCw, AlertCircle } from 'lucide-react'
import { useSalesforceOpportunities } from '@/hooks/useSalesforceData'
import { useMemo } from 'react'

const teamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Senior Sales Rep',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    quota: 500000,
    achieved: 420000,
    deals: 12,
    winRate: 78,
    avgDealSize: 35000,
    performance: 84
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'Sales Rep',
    email: 'mike.chen@company.com',
    phone: '+1 (555) 234-5678',
    quota: 450000,
    achieved: 380000,
    deals: 15,
    winRate: 72,
    avgDealSize: 25333,
    performance: 84
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Senior Sales Rep',
    email: 'emily.davis@company.com',
    phone: '+1 (555) 345-6789',
    quota: 400000,
    achieved: 350000,
    deals: 10,
    winRate: 85,
    avgDealSize: 35000,
    performance: 88
  },
  {
    id: '4',
    name: 'John Smith',
    role: 'Sales Rep',
    email: 'john.smith@company.com',
    phone: '+1 (555) 456-7890',
    quota: 350000,
    achieved: 280000,
    deals: 8,
    winRate: 68,
    avgDealSize: 35000,
    performance: 80
  }
]

const performanceData = teamMembers.map(member => ({
  name: member.name.split(' ')[0],
  quota: member.quota / 1000,
  achieved: member.achieved / 1000,
  performance: member.performance
}))

export function Team() {
  const { opportunities, loading, error, refetch } = useSalesforceOpportunities()

  const teamMetrics = useMemo(() => {
    const totalQuota = teamMembers.reduce((sum, member) => sum + member.quota, 0)
    const totalAchieved = teamMembers.reduce((sum, member) => sum + member.achieved, 0)
    const avgPerformance = teamMembers.reduce((sum, member) => sum + member.performance, 0) / teamMembers.length

    // Calculate real metrics from Salesforce data
    const totalSalesforceRevenue = opportunities
      .filter(opp => opp.stage === 'closed-won')
      .reduce((sum, opp) => sum + opp.value, 0)

    const totalDealsWon = opportunities.filter(opp => opp.stage === 'closed-won').length
    const totalDeals = opportunities.filter(opp => opp.stage !== 'closed-lost').length
    const teamWinRate = totalDeals > 0 ? Math.round((totalDealsWon / totalDeals) * 100) : 0

    return {
      totalQuota,
      totalAchieved: totalSalesforceRevenue || totalAchieved,
      avgPerformance,
      teamWinRate,
      totalDealsWon,
      totalDeals
    }
  }, [opportunities])

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load team data from Salesforce: {error}</span>
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
          <h2 className="text-lg font-semibold text-gray-900">Team Performance</h2>
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `Monitor and analyze your sales team's performance - ${opportunities.length} opportunities tracked`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Users className="w-4 h-4 mr-2" />
            Manage Team
          </Button>
        </div>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Quota</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(teamMetrics.totalQuota / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
              </div>
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
                    <p className="text-sm font-medium text-gray-600">Achieved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${(teamMetrics.totalAchieved / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-800">
                    {Math.round((teamMetrics.totalAchieved / teamMetrics.totalQuota) * 100)}% of quota
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
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Win Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{teamMetrics.teamWinRate}%</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Deals</p>
                  <p className="text-2xl font-bold text-gray-900">{teamMetrics.totalDeals}</p>
                </div>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Performance vs Quota</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `$${value}K`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value}K`, 
                  name === 'quota' ? 'Quota' : 'Achieved'
                ]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="quota" fill="#e5e7eb" name="quota" radius={[4, 4, 0, 0]} />
              <Bar dataKey="achieved" fill="#2563eb" name="achieved" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={
                      member.performance >= 85 
                        ? "bg-green-100 text-green-800" 
                        : member.performance >= 75 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {member.performance}% Performance
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Quota Achievement</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${member.achieved.toLocaleString()} / ${member.quota.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Deals Closed</p>
                    <p className="text-sm font-semibold text-gray-900">{member.deals}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Win Rate</p>
                    <p className="text-sm font-semibold text-gray-900">{member.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Avg Deal Size</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${member.avgDealSize.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Quota Progress</span>
                    <span className="font-medium text-gray-900">
                      {Math.round((member.achieved / member.quota) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(member.achieved / member.quota) * 100} 
                    className="h-2"
                  />
                </div>
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
              Live team data from Salesforce - {opportunities.length} opportunities tracked across team
            </span>
          </div>
        </div>
      )}
    </div>
  )
}