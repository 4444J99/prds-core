import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@prds/ui/card'
import { Badge } from '@prds/ui/badge'
import { Button } from '@prds/ui/button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@prds/ui/table'
import { Separator } from '@prds/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@prds/ui/tabs'

const prospect = {
  id: '1',
  company: 'Pacific Coast Distributors LLC',
  state: 'CA',
  score: 82,
  grade: 'B+',
  industry: 'Wholesale Distribution',
  status: 'qualified',
  lastEnriched: '2 hours ago',
  companyNameNormalized: 'pacific coast distributors llc',
  employeeCount: 34,
  revenueEstimate: '$2.4M',
  growthSignals: ['hiring_detected', 'new_permits', 'equipment_purchase'],
  healthGrade: 'B+',
  priorityScore: 82,
  uccFilings: [
    { filing_number: '2024-0847291', secured_party: 'National Funding Inc', filing_date: '2024-03-15', type: 'UCC-1', status: 'active', collateral: 'Equipment and inventory' },
    { filing_number: '2023-1124567', secured_party: 'Quick Capital LLC', filing_date: '2023-11-20', type: 'UCC-1', status: 'active', collateral: 'Accounts receivable' },
    { filing_number: '2022-0456789', secured_party: 'Merchant Cash Solutions', filing_date: '2022-07-10', type: 'UCC-3', status: 'terminated', collateral: 'All assets' }
  ],
  enrichment: [
    { source: 'SEC EDGAR', data: { filings: ['10-K 2023', '10-Q Q3 2024'] } },
    { source: 'OSHA', data: { inspections: 2, violations: 0 } },
    { source: 'USPTO', data: { patents: 3 } },
    { source: 'Census', data: { establishments: 2, employees: 34 } }
  ]
}

export function ProspectDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/prospects">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{prospect.company}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">{prospect.state}</Badge>
              <Badge variant={prospect.grade.startsWith('A') ? 'default' : prospect.grade.startsWith('B') ? 'secondary' : 'outline'}>
                {prospect.grade} ({prospect.score}/100)
              </Badge>
              <Badge variant={prospect.status === 'qualified' ? 'default' : prospect.status === 'review' ? 'outline' : 'destructive'}>
                {prospect.status}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export</Button>
          <Button variant="outline">Share</Button>
          <Button>Re-score</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="filings">UCC Filings</TabsTrigger>
          <TabsTrigger value="enrichment">Enrichment</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><span className="text-sm text-gray-500">Legal Name</span><p className="font-medium">{prospect.company}</p></div>
                <div><span className="text-sm text-gray-500">Normalized</span><p className="font-mono text-sm">{prospect.companyNameNormalized}</p></div>
                <div><span className="text-sm text-gray-500">State</span><p><Badge variant="secondary">{prospect.state}</Badge></p></div>
                <div><span className="text-sm text-gray-500">Industry</span><p>{prospect.industry}</p></div>
                <div><span className="text-sm text-gray-500">Employees</span><p>{prospect.employeeCount}</p></div>
                <div><span className="text-sm text-gray-500">Revenue Est.</span><p>{prospect.revenueEstimate}</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Scoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Priority Score</span>
                  <span className="text-3xl font-bold">{prospect.priorityScore}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Health Grade</span>
                  <Badge variant="default" className="text-lg">{prospect.healthGrade}</Badge>
                </div>
                <div><span className="text-sm text-gray-500">Growth Signals</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prospect.growthSignals.map((s, i) => <Badge key={i} variant="outline" className="text-xs">{s.replace('_', ' ')}</Badge>)}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Qualification</span>
                  <Badge variant="default">{prospect.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Enriched</span>
                  <span>{prospect.lastEnriched}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="filings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>UCC Filings ({prospect.uccFilings.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filing Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Filing Date</TableHead>
                    <TableHead>Secured Party</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Collateral</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prospect.uccFilings.map((filing) => (
                    <TableRow key={filing.filing_number}>
                      <TableCell className="font-mono">{filing.filing_number}</TableCell>
                      <TableCell><Badge variant="outline">{filing.type}</Badge></TableCell>
                      <TableCell>{filing.filing_date}</TableCell>
                      <TableCell>{filing.secured_party}</TableCell>
                      <TableCell><Badge variant={filing.status === 'active' ? 'default' : 'outline'}>
                        {filing.status}
                      </Badge></TableCell>
                      <TableCell className="max-w-xs truncate">{filing.collateral}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrichment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrichment Sources ({prospect.enrichment.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {prospect.enrichment.map((source) => (
                  <Card key={source.source} className="bg-gray-50">
                    <CardHeader>
                      <CardTitle>{source.source}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm bg-gray-100 p-3 rounded">{JSON.stringify(source.data, null, 2)}</pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scoring Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-blue-50">
                  <CardHeader><CardTitle className="text-sm">Intent Score</CardTitle></CardHeader>
                  <CardContent><div className="text-3xl font-bold text-blue-600">78</div></CardContent>
                </Card>
                <Card className="bg-green-50">
                  <CardHeader><CardTitle className="text-sm">Health Score</CardTitle></CardHeader>
                  <CardContent><div className="text-3xl font-bold text-green-600">84</div></CardContent>
                </Card>
                <Card className="bg-purple-50">
                  <CardHeader><CardTitle className="text-sm">Position Score</CardTitle></CardHeader>
                  <CardContent><div className="text-3xl font-bold text-purple-600">72</div></CardContent>
                </Card>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <h4 className="font-medium">Scoring Factors</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>UCC Recency (30 days)</span>
                    <Badge variant="default">Positive</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Filing Volume (3 active)</span>
                    <Badge variant="default">Positive</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Active Positions (2)</span>
                    <Badge variant="secondary">Neutral</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Growth Signals (3 detected)</span>
                    <Badge variant="default">Positive</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}