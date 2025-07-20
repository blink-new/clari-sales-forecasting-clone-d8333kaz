import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database,
  TrendingUp,
  Users,
  Building
} from 'lucide-react'
import { salesforceService } from '@/services/salesforce'

interface SyncStatus {
  isConnected: boolean
  lastSync: Date | null
  syncInProgress: boolean
  error: string | null
  dataStats: {
    opportunities: number
    accounts: number
    users: number
    lastUpdated: Date | null
  }
}

export function SalesforceSync() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isConnected: false,
    lastSync: null,
    syncInProgress: false,
    error: null,
    dataStats: {
      opportunities: 0,
      accounts: 0,
      users: 0,
      lastUpdated: null
    }
  })

  const [syncProgress, setSyncProgress] = useState(0)

  useEffect(() => {
    const initConnection = async () => {
      try {
        await salesforceService.authenticate()
        setSyncStatus(prev => ({
          ...prev,
          isConnected: salesforceService.isConnected(),
          error: salesforceService.isUsingMockData() ? 'Using demo data - Salesforce not connected' : null
        }))
        await loadDataStats()
      } catch (error) {
        setSyncStatus(prev => ({
          ...prev,
          isConnected: false,
          error: error instanceof Error ? error.message : 'Connection failed'
        }))
      }
    }
    initConnection()
  }, [])

  const checkConnection = async () => {
    try {
      await salesforceService.authenticate()
      setSyncStatus(prev => ({
        ...prev,
        isConnected: salesforceService.isConnected(),
        error: salesforceService.isUsingMockData() ? 'Using demo data - Salesforce not connected' : null
      }))
      await loadDataStats()
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }))
    }
  }

  const loadDataStats = async () => {
    try {
      const [opportunities, accounts, users] = await Promise.all([
        salesforceService.getOpportunities(1000),
        salesforceService.getAccounts(1000),
        salesforceService.getUsers()
      ])

      setSyncStatus(prev => ({
        ...prev,
        dataStats: {
          opportunities: opportunities.length,
          accounts: accounts.length,
          users: users.length,
          lastUpdated: new Date()
        }
      }))
    } catch (error) {
      console.error('Failed to load data stats:', error)
    }
  }

  const performFullSync = async () => {
    setSyncStatus(prev => ({ ...prev, syncInProgress: true, error: null }))
    setSyncProgress(0)

    try {
      // Step 1: Authenticate
      setSyncProgress(20)
      await salesforceService.authenticate()

      // Step 2: Sync Opportunities
      setSyncProgress(40)
      await salesforceService.getOpportunities(1000)

      // Step 3: Sync Accounts
      setSyncProgress(60)
      await salesforceService.getAccounts(1000)

      // Step 4: Sync Users
      setSyncProgress(80)
      await salesforceService.getUsers()

      // Step 5: Update stats
      setSyncProgress(100)
      await loadDataStats()

      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        lastSync: new Date(),
        isConnected: true,
        error: null
      }))

      // Reset progress after a short delay
      setTimeout(() => setSyncProgress(0), 1000)
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      }))
      setSyncProgress(0)
    }
  }

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Salesforce Integration</span>
          </div>
          <Badge 
            variant={syncStatus.isConnected ? "default" : salesforceService.isUsingMockData() ? "secondary" : "destructive"}
            className={syncStatus.isConnected ? "bg-green-500" : salesforceService.isUsingMockData() ? "bg-blue-500" : ""}
          >
            {syncStatus.isConnected ? (
              <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
            ) : salesforceService.isUsingMockData() ? (
              <><Database className="w-3 h-3 mr-1" /> Demo Mode</>
            ) : (
              <><AlertCircle className="w-3 h-3 mr-1" /> Disconnected</>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Last sync:</span>
            <span className="text-sm font-medium">
              {formatLastSync(syncStatus.lastSync)}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={performFullSync}
            disabled={syncStatus.syncInProgress}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
            {syncStatus.syncInProgress ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {/* Sync Progress */}
        {syncStatus.syncInProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Syncing data...</span>
              <span>{syncProgress}%</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        {/* Error Alert */}
        {syncStatus.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {syncStatus.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Data Statistics */}
        {(syncStatus.isConnected || salesforceService.isUsingMockData()) && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-blue-900">
                {syncStatus.dataStats.opportunities.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">Opportunities</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Building className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-green-900">
                {syncStatus.dataStats.accounts.toLocaleString()}
              </div>
              <div className="text-xs text-green-600">Accounts</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-semibold text-purple-900">
                {syncStatus.dataStats.users.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600">Users</div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection}
            className="flex-1"
          >
            Test Connection
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadDataStats}
            className="flex-1"
          >
            Refresh Stats
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}