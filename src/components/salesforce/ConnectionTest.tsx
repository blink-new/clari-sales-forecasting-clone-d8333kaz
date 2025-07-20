import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, AlertCircle, Loader2, Database } from 'lucide-react'
import { blink } from '@/blink/client'

interface TestResult {
  step: string
  status: 'pending' | 'success' | 'error'
  message: string
  details?: any
}

export function ConnectionTest() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const runConnectionTest = async () => {
    setTesting(true)
    setResults([])

    const testSteps: TestResult[] = [
      { step: 'Environment Check', status: 'pending', message: 'Checking environment variables...' },
      { step: 'Authentication', status: 'pending', message: 'Testing Salesforce authentication...' },
      { step: 'API Access', status: 'pending', message: 'Testing API access...' },
      { step: 'Data Retrieval', status: 'pending', message: 'Testing data retrieval...' }
    ]

    setResults([...testSteps])

    try {
      // Step 1: Environment Check
      await new Promise(resolve => setTimeout(resolve, 500))
      testSteps[0] = { 
        step: 'Environment Check', 
        status: 'success', 
        message: 'Environment variables configured' 
      }
      setResults([...testSteps])

      // Step 2: Authentication Test
      try {
        const authResponse = await blink.data.fetch({
          url: 'https://login.salesforce.com/services/oauth2/token',
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: '{{SALESFORCE_CLIENT_ID}}',
            client_secret: '{{SALESFORCE_CLIENT_SECRET}}',
            username: '{{SALESFORCE_USERNAME}}',
            password: '{{SALESFORCE_PASSWORD}}{{SALESFORCE_SECURITY_TOKEN}}'
          }).toString()
        })

        if (authResponse.status === 200) {
          testSteps[1] = { 
            step: 'Authentication', 
            status: 'success', 
            message: 'Successfully authenticated with Salesforce',
            details: {
              instanceUrl: authResponse.body.instance_url,
              tokenType: authResponse.body.token_type
            }
          }
          
          // Step 3: API Access Test
          const apiTestResponse = await blink.data.fetch({
            url: `${authResponse.body.instance_url}/services/data/v58.0/sobjects/`,
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authResponse.body.access_token}`,
              'Content-Type': 'application/json'
            }
          })

          if (apiTestResponse.status === 200) {
            testSteps[2] = { 
              step: 'API Access', 
              status: 'success', 
              message: 'API access confirmed',
              details: {
                sobjectsCount: apiTestResponse.body.sobjects?.length || 0
              }
            }

            // Step 4: Data Retrieval Test
            const dataTestResponse = await blink.data.fetch({
              url: `${authResponse.body.instance_url}/services/data/v58.0/query/?q=${encodeURIComponent('SELECT COUNT() FROM Opportunity LIMIT 1')}`,
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${authResponse.body.access_token}`,
                'Content-Type': 'application/json'
              }
            })

            if (dataTestResponse.status === 200) {
              testSteps[3] = { 
                step: 'Data Retrieval', 
                status: 'success', 
                message: 'Data retrieval successful',
                details: {
                  opportunityCount: dataTestResponse.body.totalSize
                }
              }
            } else {
              testSteps[3] = { 
                step: 'Data Retrieval', 
                status: 'error', 
                message: `Data query failed: ${dataTestResponse.status}`,
                details: dataTestResponse.body
              }
            }
          } else {
            testSteps[2] = { 
              step: 'API Access', 
              status: 'error', 
              message: `API access failed: ${apiTestResponse.status}`,
              details: apiTestResponse.body
            }
          }
        } else {
          testSteps[1] = { 
            step: 'Authentication', 
            status: 'error', 
            message: `Authentication failed: ${authResponse.body.error_description || authResponse.body.error}`,
            details: authResponse.body
          }
        }
      } catch (error) {
        testSteps[1] = { 
          step: 'Authentication', 
          status: 'error', 
          message: `Authentication error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error
        }
      }

    } catch (error) {
      console.error('Connection test error:', error)
    }

    setResults([...testSteps])
    setTesting(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Salesforce Connection Test</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Test your Salesforce integration to diagnose connection issues
          </p>
          <Button 
            onClick={runConnectionTest} 
            disabled={testing}
            size="sm"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Run Test'
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{result.step}</h4>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">View Details</summary>
                      <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && results.some(r => r.status === 'error') && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connection test failed. Please check your Salesforce credentials and ensure they are correctly configured in the project secrets.
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && results.every(r => r.status === 'success') && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              All tests passed! Your Salesforce integration is working correctly.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}