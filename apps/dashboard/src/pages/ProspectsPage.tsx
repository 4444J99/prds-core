import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@prds/ui/card'
import { Button } from '@prds/ui/button'
import { Input } from '@prds/ui/input'
import { Label } from '@prds/ui/label'
import { Badge } from '@prds/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@prds/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@prds/ui/select'

const prospects = [
  { id: '1', company: 'Pacific Coast Distributors LLC', state: 'CA', score: 82, grade: 'B+', industry: 'Wholesale', status: 'qualified', lastEnriched: '2 hours ago' },
  { id: '2', company: 'Sunrise Construction Inc', state: 'TX', score: 91, grade: 'A', industry: 'Construction', status: 'qualified', lastEnriched: '1 day ago' },
  { id: '3', company: 'Gulf Coast Marine Services', state: 'FL', score: 67, grade: 'C+', industry: 'Marine', status: 'review', lastEnriched: '3 hours ago' },
  { id: '4', company: 'Empire State Logistics', state: 'NY', score: 74, grade: 'B', industry: 'Transportation', status: 'qualified', lastEnriched: '5 hours ago' },
  { id: '5', company: 'Midwest Manufacturing Co', state: 'IL', score: 58, grade: 'C', industry: 'Manufacturing', status: 'review', lastEnriched: '6 hours ago' },
  { id: '6', company: 'Southern Trucking LLC', state: 'GA', score: 45, grade: 'D', industry: 'Transportation', status: 'disqualified', lastEnriched: '1 day ago' }
]

export function ProspectsPage() {
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredProspects = prospects.filter(p => {
    const matchesSearch = p.company.toLowerCase().includes(search.toLowerCase())
    const matchesState = stateFilter === 'all' || p.state === stateFilter
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesState && matchesStatus
  })

  const states = ['all', 'CA', 'TX', 'FL', 'NY', 'IL', 'GA']
  const statuses = ['all', 'qualified', 'review', 'disqualified']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prospects</h1>
          <p className="text-gray-500 mt-1">Manage and filter your scored prospects</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export CSV</Button>
          <Button>Run Enrichment</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Prospects ({prospects.length})</CardTitle>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All States' : s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
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
              {filteredProspects.map((prospect) => (
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
                    <Badge variant={
                      prospect.status === 'qualified' ? 'default' :
                      prospect.status === 'review' ? 'outline' : 'destructive'
                    }>
                      {prospect.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{prospect.lastEnriched}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/prospects/${prospect.id}`}>View</a>
                    </Button>
                    <Button variant="ghost" size="icon">Share</Button>
                    <Button variant="ghost" size="icon">Score</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">Bulk Operations</h3>
              <p className="text-yellow-700 mt-1">Perform actions on multiple prospects at once.</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Bulk Enrich</Button>
              <Button variant="outline">Bulk Score</Button>
              <Button variant="outline">Bulk Export</Button>
              <Button variant="default">Share Selected</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}