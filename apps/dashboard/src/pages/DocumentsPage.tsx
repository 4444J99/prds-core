import { Card, CardContent, CardHeader, CardTitle } from '@prds/ui/card'
import { Button } from '@prds/ui/button'
import { Input } from '@prds/ui/input'
import { Badge } from '@prds/ui/badge'

const documents = [
  { id: '1', name: 'Pacific Coast Distributors - UCC Report.pdf', type: 'UCC Report', prospect: 'Pacific Coast Distributors LLC', size: '2.4 MB', uploaded: '2 hours ago', status: 'ready' },
  { id: '2', name: 'Sunrise Construction - Enrichment Data.xlsx', type: 'Enrichment', prospect: 'Sunrise Construction Inc', size: '1.8 MB', uploaded: '1 day ago', status: 'ready' },
  { id: '3', name: 'Gulf Coast Marine - Compliance Check.pdf', type: 'Compliance', prospect: 'Gulf Coast Marine Services', size: '945 KB', uploaded: '3 hours ago', status: 'processing' },
  { id: '4', name: 'Empire State Logistics - Scoring Breakdown.pdf', type: 'Scoring', prospect: 'Empire State Logistics', size: '1.2 MB', uploaded: '5 hours ago', status: 'ready' }
]

export function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">Manage and share generated documents</p>
        </div>
        <Button>Generate Report</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Documents ({documents.length})</CardTitle>
            <Input placeholder="Search documents..." className="w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.type} • {doc.prospect}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={doc.status === 'ready' ? 'default' : 'outline'}>
                    {doc.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{doc.size}</span>
                  <span className="text-sm text-gray-500">{doc.uploaded}</span>
                  <Button variant="ghost" size="icon">Download</Button>
                  <Button variant="ghost" size="icon">Share</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}