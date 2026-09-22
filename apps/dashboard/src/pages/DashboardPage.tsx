import { Card, CardContent, CardHeader, CardTitle } from '@prds/ui/card'
import { Badge } from '@prds/ui/badge'
import { Button } from '@prds/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@prds/ui/table'
import { useAuth } from '../context/AuthContext'

const recentProspects = [
  { id: '1', company: 'Pacific Coast Distributors LLC', state: 'CA', score: 82, grade: 'B+', industry: 'Wholesale', status: 'qualified', lastEnriched: '2 hours ago' },
  { id: '2', company: 'Sunrise Construction Inc', state: 'TX', score: 91, grade: 'A', industry: 'Construction', status: 'qualified', lastEnriched: '1 day ago' },
  { id: '3', company: 'Gulf Coast Marine Services', state: 'FL', score: 67, grade: 'C+', industry: 'Marine', status: 'review', lastEnriched: '3 hours ago' },
  { id: '4', company: 'Empire State Logistics', state: 'NY', score: 74, grade: 'B', industry: 'Transportation', status: 'qualified', lastEnriched: '5 hours ago' }
]

const stats = [
  { label: 'Total Prospects', value: '1,234', change: '+12%', trend: 'up' },
  { label: 'Qualified Leads', value: '342', change: '+8%', trend: 'up' },
  { label: 'Active Deals', value: '28', change: '+3', trend: 'up' },
  { label: 'Conversion Rate', value: '14.2%', change: '+1.2%', trend: 'up' }
]

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your prospects today</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>Run Enrichment</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Prospects</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <a href="/prospects">View All</a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Enriched</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProspects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="font-medium">{prospect.company}</TableCell>
                  <TableCell><Badge variant="secondary">{prospect.state}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{prospect.score}</span>
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={prospect.grade.startsWith('A') ? 'default' : prospect.grade.startsWith('B') ? 'secondary' : prospect.grade.startsWith('C') ? 'outline' : 'destructive'}>
                      {prospect.grade}
                    </Badge>
                  </TableCell>
                  <TableCell>{prospect.industry}</TableCell>
                  <TableCell>
                    <Badge variant={prospect.status === 'qualified' ? 'default' : prospect.status === 'review' ? 'outline' : 'destructive'}>
                      {prospect.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{prospect.lastEnriched}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/prospects/${prospect.id}`}>View</a>
                    </Button>
                    <Button variant="ghost" size="icon">Share</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}