import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'

export function SalesforceSetupGuide() {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Salesforce Integration Setup</span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Required
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">
          To connect your Salesforce data, you'll need to provide your Salesforce credentials in the project secrets.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">1. Get your Salesforce credentials</p>
              <p className="text-xs text-gray-600">
                You'll need: Client ID, Client Secret, Username, Password, Security Token, and Instance URL
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">2. Create a Connected App in Salesforce</p>
              <p className="text-xs text-gray-600">
                Setup → App Manager → New Connected App with OAuth settings
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium">3. Add credentials to project secrets</p>
              <p className="text-xs text-gray-600">
                The required secrets have been added to your project. Update them with your actual values.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://help.salesforce.com/s/articleView?id=sf.connected_app_create.htm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Salesforce Setup Guide</span>
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://blink.new/settings/secrets" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Update Secrets</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}