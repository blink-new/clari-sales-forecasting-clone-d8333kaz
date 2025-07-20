import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette } from 'lucide-react'
import { ConnectionTest } from '@/components/salesforce/ConnectionTest'
import { SalesforceSetupGuide } from '@/components/salesforce/SetupGuide'

export function Settings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage your account and application preferences</p>
      </div>

      {/* Salesforce Integration Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium text-gray-900">Salesforce Integration</h3>
          <p className="text-sm text-gray-500">Test and manage your Salesforce connection</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesforceSetupGuide />
          <ConnectionTest />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="john.doe@company.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="Sales Manager" disabled />
            </div>

            <Separator />

            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Security Settings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Deal Updates</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when deals change stages or require attention
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Forecast Alerts</Label>
                  <p className="text-sm text-gray-500">
                    Receive alerts about forecast changes and quota progress
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Team Updates</Label>
                  <p className="text-sm text-gray-500">
                    Stay informed about team performance and activities
                  </p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">AI Insights</Label>
                  <p className="text-sm text-gray-500">
                    Get AI-powered recommendations and risk assessments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Email Frequency</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="immediate" name="frequency" defaultChecked />
                  <Label htmlFor="immediate">Immediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="daily" name="frequency" />
                  <Label htmlFor="daily">Daily Digest</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="weekly" name="frequency" />
                  <Label htmlFor="weekly">Weekly Summary</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Plan</Label>
              <div className="flex items-center space-x-2">
                <Badge className="bg-primary text-white">Enterprise</Badge>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Upgrade
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Organization</Label>
              <p className="text-sm font-medium text-gray-900">Acme Corporation</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Member Since</Label>
              <p className="text-sm font-medium text-gray-900">January 2024</p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Last Login</Label>
              <p className="text-sm font-medium text-gray-900">2 hours ago</p>
            </div>

            <Separator />

            <Button variant="destructive" size="sm" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}