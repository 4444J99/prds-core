import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@prds/ui/card'
import { Button } from '@prds/ui/button'
import { Input } from '@prds/ui/input'
import { Label } from '@prds/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@prds/ui/tabs'
import { Separator } from '@prds/ui/separator'
import { Switch } from '@prds/ui/switch'

export function SettingsPage() {
  const tabs = [
    { value: 'profile', label: 'Profile' },
    { value: 'security', label: 'Security' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'billing', label: 'Billing' },
    { value: 'integrations', label: 'Integrations' }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your PRDS account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@broker.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="(555) 123-4567" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="ABC Brokerage" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" defaultValue="Senior Broker" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>Manage your password and two-factor authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Switch id="2fa" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-gray-500">Update your account password</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Session Timeout</h4>
                  <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                </div>
                <select className="w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="15">15 minutes</option>
                  <option value="30" defaultValue>30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>Manage your API keys</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">API keys are managed in the Admin panel. Contact your administrator for access.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'New Prospect Alerts', description: 'When new qualified prospects match your criteria', enabled: true, channels: ['Email', 'In-App'] },
                { title: 'Deal Updates', description: 'Deal stage changes and updates', enabled: true, channels: ['Email', 'In-App'] },
                { title: 'Document Ready', description: 'When generated documents are available', enabled: true, channels: ['Email'] },
                { title: 'Weekly Digest', description: 'Weekly summary of activity', enabled: true, channels: ['Email'] },
                { title: 'System Alerts', description: 'System maintenance and outages', enabled: false, channels: ['Email'] }
              ].map((notification) => (
                <div key={notification.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`notif-${notification.title}`}
                      defaultChecked={notification.enabled}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-500">{notification.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notification.channels.map((channel) => (
                      <span key={channel} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{channel}</span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>Manage your PRDS subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Current Plan: Professional</h4>
                  <p className="text-sm text-gray-500">$299/month • Renews on Jan 15, 2026</p>
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Monthly Leads Used</p>
                  <p className="text-2xl font-bold">2,341 / 5,000</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '47%' }} />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">API Calls Today</p>
                  <p className="text-2xl font-bold">12,453 / 50,000</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Exports This Month</p>
                  <p className="text-2xl font-bold">8 / 100</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Integrations</CardTitle>
              <CardDescription>Manage your third-party connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Stripe', description: 'Payment processing', connected: true },
                { name: 'SendGrid', description: 'Email delivery', connected: false },
                { name: 'HubSpot', description: 'CRM integration', connected: false },
                { name: 'GoHighLevel', description: 'CRM integration', connected: false }
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${integration.connected ? 'text-green-600' : 'text-gray-500'}`}>
                      {integration.connected ? 'Connected' : 'Not Connected'}
                    </span>
                    <Button variant={integration.connected ? 'outline' : 'default'} size="sm">
                      {integration.connected ? 'Manage' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}